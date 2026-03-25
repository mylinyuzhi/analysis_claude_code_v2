# Sandbox Cross-Module Integration (Claude Code 2.1.76)

## Overview

The sandbox system integrates deeply with multiple Claude Code modules. This document maps all integration points, showing how sandbox connects to system reminders, permissions, hooks, Bash tool, and other features.

## Symbol Validation Status (v2.1.76) ✅

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `E9z` | getSandboxSystemPromptBlock | chunks.171.mjs:1892 | ✅ Validated |
| `Ti` | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated |
| `yYz` | isCommandInExcludedList | chunks.172.mjs:2412 | ✅ Validated |
| `yfq` | parseExclusionPattern | chunks.172.mjs:1530 | ✅ Validated |
| `Ln8` | extractPrefixPattern | chunks.172.mjs:1488 | ✅ Validated |
| `TYz` | isWildcardPattern | chunks.172.mjs:1492 | ✅ Validated |
| `Cn8` | matchWildcardPattern | chunks.172.mjs:1645 | ✅ Validated |
| `Ac` | extractCommandBasename | chunks.172.mjs:1660 | ✅ Validated |

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Sandbox section
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks section

Key symbols in this document:
- `getSandboxSystemPromptBlock` (E9z) - Generates sandbox instructions for Bash tool system prompt
- `isCommandSandboxed` (Ti) - Determines if a command should be sandboxed
- `isSandboxingEnabled` (h21) - Global sandbox enabled check
- `checkBashPermissionWithSandbox` (Ezz) - Permission decision with sandbox context
- `SandboxViolationStore` (HD6) - Stores violation events for UI and model context
- `isCommandInExcludedList` (yYz) - Checks if command matches exclusion patterns
- `parseExclusionPattern` (yfq) - Parses pattern into type/prefix/command structure

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Sandbox Integration Points                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  04_system_reminder (System Prompts)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Sandbox config injected into Bash tool system prompt              │    │
│  │ • dangerouslyDisableSandbox usage instructions                      │    │
│  │ • mcp-cli exception for sandbox bypass                              │    │
│  │ • TMPDIR=/tmp/claude temp directory guidance                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  05_tools (Bash Tool)                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • wrapWithSandbox() wraps every command                             │    │
│  │ • isCommandSandboxed() determines if wrapping needed                │    │
│  │ • dangerouslyDisableSandbox input parameter                         │    │
│  │ • Command output annotated with sandbox violations                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  11_hooks (Hook System)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • beforeFileEdited hook → capture diagnostic baseline               │    │
│  │ • PostToolUse hook can observe sandbox violations                   │    │
│  │ • Hooks run in unsandboxed parent process                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  37_permission_policy (Permissions)                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Auto-allow logic: sandbox + autoAllowBashIfSandboxed             │    │
│  │ • Sandbox permission prompt for dangerouslyDisableSandbox           │    │
│  │ • Domain-based network permissions for sandbox proxy                │    │
│  │ • Permission rules mirrored to sandbox filesystem config            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  06_mcp (MCP Protocol)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • mcp-cli commands exempt from sandboxing                           │    │
│  │ • MCP server communication runs unsandboxed                         │    │
│  │ • Proxy filtering applies to MCP network calls                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  01_cli (UI/CLI)                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • /sandbox slash command for configuration                          │    │
│  │ • Status bar violation indicator                                    │    │
│  │ • Permission prompt shows "Bash command (unsandboxed)"              │    │
│  │ • /doctor shows dependency status                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Integration with 04_system_reminder

### System Prompt Injection

**What it does:** Sandbox configuration and instructions are injected into the Bash tool's system prompt so the model understands how to work with sandboxing.

**How it works:**
The `getSandboxSystemPromptBlock` (E9z) function generates detailed instructions:

```javascript
// ============================================
// getSandboxSystemPromptBlock - Sandbox instructions for Bash tool
// Location: chunks.171.mjs:1892-1923 (Ln 440852)
// ============================================

// ORIGINAL (for source lookup):
function E9z() {
    if (!vA.isSandboxingEnabled()) return "";
    let A = vA.getFsReadConfig(),
        q = vA.getFsWriteConfig(),
        K = vA.getNetworkRestrictionConfig(),
        Y = vA.getAllowUnixSockets(),
        z = vA.getIgnoreViolations(),
        _ = vA.areUnsandboxedCommandsAllowed(),
        w = { read: A, write: q },
        O = {
            ...K?.allowedHosts && { allowedHosts: K.allowedHosts },
            ...K?.deniedHosts && { deniedHosts: K.deniedHosts },
            ...Y && { allowUnixSockets: Y }
        },
        $ = [];
    if (Object.keys(w).length > 0) $.push(`Filesystem: ${B6(w)}`);
    if (Object.keys(O).length > 0) $.push(`Network: ${B6(O)}`);
    if (z) $.push(`Ignored violations: ${B6(z)}`);
    let j = [..._ ? [/* open mode instructions */] : [/* closed mode instructions */],
        `For temporary files, always use the \`$TMPDIR\` environment variable...`];
    return ["", "## Command sandbox", "By default, your command will be run in a sandbox...", $.join(`
`), "", ...fi(j)].join(`
`)
}

// READABLE (for understanding):
function getSandboxSystemPromptBlock() {
    // Gate: Sandbox disabled? Return empty string (no instructions)
    if (!sandboxConfigObject.isSandboxingEnabled()) return "";

    // Gather all current sandbox configuration
    let readConfig = sandboxConfigObject.getFsReadConfig();
    let writeConfig = sandboxConfigObject.getFsWriteConfig();
    let networkConfig = sandboxConfigObject.getNetworkRestrictionConfig();
    let allowUnixSockets = sandboxConfigObject.getAllowUnixSockets();
    let ignoreViolations = sandboxConfigObject.getIgnoreViolations();
    let fallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();

    // Build filesystem restrictions object
    let filesystemRestrictions = { read: readConfig, write: writeConfig };

    // Build network restrictions object (conditional fields)
    let networkRestrictions = {
        ...(networkConfig?.allowedHosts && { allowedHosts: networkConfig.allowedHosts }),
        ...(networkConfig?.deniedHosts && { deniedHosts: networkConfig.deniedHosts }),
        ...(allowUnixSockets && { allowUnixSockets: allowUnixSockets })
    };

    // Build restrictions list for display
    let restrictions = [];
    if (Object.keys(filesystemRestrictions).length > 0) {
        restrictions.push(`Filesystem: ${JSON.stringify(filesystemRestrictions)}`);
    }
    if (Object.keys(networkRestrictions).length > 0) {
        restrictions.push(`Network: ${JSON.stringify(networkRestrictions)}`);
    }
    if (ignoreViolations) {
        restrictions.push(`Ignored violations: ${JSON.stringify(ignoreViolations)}`);
    }

    // Branch: Open mode (allow fallback) vs Closed mode (no fallback)
    let instructions = fallbackAllowed ? [
        "You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:",
        ["The user *explicitly* asks you to bypass sandbox",
         "A specific command just failed and you see evidence of sandbox restrictions causing the failure."],
        "Evidence of sandbox-caused failures includes:",
        ['"Operation not permitted" errors for file/network operations',
         "Access denied to specific paths outside allowed directories",
         "Network connection failures to non-whitelisted hosts",
         "Unix socket connection errors"],
        "When you see evidence of sandbox-caused failure:",
        ["Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)",
         "Briefly explain what sandbox restriction likely caused the failure.",
         "This will prompt the user for permission"],
        // Anti-learning pattern: prevent model from continuing to bypass
        "Treat each command you execute with `dangerouslyDisableSandbox: true` individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.",
        "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."
    ] : [
        // Closed mode: fallback is disabled by policy
        "All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.",
        "Commands cannot run outside the sandbox under any circumstances.",
        "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
    ];

    // Add TMPDIR guidance (always included)
    instructions.push(
        `For temporary files, always use the \`$TMPDIR\` environment variable (or \`${getTempDir()}\` as a fallback). ` +
        `TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. ` +
        `Do NOT use \`/tmp\` directly - use \`$TMPDIR\` or \`${getTempDir()}\` instead.`
    );

    // Return formatted block
    return [
        "",
        "## Command sandbox",
        "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.",
        "",
        "The sandbox has the following restrictions:",
        restrictions.join("\n"),
        "",
        ...formatInstructions(instructions)
    ].join("\n");
}

// Mapping: E9z→getSandboxSystemPromptBlock, vA→sandboxConfigObject, A→readConfig, q→writeConfig,
//          K→networkConfig, Y→allowUnixSockets, z→ignoreViolations, _→fallbackAllowed,
//          B6→JSON.stringify, fi→formatInstructions, _k→getTempDir

// READABLE (for understanding):
async function getSandboxSystemPromptBlock(toolUseContext) {
    if (!sandboxConfigObject.isSandboxingEnabled()) return "";

    let readConfig = sandboxConfigObject.getFsReadConfig();
    let writeConfig = sandboxConfigObject.getFsWriteConfig();
    let networkConfig = sandboxConfigObject.getNetworkRestrictionConfig();
    let allowUnixSockets = sandboxConfigObject.getAllowUnixSockets();
    let ignoreViolations = sandboxConfigObject.getIgnoreViolations();
    let fallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();
    let mcpCliEnabled = sandboxConfigObject.isMcpCliEnabled();

    // Build restrictions object
    let restrictions = [];
    if (Object.keys({ read: readConfig, write: writeConfig }).length > 0) {
        restrictions.push(`    - Filesystem: ${JSON.stringify({ read: readConfig, write: writeConfig })}`);
    }
    if (Object.keys(networkConfig).length > 0) {
        restrictions.push(`    - Network: ${JSON.stringify(networkConfig)}`);
    }

    // mcp-cli exception
    let mcpCliException = mcpCliEnabled ?
        "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n" : "";

    // Instructions differ based on override policy
    let instructions = fallbackAllowed ? `
  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
    - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox
${mcpCliException}    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions causing the failure
    - When analyzing failures:
      - Evidence of sandbox-caused failures includes:
        - "Operation not permitted" errors for file/network operations
        - Access denied to specific paths outside allowed directories
        - Network connection failures to non-whitelisted hosts
    - When you see evidence of sandbox-caused failure:
      - IMMEDIATELY retry with \`dangerouslyDisableSandbox: true\` (don't ask, just do it)
      - Briefly explain what sandbox restriction likely caused the failure
` : `
  - CRITICAL: All commands MUST run in sandbox mode - the \`dangerouslyDisableSandbox\` parameter is disabled by policy
`;

    return `- Commands run in a sandbox by default with the following restrictions:
${restrictions.join("\n")}
${instructions}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
`;
}

// Mapping: E9z→getSandboxSystemPromptBlock, vA→sandboxConfigObject, q→readConfig, K→writeConfig, Y→networkConfig
```

### Key Design Decisions

**Why serialize restrictions as JSON:**
- Exact context about allowed/denied paths
- No ambiguity about what's permitted
- Model can reason precisely about path matching

**Why "CRITICAL: do NOT continue the pattern":**
- Combats LLM failure mode where model applies `dangerouslyDisableSandbox: true` to all commands after one success
- Explicit warning against learned behavior

**Why mcp-cli exception:**
- `mcp-cli` commands route through parent process MCP connections
- Not actual shell commands - don't need sandbox protection
- Parent handles actual tool execution with proper sandboxing

---

## 2. Integration with 05_tools (Bash Tool)

### Command Wrapping Flow

```
Bash tool call received
    │
    ▼
isCommandSandboxed(Ti) check
    │
    ├─ Returns false:
    │  └─ Command runs normally (no wrapping)
    │
    └─ Returns true:
       └─ wrapWithSandbox() called
              │
              ├─ macOS: wrapWithMacOSSandbox() (Ye8)
              │     └─ sandbox-exec -p <SBPL> /bin/bash -c <command>
              │
              └─ Linux: wrapWithLinuxSandbox() (uZ7)
                    └─ bwrap --unshare-net --ro-bind / / ... -- /bin/bash -c <command>
```

### isCommandSandboxed Decision Logic

```javascript
// ============================================
// isCommandSandboxed - Determines if command should be sandboxed
// Location: chunks.172.mjs:2454-2460
// ============================================

// ORIGINAL (for source lookup):
function Ti(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && vA.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (yYz(A.command)) return !1;
    return !0
}

// READABLE (for understanding):
function isCommandSandboxed(toolInput) {
    // Gate 1: Global sandbox off
    if (!sandboxConfigObject.isSandboxingEnabled()) return false;

    // Gate 2: Model override (only if fallback allowed)
    if (toolInput.dangerouslyDisableSandbox && sandboxConfigObject.areUnsandboxedCommandsAllowed()) {
        return false;
    }

    // Gate 3: No command string
    if (!toolInput.command) return false;

    // Gate 4: Command matches exclusion pattern
    if (isCommandInExcludedList(toolInput.command)) return false;

    return true;
}

