# Sandbox Cross-Module Integration (Claude Code 2.1.76)

## Overview

The sandbox system integrates deeply with multiple Claude Code modules. This document maps all integration points, showing how sandbox connects to system reminders, permissions, hooks, Bash tool, and other features.

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
// Location: chunks.171.mjs:1892-1922
// ============================================

// ORIGINAL (for source lookup):
function E9z() {
    if (!vA.isSandboxingEnabled()) return "";
    let A = vA.getFsReadConfig(),
        q = vA.getFsWriteConfig(),
        K = vA.getNetworkRestrictionConfig(),
        Y = vA.getAllowUnixSockets(),
        z = vA.getIgnoreViolations(),
        _ = vA.areUnsandboxedCommandsAllowed();
    // ... builds restrictions JSON and instructions
}

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

// Mapping: nBY→getSandboxSystemPromptBlock, vA→sandboxConfigObject, q→readConfig, K→writeConfig, Y→networkConfig
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
- `SandboxModeSelector` (_Hq) - 3-way mode picker
- `SandboxStatusDisplay` (zHq) - Current config summary
- `SandboxOverridesSettings` (HHq) - Open/closed policy
- `SandboxDependenciesPanel` (nuA) - Dependency status

### Status Bar Violation Indicator

**What it does:** Shows a transient flash when new sandbox violations are detected (macOS only).

```javascript
// SandboxViolationStatusLine (lWq)
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
| 01_cli | /sandbox command | _Hq (SandboxModeSelector) |
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

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture
- [ui_linkage.md](./ui_linkage.md) - UI components
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS implementation
- [../06_mcp/cross_module_integration.md](../06_mcp/cross_module_integration.md) - MCP integration
- [../22_ide_integration/cross_module_integration.md](../22_ide_integration/cross_module_integration.md) - IDE integration