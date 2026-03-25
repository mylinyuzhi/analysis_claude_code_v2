# System Prompt Integration Deep-Dive (Claude Code 2.1.76)

## Overview

This document provides a comprehensive analysis of how the sandbox module integrates with the 04_system_reminder system through the `getSandboxSystemPromptBlock` (E9z) function. This function is responsible for injecting sandbox instructions into the Bash tool's system prompt, teaching the model how to work within sandbox constraints.

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Sandbox section

Key functions in this document:
- `getSandboxSystemPromptBlock` (E9z) - chunks.171.mjs:1892 - Main injection function
- `sandboxConfigObject` (vA) - chunks.56.mjs:516 - Configuration API
- `_k` (getTempDir) - Returns temp directory path

---

## 1. The Injection Point

### Where E9z is Called

The `getSandboxSystemPromptBlock` function is called during Bash tool description construction:

```javascript
// ============================================
// buildBashToolDescription (tGq) - Bash tool description assembly
// Location: chunks.171.mjs:1925-1936
// ============================================

// ORIGINAL (for source lookup):
function tGq() {
    let A = n$(),
        q = [...A ? [] : [`File search: Use ${qz} (NOT find or ls)`, ...],
        // ... build instruction sections ...
    return ["Executes a given bash command and returns its output.", "", ...],
        // ... many sections ...
        E9z(),  // <-- SANDBOX INJECTION POINT
        ...sGq() ? ["", sGq()] : []
    ].join("\n")
}

// READABLE (for understanding):
function buildBashToolDescription() {
    // Build tool description with multiple sections
    let sections = [
        "Executes a given bash command and returns its output.",
        "",
        "The working directory persists between commands...",
        "",
        "# Instructions",
        // ... file search instructions ...
        // ... git instructions ...
        // ... timeout instructions ...
        E9z(),  // <-- SANDBOX INJECTION HERE
        // ... any additional sections ...
    ];

    return sections.join("\n");
}

// Mapping: tGq→buildBashToolDescription, E9z→getSandboxSystemPromptBlock
```

### Why This Approach

**System prompt injection instead of hard-coded instructions:**
- Dynamic content: Instructions reflect current sandbox state
- Configuration-aware: Model knows exact restrictions in effect
- Context-efficient: Empty string when sandbox is disabled

---

## 2. Full E9z Function Analysis

### Source Code with Line-by-Line Annotation

```javascript
// ============================================
// getSandboxSystemPromptBlock - Sandbox instructions for Bash tool
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
    let j = [..._ ? [
        "You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:",
        ["The user *explicitly* asks you to bypass sandbox", "A specific command just failed and you see evidence of sandbox restrictions causing the failure."],
        "Evidence of sandbox-caused failures includes:",
        ['"Operation not permitted" errors for file/network operations', "Access denied to specific paths outside allowed directories", "Network connection failures to non-whitelisted hosts", "Unix socket connection errors"],
        "When you see evidence of sandbox-caused failure:",
        ["Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)", "Briefly explain what sandbox restriction likely caused the failure."],
        "Treat each command you execute with `dangerouslyDisableSandbox: true` individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.",
        "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."
    ] : [
        "All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.",
        "Commands cannot run outside the sandbox under any circumstances.",
        "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
    ],
    `For temporary files, always use the \`$TMPDIR\` environment variable (or \`${_k()}\` as a fallback). TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. Do NOT use \`/tmp\` directly - use \`$TMPDIR\` or \`${_k()}\` instead.`];
    return ["", "## Command sandbox", "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.", "", "The sandbox has the following restrictions:", $.join(`
`), "", ...fi(j)].join(`
`)
}