// Mapping: Ti→isCommandSandboxed, A→toolInput, yYz→isCommandInExcludedList, vA→sandboxConfigObject
```

### The 4 Gates (in order)

| Gate | Condition | Result |
|------|-----------|--------|
| 1 | `!isSandboxingEnabled()` | false (no sandbox) |
| 2 | `dangerouslyDisableSandbox && allowUnsandboxedCommands` | false (model override) |
| 3 | `!command` | false (no command to sandbox) |
| 4 | `isCommandInExcludedList()` | false (excluded pattern) |
| - | All gates passed | true (sandbox it) |

### Violation Annotation

When a sandboxed command has violations (macOS), they're annotated in stderr:

```javascript
// annotateStderrWithSandboxFailures (YW5)
// Appends to stderr:
<sandbox_violations>
Sandbox: file-write* deny /etc/passwd
Sandbox: network-outbound deny 192.168.1.1:443
</sandbox_violations>
```

---

## 3. Integration with 11_hooks

### beforeFileEdited Hook

**What it does:** Before the Edit tool modifies a file, the sandbox captures a diagnostic baseline.

**Why:** New diagnostics since edit are more actionable than pre-existing issues.

```javascript
// In DiagnosticsManager.beforeFileEdited()
async beforeFileEdited(filePath) {
    let diagnostics = await ideClient.callTool("getDiagnostics", { uri: `file://${filePath}` });
    this.baseline.set(filePath, diagnostics);
}
```

### Hook Execution Context

**Important:** Hooks run in the unsandboxed parent process, not inside sandbox.

```
Hook triggered (e.g., PreToolUse)
    │
    ▼
Hook script executes
    │
    ├─ File access: NOT sandboxed
    ├─ Network access: NOT sandboxed
    └─ Command execution: Uses normal shell (not sandboxed)
```

This is by design - hooks are trusted code that can perform privileged operations.

---

## 4. Integration with 37_permission_policy

### Auto-Allow Decision Logic

**What it does:** When sandbox is enabled and `autoAllowBashIfSandboxed` is true, bash commands are automatically approved without prompting.

```javascript
// ============================================
// checkBashPermissionWithSandbox - Permission decision with sandbox context
// Location: chunks.172.mjs:1363
// ============================================

// READABLE (for understanding):
function checkBashPermissionWithSandbox(toolInput) {
    // Check if auto-allow applies
    if (sandboxConfigObject.isSandboxingEnabled() &&
        sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled() &&
        isCommandSandboxed(toolInput)) {

        return {
            behavior: "allow",
            decisionReason: {
                type: "auto-allowed",
                reason: "Auto-allowed with sandbox"
            }
        };
    }

    // Normal permission flow
    return checkNormalPermission(toolInput);
}

// Mapping: Ezz→checkBashPermissionWithSandbox
```

### Permission Prompt Title

When `dangerouslyDisableSandbox: true` triggers a permission ask:

```javascript
// In BashPermissionPrompt component
let isSandboxActive = sandboxConfigObject.isSandboxingEnabled();
let willRunSandboxed = isSandboxActive && isCommandSandboxed(input);

let title = (isSandboxActive && !willRunSandboxed)
    ? "Bash command (unsandboxed)"  // Warning: not sandboxed!
    : "Bash command";                // Normal or sandboxed
```

### Permission Rules → Sandbox Config Sync

Permission rules for Write/Read tools are automatically mirrored into sandbox filesystem config:

```javascript
// In buildSandboxConfigFromSettings()
for (let rule of permissions.allow || []) {
    if (rule.startsWith("Write(")) {
        let path = extractPathFromRule(rule);
        sandboxConfig.allowWrite.push(path);
    }
}
for (let rule of permissions.deny || []) {
    if (rule.startsWith("Write(")) {
        let path = extractPathFromRule(rule);
        sandboxConfig.denyWrite.push(path);
    }
    if (rule.startsWith("Read(")) {
        let path = extractPathFromRule(rule);
        sandboxConfig.denyRead.push(path);
    }
}
```

---

## 5. Integration with 06_mcp

### mcp-cli Sandbox Bypass

**What it does:** `mcp-cli` commands are explicitly exempted from sandboxing.

**Why:**
- `mcp-cli` commands don't execute real processes
- They route through the parent process's MCP connections
- The parent handles actual tool execution with proper sandboxing

**Implementation:**
In `getSandboxSystemPromptBlock`:
```javascript
let mcpCliException = isMcpCliEnabled() ?
    "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n" : "";
```

### MCP Network Calls Through Proxy

MCP servers that make network calls go through the sandbox's HTTP/SOCKS proxy:

```
MCP server makes HTTP request
    │
    ▼
HTTP_PROXY env var points to sandbox proxy
    │
    ▼
Proxy checks domain allowlist/denylist
    │
    ├─ Allowed domain → Forward request
    └─ Denied domain → Block and log
```

---

## 6. Integration with 01_cli (UI)

### /sandbox Slash Command

**What it does:** Interactive configuration interface for sandbox settings.

**Components:**
- `SandboxModeSelector` (TPq) - 3-way mode picker
- `SandboxStatusDisplay` (PPq) - Current config summary
- `SandboxOverridesSettings` (ZPq) - Open/closed policy
- `SandboxDependenciesPanel` (Ql8) - Dependency status

### Status Bar Violation Indicator

**What it does:** Shows a transient flash when new sandbox violations are detected (macOS only).

```javascript
// SandboxViolationStatusLine (aIq)
function SandboxViolationStatusLine() {
    let [newCount, setNewCount] = useState(0);

    useEffect(() => {
        let store = sandboxConfigObject.getSandboxViolationStore();
        let lastCount = store.getTotalCount();

        return store.subscribe(() => {
            let currentCount = store.getTotalCount();
            let delta = currentCount - lastCount;
            if (delta > 0) {
                setNewCount(delta);
                lastCount = currentCount;
                setTimeout(() => setNewCount(0), 5000);
            }
        });
    }, []);

    if (newCount === 0) return null;
    return `⧈ Sandbox blocked ${newCount} operations · ctrl+o for details · /sandbox to disable`;
}
```

### /doctor Sandbox Check

The `/doctor` command includes a sandbox dependency check:

```javascript
// SandboxDoctorCheck (Q7q)
function SandboxDoctorCheck() {
    if (!sandboxConfigObject.isSupportedPlatform()) return null;
    if (!sandboxConfigObject.isSandboxEnabledInSettings()) return null;

    let depCheck = sandboxConfigObject.checkDependencies();
    if (depCheck.errors.length === 0 && depCheck.warnings.length === 0) return null;

    return (
        <Box>
            <Text bold>Sandbox</Text>
            {depCheck.errors.map(e => <Text color="error">└ {e}</Text>)}
            {depCheck.warnings.map(w => <Text color="warning">└ {w}</Text>)}
        </Box>
    );
}
```

---

## 7. Integration with 27_lsp_integration

### Shared File Path Normalization

Both LSP diagnostics and IDE diagnostics use similar file URI normalization:

```javascript
// In DiagnosticsManager
normalizeFileUri(uri) {
    let prefixes = ["file://", "_claude_fs_right:", "_claude_fs_left:"];
    for (let prefix of prefixes) {
        if (uri.startsWith(prefix)) {
            return uri.slice(prefix.length);
        }
    }
    return uri;
}
```

### Sandbox and LSP Interaction

When sandbox blocks file access, LSP operations may fail:

- **Read deny paths:** LSP can't analyze those files
- **Network restrictions:** LSP can't reach language servers on denied hosts
- **Unix socket blocking:** Some LSP servers use Unix sockets

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Complete Sandbox Data Flow                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM generates Bash tool call                                               │
│       │                                                                      │
│       ▼                                                                      │
│  Permission Check                                                           │
│       │                                                                      │
│       ├─ isSandboxingEnabled() && autoAllow → Auto-allow                    │
│       │                                                                      │
│       └─ dangerouslyDisableSandbox && !isCommandSandboxed()                 │
│              │                                                               │
│              └─ Prompt: "Bash command (unsandboxed)"                        │
│       │                                                                      │
│       ▼                                                                      │
│  isCommandSandboxed(Ti)                                                      │
│       │                                                                      │
│       ├─ false → Execute directly                                           │
│       │                                                                      │
│       └─ true → wrapWithSandbox()                                           │
│              │                                                               │
│              ├─ macOS: sandbox-exec -p <SBPL>                               │
│              │                                                               │
│              └─ Linux: bwrap --unshare-net ...                              │
│       │                                                                      │
│       ▼                                                                      │
│  Command executes in sandbox                                                 │
│       │                                                                      │
│       ├─ File access → Allowed/denied per config                            │
│       ├─ Network → Routed through proxy                                     │
│       └─ Process → Isolated in namespace                                    │
│       │                                                                      │
│       ▼                                                                      │
│  Output collection                                                           │
│       │                                                                      │
│       ├─ stdout/stderr captured                                              │
│       ├─ Violations annotated (macOS)                                        │
│       └─ SandboxViolationStore updated                                      │
│       │                                                                      │
│       ▼                                                                      │
│  Result returned to LLM                                                     │
│       │                                                                      │
│       └─ If failure with sandbox evidence:                                  │
│              └─ Model may retry with dangerouslyDisableSandbox: true        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Integration Points Summary

| Module | Integration | Key Symbol |
|--------|-------------|------------|
| 04_system_reminder | System prompt injection | E9z (getSandboxSystemPromptBlock) |
| 05_tools | Command wrapping | Xx3 (wrapWithSandbox), Ti (isCommandSandboxed) |
| 11_hooks | beforeFileEdited hook | DiagnosticsManager.beforeFileEdited |
| 37_permission_policy | Auto-allow logic | Ezz (checkBashPermissionWithSandbox) |
| 06_mcp | mcp-cli bypass | mcpCliException in E9z |
| 01_cli | /sandbox command | TPq (SandboxModeSelector) |
| 27_lsp_integration | File path normalization | normalizeFileUri |

---

## 8. Unified Cross-Module Integration: MCP ↔ Sandbox ↔ IDE

### The Trinity: How Sandbox Relates to MCP and IDE

The sandbox module is the security boundary that protects the system while MCP and IDE provide functionality. Understanding their interactions is critical for security analysis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SANDBOX-CENTRIC INTEGRATION VIEW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Sandbox protects:                       Sandbox exempts:                   │
│  ┌──────────────────────────┐           ┌──────────────────────────┐        │
│  │ • File system access     │           │ • mcp-cli commands       │        │
│  │ • Network calls          │           │   (routes through parent)│        │
│  │ • Process execution      │           │ • IDE MCP communication  │        │
│  │ • Unix socket access     │           │   (internal localhost)   │        │
│  └──────────────────────────┘           └──────────────────────────┘        │
│                                                                              │
│  MCP Module Impact:                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • mcp-cli commands MUST use dangerouslyDisableSandbox: true          │   │
│  │ • MCP server processes (stdio/SSE) run OUTSIDE sandbox              │   │
│  │ • Network MCP servers go through sandbox proxy                       │   │
│  │ • Local MCP server filesystem access NOT sandboxed                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  IDE Integration Impact:                                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • IDE selection attachments skip sandboxed files                     │   │
│  │ • Diagnostics attachments filtered by sandbox rules                  │   │
│  │ • openDiff in IDE uses MCP (exempt from sandbox)                     │   │
│  │ • File edits via IDE go through Edit tool (sandboxed)                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  System Reminder Integration:                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ • getSandboxSystemPromptBlock (E9z) injects restrictions            │   │
│  │ • SandboxViolationStore (HD6) provides violation context            │   │
│  │ • Selection attachment filtered: isSandboxBlocked(filePath) → skip  │   │
│  │ • MCP resources attachment filtered by sandbox read rules           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Security Model: Defense in Depth

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEFENSE IN DEPTH LAYERS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Layer 1: Permission Policy                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • User-defined allow/deny rules                                      │    │
│  │ • Domain-based network permissions                                   │    │
│  │ • Tool-specific restrictions                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  Layer 2: Sandbox (when enabled)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • macOS: sandbox-exec with SBPL profile                              │    │
│  │ • Linux: bwrap with seccomp filters                                  │    │
│  │ • Filesystem: read/write path restrictions                           │    │
│  │ • Network: domain allowlist/denylist                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  Layer 3: MCP/IDE Context Validation                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Selection attachment: sandbox check before including              │    │
│  │ • MCP resources: sandbox check on @server:uri mentions              │    │
│  │ • IDE diagnostics: filtered by sandbox read rules                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cross-Module Violation Flow

When a sandbox violation occurs, multiple modules may be notified:

```
Sandbox violation detected (macOS: log monitoring)
    │
    ▼
SandboxViolationStore.addViolation(HD6)
    │
    ├─► Status line component re-renders
    │     (shows "⧈ Sandbox blocked N operations")
    │
    ├─► Next Bash command output annotated
    │     (<sandbox_violations> block in stderr)
    │
    └─► Model sees violations in context
          (can decide to retry with dangerouslyDisableSandbox)
