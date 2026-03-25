# Sandbox System Prompt Integration (Claude Code 2.1.76)

## Overview

This document details how the sandbox system injects configuration and behavioral instructions into the Bash tool's system prompt via the `getSandboxSystemPromptBlock` function (E9z). This integration teaches the model:
1. The current sandbox restrictions (filesystem, network, unix sockets)
2. When to use `dangerouslyDisableSandbox: true`
3. How to detect sandbox-caused failures vs. other errors
4. The proper temporary directory to use

## Symbol Validation

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `E9z` | getSandboxSystemPromptBlock | chunks.171.mjs:1892 | ✅ Validated |
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated |
| `_k` | getTempDir | chunks.171.mjs | ✅ Validated |
| `B6` | JSON.stringify | Native | ✅ Validated |
| `fi` | formatInstructions | chunks.171.mjs | ✅ Validated |

---

## Function Signature and Purpose

```javascript
// ============================================
// getSandboxSystemPromptBlock - Generates sandbox instructions for Bash tool
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
    let j = [..._ ? [
        "You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:",
        ["The user *explicitly* asks you to bypass sandbox",
         "A specific command just failed and you see evidence of sandbox restrictions causing the failure. Note that commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)."],
        "Evidence of sandbox-caused failures includes:",
        ['"Operation not permitted" errors for file/network operations',
         "Access denied to specific paths outside allowed directories",
         "Network connection failures to non-whitelisted hosts",
         "Unix socket connection errors"],
        "When you see evidence of sandbox-caused failure:",
        ["Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)",
         "Briefly explain what sandbox restriction likely caused the failure. Be sure to mention that the user can use the `/sandbox` command to manage restrictions.",
         "This will prompt the user for permission"],
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
    // Gate: Sandbox disabled? Return empty string (no instructions)
    if (!sandboxConfigObject.isSandboxingEnabled()) return "";

    // ========================================
    // STEP 1: Gather current sandbox configuration
    // ========================================
    let readConfig = sandboxConfigObject.getFsReadConfig();      // { denyOnly: [...] }
    let writeConfig = sandboxConfigObject.getFsWriteConfig();    // { allowOnly: [...], denyWithinAllow: [...] }
    let networkConfig = sandboxConfigObject.getNetworkRestrictionConfig(); // { allowedHosts, deniedHosts }
    let allowUnixSockets = sandboxConfigObject.getAllowUnixSockets();
    let ignoreViolations = sandboxConfigObject.getIgnoreViolations();
    let fallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();

    // ========================================
    // STEP 2: Build filesystem restrictions object
    // ========================================
    let filesystemRestrictions = { read: readConfig, write: writeConfig };

    // ========================================
    // STEP 3: Build network restrictions object (conditional fields)
    // ========================================
    let networkRestrictions = {
        ...(networkConfig?.allowedHosts && { allowedHosts: networkConfig.allowedHosts }),
        ...(networkConfig?.deniedHosts && { deniedHosts: networkConfig.deniedHosts }),
        ...(allowUnixSockets && { allowUnixSockets: allowUnixSockets })
    };

    // ========================================
    // STEP 4: Build restrictions display list
    // ========================================
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

    // ========================================
    // STEP 5: Branch on override policy
    // ========================================
    let instructions = fallbackAllowed ? [
        // OPEN MODE: Fallback is allowed
        "You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:",
        [
            "The user *explicitly* asks you to bypass sandbox",
            "A specific command just failed and you see evidence of sandbox restrictions causing the failure. Note that commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)."
        ],
        "Evidence of sandbox-caused failures includes:",
        [
            '"Operation not permitted" errors for file/network operations',
            "Access denied to specific paths outside allowed directories",
            "Network connection failures to non-whitelisted hosts",
            "Unix socket connection errors"
        ],
        "When you see evidence of sandbox-caused failure:",
        [
            "Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)",
            "Briefly explain what sandbox restriction likely caused the failure. Be sure to mention that the user can use the `/sandbox` command to manage restrictions.",
            "This will prompt the user for permission"
        ],
        // Anti-continuation pattern
        "Treat each command you execute with `dangerouslyDisableSandbox: true` individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.",
        // Security warning
        "Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist."
    ] : [
        // CLOSED MODE: Fallback is disabled by policy
        "All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.",
        "Commands cannot run outside the sandbox under any circumstances.",
        "If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead."
    ];

    // ========================================
    // STEP 6: Add TMPDIR guidance (always included)
    // ========================================
    instructions.push(
        `For temporary files, always use the \`$TMPDIR\` environment variable (or \`${getTempDir()}\` as a fallback). ` +
        `TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. ` +
        `Do NOT use \`/tmp\` directly - use \`$TMPDIR\` or \`${getTempDir()}\` instead.`
    );

    // ========================================
    // STEP 7: Return formatted block
    // ========================================
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
```

---

## Generated Output Examples

### Open Mode (Fallback Allowed)

When `areUnsandboxedCommandsAllowed() === true`:

```markdown
## Command sandbox