// READABLE (for understanding):
function getSandboxSystemPromptBlock() {
    // ===== GATE: Sandbox disabled? =====
    if (!sandboxConfigObject.isSandboxingEnabled()) {
        return "";  // No sandbox instructions if sandbox is off
    }

    // ===== STEP 1: Gather Current Configuration =====
    let readConfig = sandboxConfigObject.getFsReadConfig();
    let writeConfig = sandboxConfigObject.getFsWriteConfig();
    let networkConfig = sandboxConfigObject.getNetworkRestrictionConfig();
    let allowUnixSockets = sandboxConfigObject.getAllowUnixSockets();
    let ignoreViolations = sandboxConfigObject.getIgnoreViolations();
    let fallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();

    // ===== STEP 2: Build Filesystem Restrictions Object =====
    let filesystemRestrictions = {
        read: readConfig,   // { denyOnly: [...] }
        write: writeConfig  // { allowOnly: [...], denyWithinAllow: [...] }
    };

    // ===== STEP 3: Build Network Restrictions Object =====
    // Only include fields that are configured (conditional spread)
    let networkRestrictions = {
        ...(networkConfig?.allowedHosts && { allowedHosts: networkConfig.allowedHosts }),
        ...(networkConfig?.deniedHosts && { deniedHosts: networkConfig.deniedHosts }),
        ...(allowUnixSockets && { allowUnixSockets: allowUnixSockets })
    };

    // ===== STEP 4: Build Restrictions Summary =====
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

    // ===== STEP 5: Generate Mode-Specific Instructions =====
    // BRANCH: Open mode (fallback allowed) vs Closed mode (strict sandbox)
    let instructions;

    if (fallbackAllowed) {
        // === OPEN MODE: Model can use dangerouslyDisableSandbox ===
        instructions = [
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
             "Briefly explain what sandbox restriction likely caused the failure."],

            // ANTI-LEARNING PATTERN: Prevent model from always bypassing
            "Treat each command you execute with `dangerouslyDisableSandbox: true` individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.",

            // SECURITY WARNING: Don't suggest sensitive paths
            "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."
        ];
    } else {
        // === CLOSED MODE: No fallback allowed ===
        instructions = [
            "All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.",
            "Commands cannot run outside the sandbox under any circumstances.",
            "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
        ];
    }

    // ===== STEP 6: Add TMPDIR Guidance (Always Included) =====
    let tempDir = getTempDir();  // e.g., "/tmp/claude"
    instructions.push(
        `For temporary files, always use the \`$TMPDIR\` environment variable (or \`${tempDir}\` as a fallback). ` +
        `TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. ` +
        `Do NOT use \`/tmp\` directly - use \`$TMPDIR\` or \`${tempDir}\` instead.`
    );

    // ===== STEP 7: Assemble Final Output =====
    return [
        "",
        "## Command sandbox",
        "By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.",
        "",
        "The sandbox has the following restrictions:",
        restrictions.join("\n"),
        "",
        ...formatInstructions(instructions)  // Convert to bullet points
    ].join("\n");
}

// Mapping: E9z→getSandboxSystemPromptBlock, vA→sandboxConfigObject, B6→JSON.stringify,
//          fi→formatInstructions, _k→getTempDir
```

---

## 3. Open Mode vs Closed Mode

### Open Mode (fallbackAllowed = true)

**When active:** `sandbox.allowUnsandboxedCommands: true` in settings

**Model behavior allowed:**
1. Default to sandboxed execution
2. Detect sandbox-caused failures
3. Retry with `dangerouslyDisableSandbox: true` without asking
4. Explain the failure reason
5. Return to sandboxed execution for next command

**Example instruction block:**
```
## Command sandbox
By default, your command will be run in a sandbox...

The sandbox has the following restrictions:
Filesystem: {"read":{"denyOnly":[]},"write":{"allowOnly":["/home/user/project"]}}
Network: {"allowedHosts":["api.anthropic.com","*.github.com"]}

You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:
- The user *explicitly* asks you to bypass sandbox
- A specific command just failed and you see evidence of sandbox restrictions

Evidence of sandbox-caused failures includes:
- "Operation not permitted" errors
- Access denied to specific paths
- Network connection failures to non-whitelisted hosts

When you see evidence of sandbox-caused failure:
- Immediately retry with `dangerouslyDisableSandbox: true`
- Briefly explain what sandbox restriction caused the failure

For temporary files, always use `$TMPDIR`...
```

### Closed Mode (fallbackAllowed = false)

**When active:** `sandbox.allowUnsandboxedCommands: false` in settings (or managed policy)

**Model behavior enforced:**
1. ALL commands MUST run in sandbox
2. `dangerouslyDisableSandbox` parameter is ignored
3. Only way out: adjust sandbox settings or add to excludedCommands
4. Model cannot self-heal from sandbox failures

**Example instruction block:**
```
## Command sandbox
By default, your command will be run in a sandbox...

The sandbox has the following restrictions:
Filesystem: {"read":{"denyOnly":[]},"write":{"allowOnly":["/home/user/project"]}}

All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.
Commands cannot run outside the sandbox under any circumstances.
If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead.