```

---

## 9. Worktree Isolation Integration

### EnterWorktree Tool and Sandbox

**What it does:** When a subagent runs in a worktree isolation mode, the sandbox provides additional protection.

**How it works:**
1. `EnterWorktree` tool creates a temporary git worktree
2. The worktree path becomes the working directory
3. Sandbox filesystem restrictions are scoped to the worktree
4. Agent cannot access files outside the worktree (unless explicitly allowed)

```javascript
// In EnterWorktree tool (conceptual)
async function enterWorktree(name) {
    // Create isolated git worktree
    let worktreePath = path.join(GIT_DIR, ".claude/worktrees", name);
    await git("worktree", "add", worktreePath, "-b", branchName);

    // Sandbox will scope filesystem access to worktreePath
    // because CWD is changed to worktreePath
    process.chdir(worktreePath);

    // When sandbox wraps commands:
    // - Project root = worktreePath
    // - Allowed write paths are relative to worktree
    // - Read deny rules still apply globally

    return { worktreePath, branchName };
}
```

**Why this matters:**
- Provides isolated copy of repository
- Sandbox restrictions are naturally scoped to worktree
- Agent changes are isolated until worktree is cleaned up

---

## 10. Background Agents Integration

### Sandbox Behavior for Background Tasks

**What it does:** Background agents run commands that continue after the initial request.

**Sandbox considerations:**
1. Background commands inherit sandbox config from parent session
2. Network bridges remain active for duration of background task
3. Violation store continues to collect violations
4. Cleanup happens when background task completes

```javascript
// Background task sandbox flow
async function runInBackground(command, sandboxConfig) {
    // Inherit sandbox configuration
    let wrappedCommand = await wrapWithSandbox(command, sandboxConfig);

    // Start background process
    let process = spawn(wrappedCommand, { shell: true, detached: true });

    // Track for cleanup
    backgroundProcesses.add({
        pid: process.pid,
        sandboxConfig,
        startTime: Date.now()
    });

    // Cleanup on completion
    process.on("exit", () => {
        backgroundProcesses.delete(process.pid);
        // Cleanup any seccomp filters
        cleanupSandboxResources(sandboxConfig);
    });
}
```

**Key difference from foreground:**
- Background tasks may outlive the user's session
- Sandbox resources (seccomp filters, bridge sockets) need explicit cleanup
- Violation reporting may be delayed

---

## 11. Remote Sessions Integration

### CLI ↔ Web/Remote UI Synchronization

**What it does:** Remote sessions allow CLI to sync with Web UI or other remote interfaces.

**Sandbox considerations:**
1. Sandbox config is synced from local settings
2. Violations are reported to remote session
3. Permission prompts appear in both CLI and remote UI

```javascript
// Remote session sandbox sync
function syncSandboxToRemoteSession() {
    let sandboxState = {
        isEnabled: sandboxConfigObject.isSandboxingEnabled(),
        violations: sandboxConfigObject.getSandboxViolationStore().getViolations(),
        config: {
            autoAllow: sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled(),
            fallbackAllowed: sandboxConfigObject.areUnsandboxedCommandsAllowed()
        }
    };

    sendEventToRemoteSession("sandbox:state", sandboxState);
}

// Listen for violation updates
sandboxConfigObject.getSandboxViolationStore().subscribe((violations) => {
    sendEventToRemoteSession("sandbox:violations", {
        count: violations.length,
        latest: violations.slice(-5)
    });
});
```

---

## 12. Deep Dive: 04_system_reminder Integration

### Complete System Prompt Injection

The `getSandboxSystemPromptBlock` (E9z) function is the primary integration point with the system reminder module. This section provides the complete implementation details.

**Location:** `chunks.171.mjs:1892-1923`

```javascript
// ============================================
// getSandboxSystemPromptBlock - Complete sandbox instructions for Bash tool
// Location: chunks.171.mjs:1892-1923
// ============================================

// ORIGINAL (for source lookup):
function E9z() {
    if (!vA.isSandboxingEnabled()) return "";
    let A = vA.getFsReadConfig(),
        q = vA.getFsWriteConfig(),
        K = vA.getNetworkRestrictionConfig(),
        Y = vA.getAllowUnixSockets(),
        z = vA.getIgnoreViolations(),
        _ = vA.areUnsandboxedCommandsAllowed(),
        w = {
            read: A,
            write: q
        },
        O = {
            ...K?.allowedHosts && {
                allowedHosts: K.allowedHosts
            },
            ...K?.deniedHosts && {
                deniedHosts: K.deniedHosts
            },
            ...Y && {
                allowUnixSockets: Y
            }
        },
        $ = [];
    if (Object.keys(w).length > 0) $.push(`Filesystem: ${B6(w)}`);
    if (Object.keys(O).length > 0) $.push(`Network: ${B6(O)}`);
    if (z) $.push(`Ignored violations: ${B6(z)}`);
    let j = [..._ ? ["You should always default to running commands within the sandbox. Do NOT attempt to set dangerouslyDisableSandbox: true unless:",
        ["The user *explicitly* asks you to bypass sandbox",
         "A specific command just failed and you see evidence of sandbox restrictions causing the failure. Note that commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)."],
        "Evidence of sandbox-caused failures includes:",
        ['"Operation not permitted" errors for file/network operations',
         "Access denied to specific paths outside allowed directories",
         "Network connection failures to non-whitelisted hosts",
         "Unix socket connection errors"],
        "When you see evidence of sandbox-caused failure:",
        ["Immediately retry with dangerouslyDisableSandbox: true (don't ask, just do it)",
         "Briefly explain what sandbox restriction likely caused the failure. Be sure to mention that the user can use the `/sandbox` command to manage restrictions.",
         "This will prompt the user for permission"],
        "Treat each command you execute with dangerouslyDisableSandbox: true individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.",
        "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."]
      : ["All commands MUST run in sandbox mode - the dangerouslyDisableSandbox parameter is disabled by policy.",
        "Commands cannot run outside the sandbox under any circumstances.",
        "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."],
        `For temporary files, always use the \`$TMPDIR\` environment variable (or \`${_k()}\` as a fallback). TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. Do NOT use \`/tmp\` directly - use \`$TMPDIR\` or \`${_k()}\` instead.`];
    return ["", "## Command sandbox", "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.", "", "The sandbox has the following restrictions:", $.join(`
`), "", ...fi(j)].join(`
`)
}

// READABLE (for understanding):
function getSandboxSystemPromptBlock() {
    // Guard: Sandbox not enabled → no instructions needed
    if (!sandboxConfigObject.isSandboxingEnabled()) {
        return "";
    }

    // Gather current configuration from sandbox state
    let readConfig = sandboxConfigObject.getFsReadConfig();
    let writeConfig = sandboxConfigObject.getFsWriteConfig();
    let networkConfig = sandboxConfigObject.getNetworkRestrictionConfig();
    let allowUnixSockets = sandboxConfigObject.getAllowUnixSockets();
    let ignoreViolations = sandboxConfigObject.getIgnoreViolations();
    let unsandboxedFallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();

    // Build filesystem restrictions object
    let filesystemRestrictions = {
        read: readConfig,
        write: writeConfig
    };

    // Build network restrictions object
    let networkRestrictions = {
        ...(networkConfig?.allowedHosts && { allowedHosts: networkConfig.allowedHosts }),
        ...(networkConfig?.deniedHosts && { deniedHosts: networkConfig.deniedHosts }),
        ...(allowUnixSockets && { allowUnixSockets: allowUnixSockets })
    };

    // Build restriction display lines
    let restrictions = [];
    if (Object.keys(filesystemRestrictions).length > 0) {
        restrictions.push(`Filesystem: ${JSON.stringify(filesystemRestrictions)}`);
    }
    if (Object.keys(networkRestrictions).length > 0) {
        restrictions.push(`Network: ${JSON.stringify(networkRestrictions)}`);
    }
    if (ignoreViolations) {
        restrictions.push(`Ignored violations: ${JSON.stringify(ignoreViolations)}`);
    }

    // Build instructions based on fallback policy
    let instructions;
    if (unsandboxedFallbackAllowed) {
        // OPEN POLICY: Model can request sandbox bypass
        instructions = [
            "You should always default to running commands within the sandbox. Do NOT attempt to set dangerouslyDisableSandbox: true unless:",

            ["The user *explicitly* asks you to bypass sandbox",
             "A specific command just failed and you see evidence of sandbox restrictions causing the failure. Note that commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)."],

            "Evidence of sandbox-caused failures includes:",

            ['"Operation not permitted" errors for file/network operations',
             "Access denied to specific paths outside allowed directories",
             "Network connection failures to non-whitelisted hosts",
             "Unix socket connection errors"],

            "When you see evidence of sandbox-caused failure:",

            ["Immediately retry with dangerouslyDisableSandbox: true (don't ask, just do it)",
             "Briefly explain what sandbox restriction likely caused the failure. Be sure to mention that the user can use the `/sandbox` command to manage restrictions.",
             "This will prompt the user for permission"],

            // CRITICAL: Anti-learning pattern
            "Treat each command you execute with dangerouslyDisableSandbox: true individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.",

            // SECURITY: Prevent sensitive path additions
            "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."
        ];
    } else {
        // CLOSED POLICY: No sandbox bypass allowed
        instructions = [
            "All commands MUST run in sandbox mode - the dangerouslyDisableSandbox parameter is disabled by policy.",
            "Commands cannot run outside the sandbox under any circumstances.",
            "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
        ];
    }

    // Add TMPDIR guidance (always, regardless of policy)
    instructions.push(
        `For temporary files, always use the \`$TMPDIR\` environment variable (or \`${getSandboxTempDir()}\` as a fallback). ` +
        `TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. ` +
        `Do NOT use \`/tmp\` directly - use \`$TMPDIR\` or \`${getSandboxTempDir()}\` instead.`
    );

    // Build final output
    return [
        "",
        "## Command sandbox",
        "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.",
        "",
        "The sandbox has the following restrictions:",
        restrictions.join("\n"),
        "",
        ...formatInstructions(instructions)
    ].join("\n");
}

// Mapping: E9z→getSandboxSystemPromptBlock, vA→sandboxConfigObject, B6→JSON.stringify,
//          fi→formatInstructions, _k→getSandboxTempDir, $→restrictions, j→instructions
```

### Key Design Decisions in System Prompt

**1. Anti-Learning Pattern**

The instruction "Treat each command you execute with dangerouslyDisableSandbox: true individually" combats a known LLM failure mode:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ANTI-LEARNING PATTERN                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PROBLEM: LLM tendency to "learn" from recent context                        │
│                                                                              │
│  Step 1: Model runs: npm install with dangerouslyDisableSandbox: true       │
│  Step 2: Command succeeds                                                    │
│  Step 3: Model "learns": "dangerouslyDisableSandbox works well"              │
│  Step 4: Model applies same pattern to NEXT command                          │
│  Step 5: All subsequent commands run unsandboxed                             │
│                                                                              │
│  SOLUTION: Explicit instruction in system prompt                             │
│                                                                              │
│  "Treat each command you execute with dangerouslyDisableSandbox: true       │
│   individually. Even if you have recently run a command with this setting,  │
│   you should default to running future commands within the sandbox."         │
│                                                                              │
│  This breaks the learning pattern by making each decision independent.       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**2. Evidence-Based Fallback**

The system prompt specifies exact error patterns that indicate sandbox-caused failures:

| Pattern | Interpretation |
|---------|----------------|
| `"Operation not permitted"` | OS denied the operation |
| `Access denied to specific paths` | Filesystem restriction |
| `Network connection failures to non-whitelisted hosts` | Network filter blocked |
| `Unix socket connection errors` | Unix socket blocking (seccomp) |

This prevents the model from incorrectly attributing failures to sandbox when the real cause is:
- Missing files
- Wrong command arguments
- Network timeouts
- Application bugs

**3. TMPDIR Guidance**

The instruction to use `$TMPDIR` instead of `/tmp` is critical because:

1. Sandbox filesystem restrictions may block `/tmp`
2. `$TMPDIR` is set to a sandbox-writable location
3. `/tmp/claude` is the default sandbox temp directory

### Injection Point in Bash Tool

**Location:** `chunks.171.mjs:1934` (in `tGq` - buildBashToolDescription)

```javascript
// In buildBashToolDescription():
let fullPrompt = [
    "Executes a given bash command and returns its output.",
    "",
    "The working directory persists between commands...",
    "",
    "# Instructions",
    ...otherInstructions,
    E9z(),  // <-- getSandboxSystemPromptBlock injected here
    ...additionalBlocks
].join("\n");
```

### Output Example

When sandbox is enabled with network restrictions, the system prompt block looks like:

```markdown
## Command sandbox
By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.

The sandbox has the following restrictions:
Filesystem: {"read":{"denyOnly":[]},"write":{"allowOnly":["/home/user/project"],"denyWithinAllow":[]}}
Network: {"allowedHosts":["api.anthropic.com","github.com"],"deniedHosts":[]}

- You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:
  - The user *explicitly* asks you to bypass sandbox
  - A specific command just failed and you see evidence of sandbox restrictions...

- When you see evidence of sandbox-caused failure:
  - Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)
  - Briefly explain what sandbox restriction likely caused the failure...