By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.

The sandbox has the following restrictions:
Filesystem: {"read":{"denyOnly":["/etc/passwd"]},"write":{"allowOnly":["/home/user/project"],"denyWithinAllow":["/home/user/project/.env"]}}
Network: {"allowedHosts":["api.anthropic.com","*.github.com"],"deniedHosts":["malware.example.com"]}

- You should always default to running commands within the sandbox. Do NOT attempt to set `dangerouslyDisableSandbox: true` unless:
  - The user *explicitly* asks you to bypass sandbox
  - A specific command just failed and you see evidence of sandbox restrictions causing the failure. Note that commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.).

- Evidence of sandbox-caused failures includes:
  - "Operation not permitted" errors for file/network operations
  - Access denied to specific paths outside allowed directories
  - Network connection failures to non-whitelisted hosts
  - Unix socket connection errors

- When you see evidence of sandbox-caused failure:
  - Immediately retry with `dangerouslyDisableSandbox: true` (don't ask, just do it)
  - Briefly explain what sandbox restriction likely caused the failure. Be sure to mention that the user can use the `/sandbox` command to manage restrictions.
  - This will prompt the user for permission

- Treat each command you execute with `dangerouslyDisableSandbox: true` individually. Even if you have recently run a command with this setting, you should default to running future commands within the sandbox.

- Do not suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the sandbox allowlist.

- For temporary files, always use the `$TMPDIR` environment variable (or `/tmp/claude` as a fallback). TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. Do NOT use `/tmp` directly - use `$TMPDIR` or `/tmp/claude` instead.
```

### Closed Mode (Fallback Disabled by Policy)

When `areUnsandboxedCommandsAllowed() === false`:

```markdown
## Command sandbox

By default, your command will be run in a sandbox. This sandbox controls which directories and network hosts commands may access or modify without an explicit override.

The sandbox has the following restrictions:
Filesystem: {"read":{"denyOnly":[]},"write":{"allowOnly":["/home/user/project"]}}
Network: {"allowedHosts":["api.anthropic.com"]}

- All commands MUST run in sandbox mode - the `dangerouslyDisableSandbox` parameter is disabled by policy.
- Commands cannot run outside the sandbox under any circumstances.
- If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead.

- For temporary files, always use the `$TMPDIR` environment variable (or `/tmp/claude` as a fallback). TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode. Do NOT use `/tmp` directly - use `$TMPDIR` or `/tmp/claude` instead.
```

---

## Key Design Decisions

### 1. Why Serialize Restrictions as JSON

**Decision:** Pass raw configuration objects to the model instead of natural language descriptions.

**Rationale:**
- No ambiguity about what paths/domains are allowed
- Model can reason precisely about path matching
- Changes to configuration are immediately reflected in prompt
- No translation layer that could introduce errors

**Example:**
```javascript
// Instead of: "You can write to your project directory"
// Use: {"write":{"allowOnly":["/home/user/project"]}}
```

### 2. Why "CRITICAL: Do NOT Continue the Pattern"

**Problem:** LLMs exhibit a failure mode where after successfully using `dangerouslyDisableSandbox: true` once, they start applying it to all subsequent commands.

**Solution:** Explicit instruction to treat each command individually:
```
"Treat each command you execute with `dangerouslyDisableSandbox: true` individually.
Even if you have recently run a command with this setting, you should default to
running future commands within the sandbox."
```

### 3. Why Detailed Failure Detection Heuristics

**Problem:** Models often misattribute failures to sandbox when the actual cause is unrelated (missing files, wrong arguments, network issues).

**Solution:** Explicit list of sandbox-caused failure indicators:
```
Evidence of sandbox-caused failures includes:
- "Operation not permitted" errors for file/network operations
- Access denied to specific paths outside allowed directories
- Network connection failures to non-whitelisted hosts
- Unix socket connection errors
```

### 4. Why TMPDIR Guidance

**Problem:** Sandbox remaps `/tmp` to a sandbox-specific directory. Using `/tmp` directly bypasses this remapping and causes failures.

**Solution:** Instruct model to use `$TMPDIR` environment variable:
```
For temporary files, always use the `$TMPDIR` environment variable (or `/tmp/claude` as a fallback).
TMPDIR is automatically set to the correct sandbox-writable directory in sandbox mode.
Do NOT use `/tmp` directly - use `$TMPDIR` or `/tmp/claude` instead.
```

---

## Integration with Bash Tool

### System Prompt Assembly

The `getSandboxSystemPromptBlock` function is called during Bash tool system prompt construction:

```javascript
// ============================================
// Bash tool system prompt construction
// Location: chunks.171.mjs
// ============================================

// READABLE (for understanding):
function buildBashToolDescription(toolUseContext) {
    let sections = [
        "Executes a given bash command and returns its output.",
        "",
        "The working directory persists between commands, but shell state does not...",
        "",
        "# Instructions",
        // ... many instruction sections ...
        getSandboxSystemPromptBlock(),  // <-- Sandbox injection
        // ... more sections ...
    ];

    return sections.join("\n");
}
```

### When Injection Occurs

1. Model decides to use Bash tool
2. System prompt is assembled from multiple sections
3. `getSandboxSystemPromptBlock()` is called
4. If sandbox enabled: full instructions injected
5. If sandbox disabled: empty string returned (no noise)

---

## Open Mode vs Closed Mode Comparison

| Aspect | Open Mode | Closed Mode |
|--------|-----------|-------------|
| `allowUnsandboxedCommands` | `true` | `false` |
| Model can use `dangerouslyDisableSandbox` | Yes (with permission) | No (parameter ignored) |
| Failure recovery | Auto-retry outside sandbox | Must adjust settings |
| Permission prompts | For sandbox bypass | Only for normal permissions |
| Use case | Trusted environment, quick iteration | Enterprise, high security |

### Open Mode Behavioral Instructions

```
1. Default to sandbox
2. Detect sandbox-caused failures
3. Auto-retry with dangerouslyDisableSandbox: true
4. Explain failure and mention /sandbox command
5. Treat each command individually (don't continue pattern)
```

### Closed Mode Behavioral Instructions

```
1. All commands must run in sandbox
2. dangerouslyDisableSandbox is disabled by policy
3. If failure: work with user to adjust settings
4. No automatic bypass attempts
```

---

## Configuration Sources

### Settings File Schema

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "allowUnsandboxedCommands": true,
    "filesystem": {
      "allowWrite": ["/home/user/project"],
      "denyWrite": ["/home/user/project/.env"],
      "denyRead": ["/etc/passwd"]
    },
    "network": {
      "allowedDomains": ["api.anthropic.com", "*.github.com"],
      "deniedDomains": ["malware.example.com"],
      "allowUnixSockets": ["/var/run/docker.sock"],
      "allowAllUnixSockets": false,
      "allowLocalBinding": false
    }
  }
}
```

### Priority Order

1. **Policy settings** (enterprise deployment) - Highest priority, can lock settings
2. **Flag settings** (`--sandbox` CLI flag)
3. **User settings** (`~/.claude/settings.json`)
4. **Project settings** (`.claude/settings.json`)
5. **Local settings** (`.claude/settings.local.json`) - Lowest priority

---

## Related Functions

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `getFsReadConfig` | `Ub3` | chunks.55.mjs:3090 | Get filesystem read restrictions |
| `getFsWriteConfig` | `db3` | chunks.55.mjs:3107 | Get filesystem write restrictions |
| `getNetworkRestrictionConfig` | `cb3` | chunks.55.mjs:3126 | Get network domain allow/deny |
| `getAllowUnixSockets` | `aZ7` | chunks.55.mjs:3140 | Get allowed Unix socket paths |
| `getIgnoreViolations` | `tZ7` | chunks.55.mjs | Get violation ignore patterns |
| `areUnsandboxedCommandsAllowed` | `Hx3` | chunks.56.mjs:341 | Check fallback policy |

---

## Testing the Generated Prompt

### Manual Test

```javascript
// Enable sandbox
await sandboxConfigObject.setSandboxSettings({
    enabled: true,
    autoAllowBashIfSandboxed: true,
    allowUnsandboxedCommands: true
});

// Get the generated prompt
let prompt = getSandboxSystemPromptBlock();
console.log(prompt);

// Should contain:
// - "## Command sandbox"
// - "Filesystem: {...}"
// - "Network: {...}"
// - "dangerouslyDisableSandbox: true"
// - "$TMPDIR"
```

### Verify Empty When Disabled

```javascript
// Disable sandbox
await sandboxConfigObject.setSandboxSettings({ enabled: false });

// Should return empty string
let prompt = getSandboxSystemPromptBlock();
console.assert(prompt === "", "Expected empty string when sandbox disabled");
```

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [cross_module_integration.md](./cross_module_integration.md) - Cross-module integration
- [ui_linkage.md](./ui_linkage.md) - UI components for sandbox
- [settings_schema.md](./settings_schema.md) - Configuration schema

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - All integration points documented