For temporary files, always use `$TMPDIR`...
```

---

## 4. Anti-Learning Pattern

### The Problem

LLMs exhibit a failure mode where once they successfully use `dangerouslyDisableSandbox: true`, they may continue to use it for all subsequent commands, defeating the sandbox's purpose.

### The Solution

The instruction includes an explicit anti-learning pattern:

```javascript
"Treat each command you execute with `dangerouslyDisableSandbox: true` individually. " +
"Even if you have recently run a command with this setting, you should default to " +
"running future commands within the sandbox."
```

**Why this works:**
- Explicit instruction to forget previous bypass patterns
- Forces model to re-evaluate sandbox necessity for each command
- Prevents "shortcut" behavior

---

## 5. TMPDIR Handling

### Why Special TMPDIR Guidance

**The problem:**
- `/tmp` is a common default for temp files
- Sandbox may not allow writes to `/tmp`
- Each sandbox execution gets a unique temp directory

**The solution:**
- `TMPDIR` environment variable is set by sandbox wrapper
- Points to sandbox-writable directory
- Model instructed to use `$TMPDIR` instead of `/tmp`

### Source Code Reference

```javascript
// In the sandbox wrapper (conceptual)
function wrapWithSandbox(command) {
    let tempDir = createSandboxTempDir();  // e.g., /tmp/claude_ABC123

    return `TMPDIR=${tempDir} sandbox-exec -p <profile> bash -c "${command}"`;
}
```

### Model Instructions

```
For temporary files, always use the `$TMPDIR` environment variable (or `/tmp/claude` as a fallback).
TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode.
Do NOT use `/tmp` directly - use `$TMPDIR` or `/tmp/claude` instead.
```

---

## 6. Security Warnings

### Path Sensitivity Warning

The instruction explicitly warns against suggesting sensitive paths:

```javascript
"Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, " +
"or credential files to the sandbox allowlist."
```

**Why this matters:**
- Users might ask model to "fix" sandbox by adding paths
- Shell config files contain sensitive environment variables
- `.ssh/*` contains private keys
- Model should not facilitate security bypass

---

## 7. Integration with 04_system_reminder

### Attachment Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  04_system_reminder Integration Flow                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Bash Tool Call Preparation                                                 │
│       │                                                                      │
│       └─ Agent loop prepares tool call                                     │
│              │                                                               │
│              └─ buildSystemPrompt() called                                 │
│                     │                                                        │
│                     └─ For Bash tool: calls buildBashToolDescription()     │
│                            │                                                 │
│                            └─ Calls E9z() → getSandboxSystemPromptBlock() │
│                                   │                                          │
│                                   ├─ Checks isSandboxingEnabled()          │
│                                   │                                          │
│                                   ├─ Gathers current config                 │
│                                   │                                          │
│                                   ├─ Builds instructions (open/closed mode) │
│                                   │                                          │
│                                   └─ Returns formatted string               │
│                                                                          │
│  Final System Prompt                                                        │
│       │                                                                      │
│       └─ Contains sandbox instructions inline                              │
│              │                                                               │
│              └─ Model sees: "## Command sandbox..."                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Violation Attachments

When sandbox violations occur, they're attached to the model's context:

```javascript
// In annotateStderrWithSandboxFailures (eb3)
function annotateStderrWithSandboxFailures(stderr, command) {
    let store = sandboxConfigObject.getSandboxViolationStore();
    let violations = store.getViolationsForCommand(command);

    if (violations.length === 0) {
        return stderr;
    }

    // Append violation block to stderr
    let violationBlock = violations.map(v =>
        `Sandbox: ${v.line}`
    ).join("\n");

    return stderr + "\n<sandbox_violations>\n" + violationBlock + "\n</sandbox_violations>";
}
```

**Model sees in command output:**
```
<sandbox_violations>
Sandbox: file-write* deny /etc/passwd
Sandbox: network-outbound deny 192.168.1.1:443
</sandbox_violations>
```

---

## 8. mcp-cli Exception

### Why mcp-cli Commands Bypass Sandbox

```javascript
// In system prompt (when mcpCliEnabled)
"EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`"
```

**Reason:**
- `mcp-cli` commands don't execute real shell commands
- They route through parent process MCP connections
- Parent handles actual execution with proper sandboxing
- Sandboxing `mcp-cli` would double-wrap and fail

---

## Summary

The `getSandboxSystemPromptBlock` (E9z) function is the critical bridge between sandbox configuration and model behavior:

1. **Dynamic Injection** - Instructions reflect live configuration
2. **Open/Closed Modes** - Different behavior based on policy
3. **Anti-Learning Pattern** - Prevents bypass abuse
4. **TMPDIR Guidance** - Ensures temp file writes succeed
5. **Security Warnings** - Protects sensitive paths
6. **Violation Context** - Model sees blocked operations

---

## Related Documents

- [cross_module_integration.md](./cross_module_integration.md) - Full integration analysis
- [overview.md](./overview.md) - Sandbox architecture
- [violation_system.md](./violation_system.md) - Violation detection
- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Full E9z function analysis with source code