- Treat each command you execute with `dangerouslyDisableSandbox: true` individually...

- For temporary files, always use the `$TMPDIR` environment variable...
```

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture
- [ui_linkage.md](./ui_linkage.md) - UI components
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS implementation
- [symbol_validation.md](./symbol_validation.md) - Symbol mappings
- [initialization_flow.md](./initialization_flow.md) - Sandbox bootstrap sequence
- [../06_mcp/cross_module_integration.md](../06_mcp/cross_module_integration.md) - MCP integration
- [../22_ide_integration/cross_module_integration.md](../22_ide_integration/cross_module_integration.md) - IDE integration
- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture

---

## 13. CLI Flag Integration (--sandbox / --no-sandbox)

### Flag Parsing and Application

**What it does:** The `--sandbox` and `--no-sandbox` CLI flags allow overriding sandbox settings from the command line.

**Location:** CLI argument parsing in `chunks.178.mjs:2076-2147`

```javascript
// ============================================
// parseRemoteControlCliArgs - CLI argument parsing including sandbox flags
// Location: chunks.178.mjs:2076-2147
// ============================================

// ORIGINAL (for source lookup):
function QVq(A) {
    let q = !1,
        K = !1,  // sandbox flag (undefined = use settings, true = force on, false = force off)
        Y, z, _, w, O = !1,
        $, H, j, J, M = !1;
    for (let X = 0; X < A.length; X++) {
        let P = A[X];
        if (P === "--help" || P === "-h") O = !0;
        else if (P === "--verbose" || P === "-v") q = !0;
        else if (P === "--sandbox") K = !0;
        else if (P === "--no-sandbox") K = !1;
        // ... other flags ...
    }

    return {
        verbose: q,
        sandbox: K,  // undefined = use settings, true = force enable, false = force disable
        debugFile: Y,
        sessionTimeoutMs: z,
        permissionMode: _,
        name: w,
        spawnMode: $,
        capacity: H,
        createSessionInDir: j,
        sessionId: J,
        continueSession: M,
        help: O
    };
}

// READABLE (for understanding):
function parseRemoteControlCliArgs(args) {
    let verbose = false;
    let sandbox = undefined;  // undefined = use settings
    let debugFile, sessionTimeoutMs, permissionMode, name;
    let help = false;

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (arg === "--help" || arg === "-h") help = true;
        else if (arg === "--verbose" || arg === "-v") verbose = true;
        else if (arg === "--sandbox") sandbox = true;     // Force enable
        else if (arg === "--no-sandbox") sandbox = false; // Force disable
        // ... other flags ...
    }

    return {
        verbose,
        sandbox,
        debugFile,
        sessionTimeoutMs,
        permissionMode,
        name,
        help
    };
}

// Mapping: QVq→parseRemoteControlCliArgs, K→sandbox, q→verbose, O→help
```

### Environment Variable Bridge

**How the sandbox flag is applied to bridge sessions:**

When a sandbox CLI flag is set, it's propagated to child processes via environment variable:

```javascript
// ============================================
// Bridge session spawn with sandbox flag
// Location: chunks.178.mjs:614-627
// ============================================

// ORIGINAL (for source lookup):
let O = [...A.scriptArgs, "--print", "--sdk-url", q.sdkUrl, ...],
    $ = {
        ...A.env,
        CLAUDE_CODE_OAUTH_TOKEN: void 0,
        CLAUDE_CODE_ENVIRONMENT_KIND: "bridge",
        ...A.sandbox && {
            CLAUDE_CODE_FORCE_SANDBOX: "1"
        },
        CLAUDE_CODE_SESSION_ACCESS_TOKEN: q.accessToken,
        // ...
    };

// READABLE (for understanding):
let childArgs = [...scriptArgs, "--print", "--sdk-url", session.sdkUrl, ...];
let childEnv = {
    ...parentEnv,
    CLAUDE_CODE_OAUTH_TOKEN: undefined,  // Remove OAuth token
    CLAUDE_CODE_ENVIRONMENT_KIND: "bridge",

    // Propagate sandbox CLI flag to child process
    ...(cliFlags.sandbox) && {
        CLAUDE_CODE_FORCE_SANDBOX: "1"  // Force sandbox enabled
    },

    CLAUDE_CODE_SESSION_ACCESS_TOKEN: session.accessToken,
    // ...
};
```

### Flag vs Settings Interaction

| CLI Flag | Settings `sandbox.enabled` | Final Behavior |
|----------|---------------------------|----------------|
| Not specified | `true` | Sandbox enabled |
| Not specified | `false` | Sandbox disabled |
| `--sandbox` | `true` | Sandbox enabled (forced) |
| `--sandbox` | `false` | Sandbox enabled (CLI override) |
| `--no-sandbox` | `true` | Sandbox disabled (CLI override) |
| `--no-sandbox` | `false` | Sandbox disabled (forced) |

**Key insight:** The CLI flag takes precedence over settings, allowing administrators to enforce sandbox policies regardless of user settings.

### Use Cases

**1. Enterprise Deployment:**
```bash
# Force sandbox enabled for all sessions
claude --sandbox
```

**2. Debugging/Troubleshooting:**
```bash
# Temporarily disable sandbox for testing
claude --no-sandbox
```

**3. Remote Control Sessions:**
```bash
# Force sandbox for remote sessions
claude remote-control --sandbox
```

---

## 14. Complete Bash Tool Sandbox Decision Flow

### End-to-End Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              BASH TOOL SANDBOX DECISION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. LLM GENERATES BASH TOOL CALL                                            │
│     └─ Input: { command: "...", dangerouslyDisableSandbox?: boolean }      │
│                                                                              │
│  2. PERMISSION CHECK                                                        │
│     │                                                                        │
│     ├─ isSandboxingEnabled() && autoAllowBashIfSandboxed?                   │
│     │     └─ YES → Auto-allow (no prompt)                                   │
│     │                                                                        │
│     └─ dangerouslyDisableSandbox: true && allowUnsandboxedCommands?         │
│           └─ YES → Prompt: "Bash command (unsandboxed)"                     │
│           └─ NO  → Treat as sandboxed command                               │
│                                                                              │
│  3. isCommandSandboxed(Ti) - FOUR GATES                                     │
│     │                                                                        │
│     ├─ Gate 1: isSandboxingEnabled()?                                       │
│     │     └─ NO → NOT sandboxed                                             │
│     │                                                                        │
│     ├─ Gate 2: dangerouslyDisableSandbox && allowUnsandboxedCommands?       │
│     │     └─ YES → NOT sandboxed (model override)                           │
│     │                                                                        │
│     ├─ Gate 3: command exists?                                              │
│     │     └─ NO → NOT sandboxed (nothing to sandbox)                        │
│     │                                                                        │
│     └─ Gate 4: isCommandInExcludedList()?                                   │
│           └─ YES → NOT sandboxed (excluded pattern)                         │
│           └─ NO → SANDBOXED                                                 │
│                                                                              │
│  4. SANDBOX WRAPPING                                                        │
│     │                                                                        │
│     ├─ macOS: wrapWithMacOSSandbox() (Ye8)                                  │
│     │     ├─ Build SBPL profile from config                                 │
│     │     ├─ Apply network restrictions (allow/deny hosts)                  │
│     │     ├─ Apply filesystem restrictions (read/write paths)               │
│     │     └─ Execute: sandbox-exec -p <SBPL> /bin/bash -c <command>         │
│     │                                                                        │
│     └─ Linux: wrapWithLinuxSandbox() (uZ7)                                  │
│           ├─ Build bwrap arguments from config                              │
│           ├─ Apply network namespace isolation (--unshare-net)              │
│           ├─ Apply filesystem binds (--ro-bind, --bind)                     │
│           ├─ Apply seccomp filter for Unix sockets                          │
│           └─ Execute: bwrap ... -- /bin/bash -c <command>                   │
│                                                                              │
│  5. COMMAND EXECUTION                                                       │
│     │                                                                        │
│     ├─ File access → Allowed/denied per config                             │
│     ├─ Network → Routed through proxy (macOS) or blocked (Linux)            │
│     └─ Process → Isolated in namespace/bubble                               │
│                                                                              │
│  6. OUTPUT COLLECTION                                                       │
│     │                                                                        │
│     ├─ stdout/stderr captured                                               │
│     ├─ macOS: Violations logged via `log stream`                            │
│     └─ Violations annotated in stderr output                                │
│                                                                              │
│  7. RESULT RETURNED TO LLM                                                  │
│     │                                                                        │
│     └─ If failure with sandbox evidence:                                    │
│           └─ Model sees violation messages                                  │
│           └─ Model may retry with dangerouslyDisableSandbox: true           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Command Exclusion Pattern Matching

```javascript
// ============================================
// isCommandInExcludedList - Checks if command matches exclusion pattern
// Location: chunks.172.mjs:2412-2452
// ============================================

// READABLE (for understanding):
function isCommandInExcludedList(command) {
    let excludedCommands = sandboxConfigObject.getExcludedCommands();

    for (let pattern of excludedCommands) {
        let { type, value } = parseExclusionPattern(pattern);

        switch (type) {
            case "prefix":
                // Pattern: "npm*" matches "npm install", "npm run build"
                if (command.startsWith(value)) return true;
                break;

            case "exact":
                // Pattern: "git" matches exactly "git" (not "git status")
                if (command === value) return true;
                break;

            case "wildcard":
                // Pattern: "docker compose *" matches "docker compose up"
                if (matchWildcardPattern(command, value)) return true;
                break;

            case "suffix":
                // Pattern: "*.sh" matches "script.sh"
                if (command.endsWith(value.slice(1))) return true;
                break;
        }
    }

    return false;
}

// Mapping: yYz→isCommandInExcludedList
```

### Pattern Types

| Pattern | Example | Matches | Doesn't Match |
|---------|---------|---------|---------------|
| `prefix:*` | `npm:*` | `npm install`, `npm run` | `yarn install` |
| `exact` | `git` | `git` | `git status`, `github` |
| `wildcard:*` | `docker compose *` | `docker compose up` | `docker run` |
| `suffix:*` | `*.sh` | `script.sh` | `script.py` |

---

## 15. System Prompt Injection Details

### Injection Point in Agent Loop

The sandbox system prompt is injected during message preparation for the Bash tool:

```javascript
// ============================================
// buildBashToolDescription - Constructs Bash tool description
// Location: chunks.171.mjs:1934
// ============================================

// READABLE (for understanding):
function buildBashToolDescription() {
    return [
        "Executes a given bash command and returns its output.",
        "",
        "The working directory persists between commands...",
        "",
        "# Instructions",
        ...otherInstructions,
        getSandboxSystemPromptBlock(),  // <-- Sandbox instructions injected here
        ...additionalBlocks
    ].join("\n");
}

// Mapping: tGq→buildBashToolDescription, E9z→getSandboxSystemPromptBlock
```

### When System Prompt is Injected

1. **Tool definition phase:** When the agent prepares tool definitions for the LLM API
2. **Per-session context:** The prompt reflects current sandbox configuration
3. **Dynamic updates:** If settings change, the prompt updates on next tool definition

### Restrictions JSON Format

The model sees the restrictions in this format:

```json
{
    "Filesystem": {
        "read": {
            "denyOnly": ["~/.ssh", "~/.gnupg"]
        },
        "write": {
            "allowOnly": ["/home/user/project"],
            "denyWithinAllow": ["node_modules"]
        }
    },
    "Network": {
        "allowedHosts": ["api.anthropic.com", "github.com"],
        "deniedHosts": [],
        "allowUnixSockets": ["~/.ssh/agent.sock"]
    },
    "Ignored violations": {
        "npm": ["file-read-data", "file-write-data"],
        "git": ["network-outbound"]
    }
}
```

### Plan Mode Variants

When plan mode is active, the sandbox system prompt includes additional constraints:

```javascript
// In plan mode, the model is told:
// - Do NOT execute commands that modify files
// - Only read commands are allowed
// - Sandbox restrictions are stricter for planning phase
```

---

## 16. Swarm Worker Permission Sync Integration

### Multi-Agent Architecture

In swarm mode, worker agents run in sandboxed environments without direct UI access. The permission sync protocol enables workers to request permissions from the leader:

```
Worker Agent (sandboxed)                Leader Agent (has UI)
========================                ====================

1. Command requires network
   to unknown domain
        │
        ▼
2. generateSandboxRequestId()
   → "sandbox-1707123456-abc123"
        │
        ▼
3. sendSandboxPermissionRequest()
   - Posts to leader's mailbox
        │                                    │
        │  ──────── mailbox msg ────────►    │
        │                                    ▼
4. registerSandboxCallback()            5. Leader shows UI prompt
   - Worker blocks/waits                      │
        │                                    ▼
        │                              6. User approves/denies
        │                                    │
        │                                    ▼
        │                              7. sendSandboxPermissionResponse()
        │                                 - Posts to worker's mailbox
        │                                    │
        │  ◄─────── mailbox msg ────────    │
        ▼
8. processSandboxResponse()
   - Resolves Promise
   - Command proceeds or fails
```

### Key Symbols for Permission Sync

- `generateSandboxRequestId` (Ib4) - Creates unique request ID
- `sendSandboxPermissionRequest` (xb4) - Worker → Leader request
- `sendSandboxPermissionResponse` (bb4) - Leader → Worker response
- `registerSandboxCallback` (mb4) - Worker registers pending Promise
- `processSandboxResponse` (Qb4) - Worker processes leader's decision

See [permission_sync.md](./permission_sync.md) for complete protocol documentation.

---

## 17. Hook System Integration

### Hook Execution Context

**What it does:** Hooks execute in the unsandboxed parent process, allowing them to perform privileged operations while maintaining sandbox isolation for model-initiated commands.

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Hook System + Sandbox Integration                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Parent Process (Unsandboxed)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Hook Execution Engine                                                │   │
│  │   • PreToolUse hooks run BEFORE sandbox wrapping                    │   │
│  │   • PostToolUse hooks receive sandbox violation info                │   │
│  │   • Hooks can access full filesystem/network                        │   │
│  │   • Hook scripts are NOT sandboxed                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         │                                                   │
│                         ▼                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Bash Tool Handler                                                    │   │
│  │   • Check PreToolUse hooks                                          │   │
│  │   • Wrap command with sandbox (if needed)                           │   │
│  │   • Execute command                                                 │   │
│  │   • Capture sandbox violations                                      │   │
│  │   • Run PostToolUse hooks with violation info                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### PostToolUse Hook: Sandbox Violation Info

When a sandbox violation occurs during command execution, the PostToolUse hook receives the violation details:

```javascript
// PostToolUse hook event structure with sandbox violations
{
    tool: "Bash",
    toolInput: { command: "curl http://restricted.example.com" },
    toolResult: {
        stdout: "",
        stderr: "Sandbox violation: network-outbound denied to restricted.example.com",
        exitCode: 1,
        sandboxViolations: [
            {
                type: "network-outbound",
                target: "restricted.example.com:443",
                denied: true,
                reason: "Domain not in allowed list"
            }
        ]
    }
}
```

### Hook Use Cases with Sandbox

| Hook Type | Use Case | Example |
|-----------|----------|---------|
| PreToolUse | Block high-risk commands before sandbox | Deny `rm -rf /` even if sandbox would allow |
| PreToolUse | Add dynamic exclusions | Detect CI environment, exclude all test commands |
| PostToolUse | Log sandbox violations | Send violations to security monitoring |
| PostToolUse | Auto-remediation | Suggest user add domain to allowlist |

---

## 18. MCP (Model Context Protocol) Integration

### mcp-cli Sandbox Bypass

**What it does:** Commands issued via `mcp-cli` are automatically excluded from sandboxing because they route through the parent process's MCP connections, not actual shell execution.

### Bypass Mechanism

```javascript
// ============================================
// mcp-cli sandbox bypass check
// Location: chunks.55.mjs (inferred from system prompt)
// ============================================

// When building sandbox system prompt:
let mcpCliException = mcpCliEnabled ?
    "- EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n"
    : "";

// In practice, mcp-cli commands are detected and routed differently:
// 1. Model calls Bash tool with mcp-cli command
// 2. System recognizes mcp-cli pattern
// 3. Command is routed to MCP client, not shell
// 4. MCP client handles actual execution with proper sandboxing
```

### Why mcp-cli Bypasses Sandbox

1. **Not actual shell commands:** `mcp-cli` commands are RPC calls to MCP servers
2. **Parent process handles execution:** The MCP client in the parent process manages actual tool calls
3. **Sandboxing applied at tool level:** Individual MCP tools may have their own sandboxing

### Network Proxy for MCP

MCP servers that make network requests go through the sandbox's HTTP/SOCKS proxy:

```
MCP Server                HTTP Proxy                External Service
    │                         │                           │
    │  Request to api.example.com                       │
    │─────────────────────────►│                         │
    │                         │                         │
    │                         │ checkDomainAllowed()    │
    │                         │ (api.example.com)       │
    │                         │                         │
    │                         │ If allowed:             │
    │                         │─────────────────────────►│
    │                         │                         │
    │                         │◄─────────────────────────│
    │◄─────────────────────────│                         │
    │                         │                         │
```

---

## 19. IDE Integration: Diagnostics Baseline

### beforeFileEdited Hook Integration

**What it does:** The IDE integration uses a `beforeFileEdited` hook to capture diagnostic baseline before file modifications, enabling delta diagnostics after edits.

### Sandbox Interaction

```
File Edit Flow:
1. Model calls Write/Edit tool
2. beforeFileEdited hook fires
   - Captures current IDE diagnostics
   - Stores in DiagnosticsManager baseline
3. Tool executes (inside sandbox if enabled)
4. afterFileEdited triggers
   - Get new diagnostics from IDE
   - Compute delta from baseline
   - Generate system reminder attachment with new issues
```

### Why This Matters for Sandbox

When sandbox blocks file access, the diagnostic system still functions because:
1. IDE diagnostics are captured before sandbox restriction
2. Diagnostics come from IDE's LSP, not from shell commands
3. Delta computation happens in unsandboxed parent process

---

## 20. Telemetry Cross-Module Integration

### Sandbox Telemetry Events

The sandbox system emits telemetry events that integrate with the broader telemetry system:

| Event Name | Trigger | Fields |
|------------|---------|--------|
| `tengu_sandbox_initialized` | Sandbox bootstrap complete | platform, proxyPorts |
| `tengu_sandbox_violation` | Violation detected | type, command, target |
| `tengu_sandbox_bypass` | dangerouslyDisableSandbox used | command, reason |
| `tengu_sandbox_auto_allow` | Command auto-approved | command, pattern |

### Session Telemetry Fields

Every session includes sandbox status:

```javascript
// Included in session telemetry
{
    sandbox_enabled: boolean,
    are_unsandboxed_commands_allowed: boolean,
    is_auto_bash_allowed_if_sandbox_enabled: boolean,
    platform: "macos" | "linux" | "wsl",
    violation_count_total: number
}
```

---

## 21. Doctor Integration

### /doctor Sandbox Checks

The `/doctor` command includes sandbox dependency validation:

```javascript
// ============================================
// Doctor sandbox check
// Location: chunks.165.mjs (inferred)
// ============================================

async function checkSandboxDependencies() {
    let results = [];

    // Check ripgrep
    if (!which("rg")) {
        results.push({ status: "error", message: "ripgrep (rg) not found" });
    }

    // Platform-specific checks
    if (platform === "linux" || platform === "wsl") {
        // Check bubblewrap
        if (!which("bwrap")) {
            results.push({ status: "error", message: "bubblewrap (bwrap) not installed" });
        }

        // Check socat
        if (!which("socat")) {
            results.push({ status: "error", message: "socat not installed" });
        }

        // Check seccomp (optional)
        let seccomp = await validateSeccompAvailability();
        if (seccomp.errors.length > 0) {
            results.push({ status: "warning", message: "seccomp filter not available - Unix sockets not blocked" });
        }
    }

    // macOS has sandbox-exec built-in
    if (platform === "macos") {
        results.push({ status: "ok", message: "sandbox-exec available (built-in)" });
    }

    return results;
}
```

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux bubblewrap implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS sandbox-exec implementation
- [violation_system.md](./violation_system.md) - Violation detection and reporting
- [ui_linkage.md](./ui_linkage.md) - UI components and interactions
- [symbol_validation.md](./symbol_validation.md) - Symbol cross-validation report

---

## Appendix A: System Reminder Integration Details

### Complete System Prompt Injection Flow

The sandbox integrates with the Bash tool's system prompt through the following flow:

```
Bash Tool Description Request
    │
    ▼
tGq() - Build Bash tool description
    │
    ├─► Base description: "Executes a given bash command..."
    │
    ├─► Instructions section
    │     │
    │     └─► Various instruction blocks
    │
    └─► E9z() - getSandboxSystemPromptBlock()
          │
          ├─► Check: isSandboxingEnabled()?
          │     │
          │     └─► false → return ""
          │
          ├─► Gather restrictions:
          │     • getFsReadConfig() → { denyOnly: [...] }
          │     • getFsWriteConfig() → { allowOnly: [...], denyWithinAllow: [...] }
          │     • getNetworkRestrictionConfig() → { allowedHosts, deniedHosts }
          │     • getAllowUnixSockets()
          │     • getIgnoreViolations()
          │
          ├─► Build restrictions display:
          │     • Filesystem: JSON.stringify({read, write})
          │     • Network: JSON.stringify(networkConfig)
          │
          ├─► Determine instruction mode:
          │     │
          │     ├─► areUnsandboxedCommandsAllowed() = true
          │     │     → Open mode instructions
          │     │     → When to use dangerouslyDisableSandbox
          │     │     → Evidence of sandbox-caused failures
          │     │
          │     └─► areUnsandboxedCommandsAllowed() = false
          │           → Closed mode instructions
          │           → "All commands MUST run in sandbox"
          │
          └─► Add TMPDIR guidance
                • Use $TMPDIR or /tmp/claude
                • Don't use /tmp directly
```

### Open Mode System Prompt Example

When `allowUnsandboxedCommands: true`, the model receives:

```
## Command sandbox

By default, your command will be run in a sandbox. This sandbox controls which
directories and network hosts commands may access or modify without an explicit override.

The sandbox has the following restrictions:
    - Filesystem: {"read":{"denyOnly":["/etc/shadow"]},"write":{"allowOnly":[".","/home/user"]}}
    - Network: {"allowedHosts":["api.anthropic.com","github.com"]}

- CRITICAL: Commands run in sandbox mode by default - do NOT set `dangerouslyDisableSandbox`
  - Even if you have recently run commands with `dangerouslyDisableSandbox: true`,
    you MUST NOT continue that pattern
  - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox
  - Set `dangerouslyDisableSandbox: true` if:
    1. The user *explicitly* asks to bypass sandbox, OR
    2. A command just failed and you see evidence of sandbox restrictions causing the failure
  - Evidence of sandbox-caused failures includes:
    - "Operation not permitted" errors for file/network operations
    - Access denied to specific paths outside allowed directories
    - Network connection failures to non-whitelisted hosts
  - When you see evidence of sandbox-caused failure:
    - IMMEDIATELY retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)
    - Briefly explain what sandbox restriction likely caused the failure
  - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.ssh/* to the allowlist
- IMPORTANT: For temporary files, use `/tmp/claude/` as your temporary directory
  - TMPDIR is automatically set to `/tmp/claude` when running in sandbox mode
```

### Closed Mode System Prompt Example

When `allowUnsandboxedCommands: false`, the model receives:

```
## Command sandbox

By default, your command will be run in a sandbox...

The sandbox has the following restrictions:
    - Filesystem: ...
    - Network: ...

- CRITICAL: All commands MUST run in sandbox mode
  - The `dangerouslyDisableSandbox` parameter is disabled by policy
  - Commands cannot run outside the sandbox under any circumstances
  - If a command fails due to sandbox restrictions, work with the user to
    adjust sandbox settings instead
- IMPORTANT: For temporary files, use `/tmp/claude/` as your temporary directory...
```

### Violation Annotation in Tool Output

When a sandbox violation occurs (macOS), the stderr is annotated:

```javascript
// annotateStderrWithSandboxFailures (YW5)
function annotateStderrWithSandboxFailures(command, stderr) {
    let violations = sandboxConfig.getSandboxViolationStore()
        .getViolationsForCommand(command);

    if (violations.length === 0) return stderr;

    let annotation = violations.map(v =>
        `Sandbox: ${v.line}`  // e.g., "Sandbox: file-write* deny /etc/passwd"
    ).join("\n");

    return stderr + "\n<sandbox_violations>\n" + annotation + "\n</sandbox_violations>";
}
```

---

## 13. Deep Dive: Command Exclusion Algorithm

### Overview

The command exclusion system allows users to specify patterns that bypass sandbox restrictions. This is critical for commands that need system-level access or are known to be safe.

### Key Functions

| Symbol | Readable | Location | Purpose |
|--------|----------|----------|---------|
| `yYz` | isCommandInExcludedList | chunks.172.mjs:2412 | Main check: does command match any exclusion? |
| `yfq` | parseExclusionPattern | chunks.172.mjs:1530 | Parse pattern into {type, prefix/command/pattern} |
| `Ln8` | extractPrefixPattern | chunks.172.mjs:1488 | Extract prefix from "command:*" pattern |
| `TYz` | isWildcardPattern | chunks.172.mjs:1492 | Check if pattern contains unescaped wildcards |
| `Cn8` | matchWildcardPattern | chunks.172.mjs:1645 | Glob-style wildcard matching for exclusions |
| `Ac` | extractCommandBasename | chunks.172.mjs:1660 | Extract command name stripping env vars and prefixes |

### Algorithm: isCommandInExcludedList (yYz)

**Location:** `chunks.172.mjs:2412-2451`

```javascript
// ============================================
// isCommandInExcludedList - Check if command matches exclusion patterns
// Location: chunks.172.mjs:2412-2451
// ============================================

// ORIGINAL (for source lookup):
function yYz(A) {
    let K = PA().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    let Y;
    try {
        Y = EO(A)
    } catch {
        Y = [A]
    }
    for (let z of Y) {
        let w = [z.trim()],
            O = new Set(w),
            $ = 0;
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j],
                    M = bn8(J, xfq);
                if (!O.has(M)) w.push(M), O.add(M);
                let D = Ac(J);
                if (!O.has(D)) w.push(D), O.add(D)
            }
            $ = H
        }
        for (let H of K) {
            let j = In8(H);
            for (let J of w) switch (j.type) {
                case "prefix":
                    if (J === j.prefix || J.startsWith(j.prefix + " ")) return !0;
                    break;
                case "exact":
                    if (J === j.command) return !0;
                    break;
                case "wildcard":
                    if (Cn8(j.pattern, J)) return !0;
                    break
            }
        }
    }
    return !1
}

// READABLE (for understanding):
function isCommandInExcludedList(command) {
    // Get exclusion patterns from settings
    let excludedCommands = getSettings().sandbox?.excludedCommands ?? [];
    if (excludedCommands.length === 0) return false;

    // Parse command into individual commands (handles &&, ||, ; chaining)
    let commandParts;
    try {
        commandParts = parseCommandChain(command);
    } catch {
        commandParts = [command];  // Fallback: treat as single command
    }

    // For each command part, expand to all possible forms
    for (let part of commandParts) {
        // Build set of command variants to check
        let variants = [part.trim()];
        let seen = new Set(variants);

        // Expand variants using BFS:
        // - Strip LD_/DYLD_/PATH environment variables
        // - Extract command basename (strip prefixes like timeout, nice, sudo)
        let processed = 0;
        while (processed < variants.length) {
            let batchEnd = variants.length;
            for (let i = processed; i < batchEnd; i++) {
                let variant = variants[i];

                // Strip env vars (LD_LIBRARY_PATH=... etc.)
                let strippedEnv = stripEnvVars(variant, LD_PATH_REGEX);
                if (!seen.has(strippedEnv)) {
                    variants.push(strippedEnv);
                    seen.add(strippedEnv);
                }

                // Extract basename (strip timeout, nice, sudo, etc.)
                let basename = extractCommandBasename(variant);
                if (!seen.has(basename)) {
                    variants.push(basename);
                    seen.add(basename);
                }
            }
            processed = batchEnd;
        }

        // Check each variant against each exclusion pattern
        for (let pattern of excludedCommands) {
            let parsed = parseExclusionPattern(pattern);

            for (let variant of variants) {
                switch (parsed.type) {
                    case "prefix":
                        // Match "npm" → "npm install", "npm run test"
                        if (variant === parsed.prefix || variant.startsWith(parsed.prefix + " ")) {
                            return true;
                        }
                        break;

                    case "exact":
                        // Match exact command string
                        if (variant === parsed.command) {
                            return true;
                        }
                        break;

                    case "wildcard":
                        // Match glob pattern "npm run test:*"
                        if (matchWildcardPattern(parsed.pattern, variant)) {
                            return true;
                        }
                        break;
                }
            }
        }
    }

    return false;
}

// Mapping: yYz→isCommandInExcludedList, A→command, PA→getSettings, EO→parseCommandChain,
//          In8→parseExclusionPattern, bn8→stripEnvVars, Ac→extractCommandBasename,
//          xfq→LD_PATH_REGEX, Cn8→matchWildcardPattern
```

### Pattern Type Examples

| Pattern | Type | Matches | Doesn't Match |
|---------|------|---------|---------------|
| `"npm:*"` | prefix | `npm`, `npm install`, `npm run test` | `npmjs`, `pnpm install` |
| `"npm run test:*"` | wildcard | `npm run test:unit`, `npm run test:integration` | `npm run tests` |
| `"docker"` | exact | `docker` | `docker ps`, `docker-compose` |
| `"sudo:*"` | prefix | `sudo`, `sudo apt install` | `sudoedit` |

---

## 14. Integration with 04_system_reminder: File Attachments

### isSandboxBlocked Function

The system reminder module uses `isSandboxBlocked` to filter file attachments:

```javascript
// In attachment producer (chunks.142.mjs)
// Check if file is sandboxed (permission denied)
if (isSandboxBlocked(absolutePath, appState.toolPermissionContext)) {
    return null; // Skip sandboxed files silently
}
```

### When File Attachments are Skipped

| Scenario | Behavior |
|----------|----------|
| File is in sandbox read-deny list | Attachment silently skipped |
| File requires network access (blocked) | Attachment silently skipped |
| User @-mentions a sandboxed file | File not included in context |
| IDE selection from sandboxed file | Selection silently dropped |

### Why Silent Skipping?

1. **No spam:** Don't fill transcript with permission errors for every @-mention
2. **Graceful degradation:** Session continues without the attachment
3. **User control:** User can adjust sandbox settings if they need the file

The model sees this annotation and can:
1. Recognize the sandbox caused the failure
2. Decide to retry with `dangerouslyDisableSandbox: true` (if open mode)

---

## 15. Algorithm Deep-Dive: Domain Pattern Matching

### matchesDomain Function (bw8)

**Location:** chunks.55.mjs:2952-2958

**What it does:** Matches a hostname against a domain pattern, supporting wildcard subdomain matching (`*.example.com`).

```javascript
// ============================================
// matchesDomain - Domain pattern matching with wildcard support
// Location: chunks.55.mjs:2952-2958
// ============================================

// ORIGINAL (for source lookup):
function bw8(A, q) {
    if (q.startsWith("*.")) {
        let K = q.substring(2);
        return A.toLowerCase().endsWith("." + K.toLowerCase())
    }
    return A.toLowerCase() === q.toLowerCase()
}

// READABLE (for understanding):
function matchesDomain(hostname, pattern) {
    // Wildcard subdomain pattern: "*.example.com"
    if (pattern.startsWith("*.")) {
        let baseDomain = pattern.substring(2);  // "example.com"
        // Match: "api.example.com", "www.example.com"
        // No match: "example.com", "notexample.com"
        return hostname.toLowerCase().endsWith("." + baseDomain.toLowerCase());
    }

    // Exact domain match
    return hostname.toLowerCase() === pattern.toLowerCase();
}

// Mapping: bw8→matchesDomain, A→hostname, q→pattern
```

### Pattern Validation (mw8 Schema)

**Location:** chunks.55.mjs:5-18

```javascript
// ============================================
// DomainPatternSchema - Zod validation for domain patterns
// Location: chunks.55.mjs:5-18
// ============================================

// ORIGINAL (for source lookup):
mw8 = K4.string().refine((A) => {
    if (A.includes("://") || A.includes("/") || A.includes(":")) return !1;
    if (A === "localhost") return !0;
    if (A.startsWith("*.")) {
        let q = A.slice(2);
        if (!q.includes(".") || q.startsWith(".") || q.endsWith(".")) return !1;
        let K = q.split(".");
        return K.length >= 2 && K.every((Y) => Y.length > 0)
    }
    if (A.includes("*")) return !1;
    return A.includes(".") && !A.startsWith(".") && !A.endsWith(".")
}, {
    message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
})

// READABLE (for understanding):
DomainPatternSchema = z.string().refine((pattern) => {
    // Reject: protocols, paths, ports
    if (pattern.includes("://") || pattern.includes("/") || pattern.includes(":")) {
        return false;
    }

    // Allow: localhost
    if (pattern === "localhost") return true;

    // Wildcard subdomain: "*.example.com"
    if (pattern.startsWith("*.")) {
        let baseDomain = pattern.slice(2);  // "example.com"

        // Must have at least one dot: "*.example.com" OK, "*.com" NOT OK
        if (!baseDomain.includes(".") || baseDomain.startsWith(".") || baseDomain.endsWith(".")) {
            return false;
        }

        // Each part must be non-empty: "*.a.b" OK, "*.a..b" NOT OK
        let parts = baseDomain.split(".");
        return parts.length >= 2 && parts.every(p => p.length > 0);
    }

    // Reject: other wildcards (e.g., "example.*", "*.com")
    if (pattern.includes("*")) return false;

    // Exact domain: must contain dot, not start/end with dot
    return pattern.includes(".") && !pattern.startsWith(".") && !pattern.endsWith(".");
}, {
    message: 'Invalid domain pattern. Must be a valid domain or wildcard. Overly broad patterns like "*.com" are not allowed.'
});

// Mapping: mw8→DomainPatternSchema, K4→z
```

### Why These Restrictions?

1. **No `*.com`:** Would allow access to ALL .com domains - too broad
2. **No `example.*`:** Would allow all TLDs - unpredictable behavior
3. **No protocols:** `https://example.com` is a URL, not a domain
4. **At least two parts:** `*.example.com` requires base domain to have at least 2 parts (example + com)

### checkNetworkPermission Function (nZ7)

**Location:** chunks.55.mjs:2960-2978

```javascript
// ============================================
// checkNetworkPermission - Domain-based network access control
// Location: chunks.55.mjs:2960-2978
// ============================================

// ORIGINAL (for source lookup):
async function nZ7(A, q, K) {
    if (!R5) return wA("No config available, denying network request"), !1;
    for (let Y of R5.network.deniedDomains)
        if (bw8(q, Y)) return wA(`Denied by config rule: ${q}:${A}`), !1;
    for (let Y of R5.network.allowedDomains)
        if (bw8(q, Y)) return wA(`Allowed by config rule: ${q}:${A}`), !0;
    if (!K) return wA(`No matching config rule, denying: ${q}:${A}`), !1;
    wA(`No matching config rule, asking user: ${q}:${A}`);
    try {
        if (await K({
                host: q,
                port: A
            })) return wA(`User allowed: ${q}:${A}`), !0;
        else return wA(`User denied: ${q}:${A}`), !1
    } catch (Y) {
        return wA(`Error in permission callback: ${Y}`, {
            level: "error"
        }), !1
    }
}

// READABLE (for understanding):
async function checkNetworkPermission(port, hostname, onPermissionRequest) {
    // No config? Default deny
    if (!currentConfig) {
        log("No config available, denying network request");
        return false;
    }

    // Check deny list FIRST (takes precedence)
    for (let denied of currentConfig.network.deniedDomains) {
        if (matchesDomain(hostname, denied)) {
            log(`Denied by config rule: ${hostname}:${port}`);
            return false;
        }
    }

    // Check allow list
    for (let allowed of currentConfig.network.allowedDomains) {
        if (matchesDomain(hostname, allowed)) {
            log(`Allowed by config rule: ${hostname}:${port}`);
            return true;
        }
    }

    // No match found
    if (!onPermissionRequest) {
        // No callback provided - default deny
        log(`No matching config rule, denying: ${hostname}:${port}`);
        return false;
    }

    // Ask user via callback
    log(`No matching config rule, asking user: ${hostname}:${port}`);
    try {
        let allowed = await onPermissionRequest({ host: hostname, port });
        log(`${allowed ? 'User allowed' : 'User denied'}: ${hostname}:${port}`);
        return allowed;
    } catch (error) {
        log(`Error in permission callback: ${error}`, { level: "error" });
        return false;
    }
}

// Mapping: nZ7→checkNetworkPermission, A→port, q→hostname, K→onPermissionRequest,
//          R5→currentConfig, bw8→matchesDomain, wA→log
```

### Network Permission Decision Flow

```
Network request to host:port
    │
    ▼
Check deniedDomains list
    │
    ├─ host matches denied pattern → DENY (no further checks)
    │
    └─ no deny match ──► Check allowedDomains list
                            │
                            ├─ host matches allowed pattern → ALLOW
                            │
                            └─ no allow match ──► onPermissionRequest callback?
                                                     │
                                                     ├─ Yes → Ask user → ALLOW/DENY
                                                     │
                                                     └─ No → DENY (default)
```

---

## 16. Deep Dive: 04_system_reminder Integration - Model Decision Flow

### Complete Decision Flow for dangerouslyDisableSandbox

**What it does:** Traces the complete flow from model receiving system prompt to making a sandbox bypass decision.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           MODEL DECISION FLOW FOR dangerouslyDisableSandbox                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. System Prompt Assembly (chunks.171.mjs:1892-1923)                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ E9z() returns sandbox block with:                                    │    │
│  │ • Filesystem restrictions JSON                                       │    │
│  │ • Network restrictions JSON                                          │    │
│  │ • Open/Closed policy instructions                                    │    │
│  │ • Anti-learning pattern warnings                                     │    │
│  │ • TMPDIR guidance                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  2. Model Generates Bash Tool Call                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Decision based on:                                                   │    │
│  │ • Is command sensitive? (file access, network)                      │    │
│  │ • Does command need special permissions?                            │    │
│  │ • Is previous sandbox failure evidence present?                     │    │
│  │ • Did user explicitly ask to bypass?                                │    │
│  │                                                                       │    │
│  │ Output options:                                                       │    │
│  │ a) { "command": "...", "description": "..." }  → Normal sandboxed   │    │
│  │ b) { "command": "...", "dangerouslyDisableSandbox": true } → Bypass │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  3. Permission Check (chunks.172.mjs:2454-2460)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ isCommandSandboxed(Ti) called:                                       │    │
│  │                                                                       │    │
│  │ Gate 1: isSandboxingEnabled()?                                       │    │
│  │   └─ false → Command runs unsandboxed                                │    │
│  │                                                                       │    │
│  │ Gate 2: dangerouslyDisableSandbox && allowUnsandboxedCommands?       │    │
│  │   └─ true → Permission prompt shown (sandboxOverride)               │    │
│  │                                                                       │    │
│  │ Gate 3: isCommandInExcludedList()?                                   │    │
│  │   └─ true → Command runs unsandboxed                                 │    │
│  │                                                                       │    │
│  │ All gates pass → Command runs in sandbox                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Evidence Detection Heuristics (Open Mode)

When `allowUnsandboxedCommands` is true, the system prompt teaches the model to detect sandbox-caused failures:

```javascript
// From E9z() system prompt
"Evidence of sandbox-caused failures includes:",
['"Operation not permitted" errors for file/network operations',
 "Access denied to specific paths outside allowed directories",
 "Network connection failures to non-whitelisted hosts",
 "Unix socket connection errors"]
```

**How evidence detection works:**

1. **Command executes in sandbox** → stdout/stderr captured
2. **annotateStderrWithSandboxFailures** (chunks.55.mjs:3386) appends violations:
   ```
   <sandbox_violations>
   Sandbox: file-write* deny /etc/passwd
   </sandbox_violations>
   ```
3. **Model sees failure output** in tool result
4. **Model pattern-matches** against evidence heuristics
5. **If evidence matches** → Model retries with `dangerouslyDisableSandbox: true`

### Anti-Learning Pattern Implementation

**Problem:** LLMs tend to apply recently successful patterns to subsequent commands.

**Example of problematic learning:**
```
1. Model runs: npm install (with dangerouslyDisableSandbox: true) → Success
2. Model "learns": "dangerouslyDisableSandbox works well"
3. Model applies same pattern to: ls (should be sandboxed!)
4. Result: All subsequent commands run unsandboxed
```

**Solution in system prompt:**
```javascript
// From E9z() - chunks.171.mjs:1919
"Treat each command you execute with dangerouslyDisableSandbox: true individually. " +
"Even if you have recently run a command with this setting, " +
"you should default to running future commands within the sandbox."
```

**Why this works:**
- Explicit instruction breaks the learning pattern
- Each command is evaluated independently
- Previous bypass success doesn't influence future decisions

### Closed Mode Behavior

When `allowUnsandboxedCommands: false` (strict mode):

```javascript
// From E9z() - chunks.171.mjs:1919
[
    "All commands MUST run in sandbox mode - the dangerouslyDisableSandbox parameter is disabled by policy.",
    "Commands cannot run outside the sandbox under any circumstances.",
    "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
]
```

**Key differences from open mode:**
1. No evidence detection instructions
2. No `dangerouslyDisableSandbox` guidance
3. Directs user to adjust settings, not bypass
4. Model cannot request bypass even on failure

---

## 17. Deep Integration with 04_system_reminder

### Attachment Producer Architecture

The 04_system_reminder module uses attachment producers to inject context into the message stream. The sandbox integrates through several mechanisms:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SANDBOX → SYSTEM REMINDER INTEGRATION                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. System Prompt Injection                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Bash tool system prompt includes:                                    │    │
│  │ • getSandboxSystemPromptBlock() (E9z)                               │    │
│  │ • Current restrictions serialized as JSON                           │    │
│  │ • Open/closed mode instructions                                     │    │
│  │ • TMPDIR guidance                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  2. Violation Attachment                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ When sandbox violations occur:                                       │    │
│  │ • annotateStderrWithSandboxFailures() appends to stderr             │    │
│  │ • Violations wrapped in <sandbox_violations> tags                   │    │
│  │ • Model sees violations in tool result                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  3. File Attachment Filtering                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Attachment producers check sandbox rules:                            │    │
│  │ • @-mention files: check read deny list                             │    │
│  │ • IDE selection: filter sandbox-blocked paths                       │    │
│  │ • MCP resources: check network domain rules                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Violation Annotation in Tool Output

When a sandbox violation occurs, the stderr is annotated before being shown to the model:

```javascript
// ============================================
// annotateStderrWithSandboxFailures - Violation annotation
// Location: chunks.55.mjs:3391-3393
// ============================================

// READABLE (for understanding):
function annotateStderrWithSandboxFailures(command, stderr) {
    let violations = sandboxConfig.getSandboxViolationStore()
        .getViolationsForCommand(command);

    if (violations.length === 0) return stderr;

    let annotation = violations.map(v =>
        `Sandbox: ${v.line}`  // e.g., "Sandbox: file-write* deny /etc/passwd"
    ).join("\n");

    // Append to stderr with XML tags for parsing
    return stderr + "\n<sandbox_violations>\n" + annotation + "\n</sandbox_violations>";
}
```

**Example output:**
```
Command output...
<sandbox_violations>
Sandbox: file-write* deny /etc/passwd
Sandbox: network-outbound deny 192.168.1.1:443
</sandbox_violations>
```

### File Attachment Filtering

Attachment producers filter files based on sandbox read rules:

```javascript
// ============================================
// File attachment filtering logic
// Location: chunks.142.mjs (attachment producers)
// ============================================

// READABLE (for understanding):
function filterFileAttachment(filePath, readConfig) {
    // Check if file is in read deny list
    for (let deniedPath of readConfig.denyOnly) {
        if (filePath.startsWith(deniedPath)) {
            log(`Skipping attachment for sandbox-blocked path: ${filePath}`);
            return null;  // Don't include attachment
        }
    }
    return filePath;  // Include attachment
}
```

### Network Resource Filtering

MCP resource attachments check network rules:

```javascript
// ============================================
// Network resource filtering
// Location: chunks.142.mjs (MCP attachment producers)
// ============================================

// READABLE (for understanding):
async function filterMcpResource(resourceUri, networkConfig) {
    // Parse URI to extract domain
    let domain = extractDomainFromUri(resourceUri);

    // Check against denied domains
    for (let deniedPattern of networkConfig.deniedDomains || []) {
        if (matchDomainPattern(domain, deniedPattern)) {
            log(`Skipping MCP resource for sandbox-blocked domain: ${domain}`);
            return null;
        }
    }

    // Check against allowed domains (if specified)
    if (networkConfig.allowedDomains?.length > 0) {
        let allowed = networkConfig.allowedDomains.some(pattern =>
            matchDomainPattern(domain, pattern)
        );
        if (!allowed) {
            log(`Skipping MCP resource: domain not in allowlist: ${domain}`);
            return null;
        }
    }

    return resourceUri;
}
```

### System Prompt Integration with Bash Tool

The `getSandboxSystemPromptBlock` (E9z) function is called during Bash tool description construction:

```javascript
// ============================================
// Bash tool description assembly
// Location: chunks.171.mjs:1934 (tGq)
// ============================================

// READABLE (for understanding):
function buildBashToolDescription() {
    let sections = [
        "Executes a given bash command and returns its output.",
        "",
        "The working directory persists between commands...",
        "",
        "# Instructions",
        // ... many instruction sections ...
        getSandboxSystemPromptBlock(),  // <-- Sandbox injection point
        // ... more sections ...
    ];

    return sections.join("\n");
}
```

**Key insight:** The sandbox injection happens at the system prompt level, so every Bash tool call automatically includes the current sandbox context.

---

## 19. Complete Violation Detection → Model Visibility Flow

### End-to-End Flow Diagram (macOS)

This section documents the complete flow from sandbox violation detection to model visibility, including all intermediate steps and data transformations.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           VIOLATION DETECTION → MODEL VISIBILITY FLOW (macOS)                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. COMMAND PREPARATION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Command: "curl http://denied.example.com"                           │    │
│  │                                                                     │    │
│  │ wrapWithMacOSSandbox() generates:                                   │    │
│  │ • Log tag: CMD64_<base64_command>_END_<session_id>                 │    │
│  │ • SBPL profile with (deny default (with message "CMD64_..."))      │    │
│  │ • Final: sandbox-exec -p <profile> /bin/bash -c "curl ..."         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  2. COMMAND EXECUTION (inside sandbox)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ sandbox-exec enforces SBPL policy                                   │    │
│  │                                                                     │    │
│  │ When violation occurs:                                              │    │
│  │ • macOS kernel blocks the operation                                 │    │
│  │ • sandbox-exec logs to system log                                   │    │
│  │ • Log entry contains the CMD64_..._END tag for correlation         │    │
│  │                                                                     │    │
│  │ Example log entry:                                                  │    │
│  │ "Sandbox: network-outbound deny(1) domain.denied.example.com:443"  │    │
│  │   with message: "CMD64_Y3VybCBodHRwOi8vZGVuaWVk..._END_abc123"     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  3. LOG MONITORING (startLogMonitor - UZ7)                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Process: log stream --style syslog --predicate 'process == "sandbox-exec"'│
│  │                                                                     │    │
│  │ For each log line:                                                  │    │
│  │ 1. Check for CMD64_<base64>_END pattern                            │    │
│  │ 2. Extract base64 command                                           │    │
│  │ 3. Create violation object:                                         │    │
│  │    {                                                                │    │
│  │      line: "Sandbox: network-outbound deny...",                    │    │
│  │      encodedCommand: "Y3VybCBodHRw...",                             │    │
│  │      timestamp: 1707123456789                                       │    │
│  │    }                                                                │    │
│  │ 4. Call SandboxViolationStore.addViolation()                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  4. VIOLATION STORE (SandboxViolationStore - HD6)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ addViolation(violation):                                            │    │
│  │ 1. Push to violations array                                         │    │
│  │ 2. Increment totalCount                                             │    │
│  │ 3. Trim if > maxSize (100)                                          │    │
│  │ 4. notifyListeners()                                                │    │
│  │                                                                     │    │
│  │ notifyListeners():                                                  │    │
│  │ • For each callback in listeners Set:                              │    │
│  │   - callback(getViolations())                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│              ┌───────────────────────┼───────────────────────┐              │
│              │                       │                       │              │
│              ▼                       ▼                       ▼              │
│  5a. UI STATUS LINE           5b. STDERR ANNOTATION    5c. OTHER LISTENERS │
│  ┌─────────────────────┐      ┌─────────────────────┐                      │
│  │ aIq component:      │      │ eb3 function:       │                      │
│  │                     │      │                     │                      │
│  │ • subscribe()       │      │ Called after cmd:   │                      │
│  │ • Track lastTotal   │      │                     │                      │
│  │ • Calculate delta   │      │ getViolationsForCmd│                      │
│  │ • If delta > 0:     │      │                     │                      │
│  │   - Show status     │      │ Build annotation:   │                      │
│  │   - Auto-dismiss 5s │      │ <sandbox_violations>│                      │
│  │                     │      │   violation lines   │                      │
│  │ Output:             │      │ </sandbox_violations>│                     │
│  │ "⧈ Sandbox blocked  │      │                     │                      │
│  │  N operations"      │      │ Append to stderr    │                      │
│  └─────────────────────┘      └─────────────────────┘                      │
│                                      │                                       │
│                                      ▼                                       │
│  6. MODEL VISIBILITY                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Tool result shown to LLM:                                           │    │
│  │                                                                     │    │
│  │ {                                                                   │    │
│  │   stdout: "",                                                       │    │
│  │   stderr: "curl: (6) Could not resolve host...\n                   │    │
│  │          <sandbox_violations>                                      │    │
│  │          Sandbox: network-outbound deny denied.example.com:443     │    │
│  │          </sandbox_violations>",                                   │    │
│  │   exitCode: 6                                                      │    │
│  │ }                                                                   │    │
│  │                                                                     │    │
│  │ Model can now:                                                      │    │
│  │ 1. Recognize sandbox-caused failure                                │    │
│  │ 2. Retry with dangerouslyDisableSandbox: true (if allowed)         │    │
│  │ 3. Explain to user what was blocked                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Linux Violation Flow

On Linux, violation detection works differently:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              VIOLATION DETECTION FLOW (Linux)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. bwrap enforces restrictions:                                            │
│     • Network: --unshare-net blocks all network                             │
│     • Filesystem: --ro-bind, --bind enforce paths                           │
│     • Unix sockets: seccomp BPF blocks socket(AF_UNIX, ...)                 │
│                                                                              │
│  2. Violations manifest as:                                                  │
│     • EACCES (Permission denied)                                            │
│     • ENETUNREACH (Network unreachable)                                     │
│     • EAFNOSUPPORT (Address family not supported - for Unix sockets)        │
│                                                                              │
│  3. No proactive monitoring:                                                 │
│     • Linux doesn't have equivalent to macOS log stream                     │
│     • Violations only visible in command stderr/output                      │
│     • No SandboxViolationStore population on Linux                          │
│                                                                              │
│  4. Model sees error codes in output:                                        │
│     • curl: (7) Failed to connect to host                                   │
│     • Permission denied errors                                              │
│                                                                              │
│  KEY DIFFERENCE: macOS proactively monitors violations; Linux reacts to    │
│  error codes in command output.                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code: annotateStderrWithSandboxFailures

**Location:** chunks.55.mjs:3386-3394

```javascript
// ============================================
// annotateStderrWithSandboxFailures - Append violations to stderr
// Location: chunks.55.mjs:3386-3394
// ============================================

// ORIGINAL (for source lookup):
function eb3(A, q) {
    if (!R5) return q;
    let K = V21.getViolationsForCommand(A);
    if (K.length === 0) return q;
    let Y = q;
    Y += Cw8 + "<sandbox_violations>" + Cw8;
    for (let z of K) Y += z.line + Cw8;
    return Y += "</sandbox_violations>", Y
}

// READABLE (for understanding):
function annotateStderrWithSandboxFailures(command, stderr) {
    // Guard: No sandbox config loaded
    if (!currentSandboxConfig) return stderr;

    // Get violations for this specific command
    let violations = violationStore.getViolationsForCommand(command);

    // No violations: return original stderr
    if (violations.length === 0) return stderr;

    // Build annotation
    let annotated = stderr;
    annotated += "\n<sandbox_violations>\n";

    for (let violation of violations) {
        annotated += violation.line + "\n";  // e.g., "Sandbox: file-write* deny /etc/passwd"
    }

    annotated += "</sandbox_violations>";

    return annotated;
}

// Mapping: eb3→annotateStderrWithSandboxFailures, A→command, q→stderr, R5→currentSandboxConfig,
//          V21→violationStore, K→violations, Cw8→newline
```

### Source Code: startLogMonitor (macOS)

**Location:** chunks.55.mjs:2843-2899

```javascript
// ============================================
// startLogMonitor - Monitor macOS sandbox violations via log stream
// Location: chunks.55.mjs:2843-2899
// ============================================

// READABLE (for understanding):
function startLogMonitor() {
    // Spawn log stream process
    let logProcess = spawn("log", [
        "stream",
        "--style", "syslog",
        "--predicate", 'process == "sandbox-exec"'
    ]);

    // Parse log lines
    logProcess.stdout.on("data", (data) => {
        let lines = data.toString().split("\n");

        for (let line of lines) {
            // Look for CMD64_<base64>_END tag
            let match = line.match(/CMD64_([A-Za-z0-9+/=]+)_END/);

            if (match) {
                // Extract base64-encoded command
                let encodedCommand = match[1];

                // Create violation object
                let violation = {
                    line: line,
                    encodedCommand: encodedCommand,
                    timestamp: Date.now()
                };

                // Add to store (triggers notifyListeners)
                violationStore.addViolation(violation);
            }
        }
    });

    // Return cleanup function
    return () => {
        logProcess.kill();
    };
}

// Mapping: UZ7→startLogMonitor
```

---

## 19. Integration with 30_agent_teams (Sandbox Permission Sync)

### Overview

When running in a multi-agent team environment (leader + workers), sandbox restrictions on worker agents need special handling. Workers may encounter network requests that would be blocked by sandbox but are necessary for the task. The Agent Teams Permission Sync system allows workers to request permission from the team leader.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  Agent Teams Sandbox Permission Sync                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Worker Agent                           Leader Agent                         │
│  ┌─────────────────┐                   ┌─────────────────┐                   │
│  │ Network Request │                   │                 │                   │
│  │ (would be       │                   │                 │                   │
│  │  blocked by     │                   │                 │                   │
│  │  sandbox)       │                   │                 │                   │
│  └────────┬────────┘                   │                 │                   │
│           │                            │                 │                   │
│           ▼                            │                 │                   │
│  ┌─────────────────┐                   │                 │                   │
│  │ Create Promise  │                   │                 │                   │
│  │ Register in nc6 │                   │                 │                   │
│  └────────┬────────┘                   │                 │                   │
│           │                            │                 │                   │
│           ▼                            │                 │                   │
│  ┌─────────────────┐    Mailbox     ┌──┴──────────┐      │                   │
│  │ sendSandbox     │ ─────────────► │ InboxPoller │      │                   │
│  │ Permission      │   (request)    │             │      │                   │
│  │ Request (sl4)   │                │ Parse & Add │      │                   │
│  └─────────────────┘                │ to Queue    │      │                   │
│                                     └──┬──────────┘      │                   │
│                                        │                 │                   │
│                                        ▼                 │                   │
│                                     ┌─────────────────┐  │                   │
│                                     │ Permission UI   │◄─┘                   │
│                                     │ Prompt          │                      │
│                                     │ "Worker needs   │                      │
│                                     │  access to X"   │                      │
│                                     └────────┬────────┘                      │
│                                              │                               │
│                                     ┌────────▼────────┐                      │
│                                     │ Leader Approves │                      │
│                                     │ or Denies       │                      │
│                                     └────────┬────────┘                      │
│                                              │                               │
│                                     ┌────────▼────────┐                      │
│  ┌─────────────────┐   Mailbox     │ sendSandbox     │                      │
│  │ resolveCallback │ ◄──────────── │ Permission      │                      │
│  │ (zi4)           │   (response)  │ Response (tl4)  │                      │
│  └────────┬────────┘               └─────────────────┘                      │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │ Promise Resolved│                                                        │
│  │ with true/false │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │ If allowed:     │                                                        │
│  │ Add to allowed  │                                                        │
│  │ domains list    │                                                        │
│  │ Retry request   │                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code: InboxPoller Integration (chunks.194.mjs)

**Location:** chunks.194.mjs:1216-1263

```javascript
// ============================================
// InboxPoller - Sandbox permission request/response handling
// Location: chunks.194.mjs:1216-1263
// ============================================

// ORIGINAL (for source lookup):
// Processing sandbox permission requests
if (G.length > 0 && KZ(M.teamContext)) {
    k(`[InboxPoller] Found ${G.length} sandbox permission request(s)`);
    let g = [];
    for (let B of G) {
        let b = nv1(B.text);
        if (!b) continue;
        if (!b.hostPattern?.host) {
            k("[InboxPoller] Invalid sandbox permission request: missing hostPattern.host");
            continue
        }
        g.push({
            requestId: b.requestId,
            workerId: b.workerId,
            workerName: b.workerName,
            workerColor: b.workerColor,
            host: b.hostPattern.host,
            createdAt: b.createdAt
        })
    }
    if (g.length > 0) {
        w((b) => ({
            ...b,
            workerSandboxPermissions: {
                ...b.workerSandboxPermissions,
                queue: [...b.workerSandboxPermissions.queue, ...g]
            }
        }));
        let B = g[0];
        if (B && !q && !K) Hg({
            message: `${B.workerName} needs network access to ${B.host}`,
            notificationType: "worker_permission_prompt"
        }, $)
    }
}
// Processing sandbox permission responses
if (f.length > 0 && $Y()) {
    k(`[InboxPoller] Found ${f.length} sandbox permission response(s)`);
    for (let g of f) {
        let B = Rc6(g.text);
        if (!B) continue;
        if (Yi4(B.requestId)) k(`[InboxPoller] Processing sandbox permission response for ${B.requestId}: allow=${B.allow}`), zi4({
            requestId: B.requestId,
            host: B.host,
            allow: B.allow
        }), w((b) => ({
            ...b,
            pendingSandboxRequest: null
        }))
    }
}

// READABLE (for understanding):
// === Leader receives sandbox permission requests from workers ===
if (sandboxPermissionRequests.length > 0 && isTeamLeader()) {
    log(`[InboxPoller] Found ${sandboxPermissionRequests.length} sandbox permission request(s)`);

    let validRequests = [];
    for (let request of sandboxPermissionRequests) {
        let parsed = parseSandboxPermissionRequest(request.text);
        if (!parsed) continue;

        // Validate request has required fields
        if (!parsed.hostPattern?.host) {
            log("[InboxPoller] Invalid sandbox permission request: missing hostPattern.host");
            continue;
        }

        validRequests.push({
            requestId: parsed.requestId,
            workerId: parsed.workerId,
            workerName: parsed.workerName,
            workerColor: parsed.workerColor,
            host: parsed.hostPattern.host,
            createdAt: parsed.createdAt
        });
    }

    if (validRequests.length > 0) {
        // Add to queue for UI processing
        setState(prev => ({
            ...prev,
            workerSandboxPermissions: {
                ...prev.workerSandboxPermissions,
                queue: [...prev.workerSandboxPermissions.queue, ...validRequests]
            }
        }));

        // Show notification for first request
        let firstRequest = validRequests[0];
        if (firstRequest && !isShowingPrompt && !isProcessingOther) {
            showNotification({
                message: `${firstRequest.workerName} needs network access to ${firstRequest.host}`,
                notificationType: "worker_permission_prompt"
            });
        }
    }
}

// === Worker receives sandbox permission responses from leader ===
if (sandboxPermissionResponses.length > 0 && isWorker()) {
    log(`[InboxPoller] Found ${sandboxPermissionResponses.length} sandbox permission response(s)`);

    for (let response of sandboxPermissionResponses) {
        let parsed = parseSandboxPermissionResponse(response.text);
        if (!parsed) continue;

        // Check if we have a callback waiting for this response
        if (hasSandboxCallback(parsed.requestId)) {
            log(`[InboxPoller] Processing sandbox permission response for ${parsed.requestId}: allow=${parsed.allow}`);

            // Resolve the waiting Promise
            resolveSandboxCallback({
                requestId: parsed.requestId,
                host: parsed.host,
                allow: parsed.allow
            });

            // Clear pending request state
            setState(prev => ({
                ...prev,
                pendingSandboxRequest: null
            }));
        }
    }
}

// Mapping: G→sandboxPermissionRequests, KZ→isTeamLeader, nv1→parseSandboxPermissionRequest,
//          w→setState, Hg→showNotification, f→sandboxPermissionResponses, $Y→isWorker,
//          Rc6→parseSandboxPermissionResponse, Yi4→hasSandboxCallback, zi4→resolveSandboxCallback
```

### Permission Request Flow

```
1. Worker encounters blocked network request
   │
   ├─ Sandbox would deny access to host: api.example.com
   │
   └─ Instead of failing immediately:
       │
       └─ Create Promise, store resolver in nc6
           │
           └─ Call sendSandboxPermissionRequest(host, requestId)
               │
               └─ Send mailbox message to leader:
                   {
                     type: "sandbox_permission_request",
                     requestId: "sandbox-1711350000000-a1b2c3d",
                     workerId: "worker-123",
                     workerName: "Worker-1",
                     host: "api.example.com"
                   }

2. Leader receives request via InboxPoller
   │
   ├─ Parse message and add to workerSandboxPermissions.queue
   │
   ├─ Show notification: "Worker-1 needs network access to api.example.com"
   │
   └─ Leader makes decision (approve/deny)
       │
       └─ Call sendSandboxPermissionResponse(workerName, requestId, host, allow)
           │
           └─ Send mailbox message to worker:
               {
                 type: "sandbox_permission_response",
                 requestId: "sandbox-1711350000000-a1b2c3d",
                 host: "api.example.com",
                 allow: true
               }

3. Worker receives response via InboxPoller
   │
   ├─ Parse message
   │
   ├─ Check hasSandboxCallback(requestId) → true
   │
   └─ Call resolveSandboxCallback({requestId, host, allow})
       │
       └─ Retrieve resolver from nc6, call resolve(allow)
           │
           └─ Original Promise resolves with true/false
               │
               └─ If allowed: add host to allowedDomains, retry request
                   If denied: return error to user
```

### Key Functions

| Function | Symbol | Purpose |
|----------|--------|---------|
| `generateSandboxRequestId` | `al4` | Create unique request ID |
| `sendSandboxPermissionRequest` | `sl4` | Worker → Leader request |
| `sendSandboxPermissionResponse` | `tl4` | Leader → Worker response |
| `sandboxPermissionCallbacks` | `nc6` | Map of pending callbacks |
| `hasSandboxCallback` | `Yi4` | Check callback exists |
| `resolveSandboxCallback` | `zi4` | Resolve waiting Promise |

### Related Documents

- [../30_agent_teams/](../30_agent_teams/) - Agent Teams architecture
- [permission_sync.md](./permission_sync.md) - Permission synchronization details

- [overview.md](./overview.md) - Complete sandbox architecture
- [initialization_flow.md](./initialization_flow.md) - Bootstrap sequence
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS implementation
- [ui_linkage.md](./ui_linkage.md) - UI components
- [symbol_validation.md](./symbol_validation.md) - Symbol mappings
- [violation_system.md](./violation_system.md) - Violation detection
- [network_proxy.md](./network_proxy.md) - Proxy architecture
- [settings_schema.md](./settings_schema.md) - Configuration reference
- [permission_sync.md](./permission_sync.md) - Swarm permission sync protocol
- [seccomp_filter.md](./seccomp_filter.md) - Linux seccomp BPF filter
- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - All integration points documented, 04_system_reminder integration added