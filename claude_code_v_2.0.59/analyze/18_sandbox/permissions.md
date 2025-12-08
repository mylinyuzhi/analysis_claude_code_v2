# Sandbox Permissions

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `isBashSandboxed` (WIA) - Determine if command runs in sandbox
- `isSandboxingEnabled` (ixA) - High-level sandbox availability check
- `areUnsandboxedCommandsAllowed` (c64) - Check bypass policy
- `isAutoAllowBashEnabled` (d64) - Check auto-allow mode
- `isExcludedCommand` (OK5) - Check if command is excluded
- `getSandboxRestrictionsSummary` (dU6) - Generate user-facing restrictions text

---

## 1. Permission Decision Flow

### Design Philosophy: Defense in Depth

The sandbox permission system implements **multiple layers of control**:

```
Layer 1: Global Toggle (sandbox.enabled)
    └─► Layer 2: Bypass Policy (allowUnsandboxedCommands)
         └─► Layer 3: Per-command Bypass (dangerouslyDisableSandbox)
              └─► Layer 4: Exclusion List (excludedCommands)
                   └─► Final: Run in Sandbox
```

**Why this layered approach?**
1. **Enterprise control** - Admins can lock Layer 1 & 2 via policySettings
2. **User flexibility** - Users can adjust Layer 3 & 4 for their workflow
3. **Model autonomy** - Model can request Layer 3 bypass when needed
4. **Fail-safe default** - Default path is sandboxed execution

### Main Decision Function: isBashSandboxed

```javascript
// ============================================
// isBashSandboxed - Determine if command should run in sandbox
// Location: chunks.106.mjs:446-452
// ============================================

// ORIGINAL (for source lookup):
function WIA(A) {
  if (!nQ.isSandboxingEnabled()) return !1;
  if (A.dangerouslyDisableSandbox && nQ.areUnsandboxedCommandsAllowed()) return !1;
  if (!A.command) return !1;
  if (OK5(A.command)) return !1;
  return !0
}

// READABLE (for understanding):
function isBashSandboxed(toolInput) {
  // Gate 1: Is sandbox globally enabled?
  if (!sandboxManager.isSandboxingEnabled()) {
    return false;  // Sandbox disabled, run normally
  }

  // Gate 2: Is bypass requested AND allowed by policy?
  if (toolInput.dangerouslyDisableSandbox && sandboxManager.areUnsandboxedCommandsAllowed()) {
    return false;  // Bypass allowed, run without sandbox
  }

  // Gate 3: Is there actually a command to run?
  if (!toolInput.command) {
    return false;  // No command, nothing to sandbox
  }

  // Gate 4: Is command in the excluded list?
  if (isExcludedCommand(toolInput.command)) {
    return false;  // Command excluded, run without sandbox
  }

  // Default: Run in sandbox
  return true;
}

// Mapping: WIA→isBashSandboxed, A→toolInput, nQ→sandboxManager, OK5→isExcludedCommand
```

### Decision Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         isBashSandboxed(toolInput)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Gate 1: Global Sandbox Check                      │   │
│  │                                                                       │   │
│  │  isSandboxingEnabled() ?                                             │   │
│  │      │                                                               │   │
│  │      ├── false ────────────────────────────────────────▶ RETURN false│   │
│  │      │           (sandbox disabled, run normally)                    │   │
│  │      │                                                               │   │
│  │      └── true ─▶ Continue to Gate 2                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Gate 2: Bypass Request Check                      │   │
│  │                                                                       │   │
│  │  toolInput.dangerouslyDisableSandbox == true                         │   │
│  │  AND areUnsandboxedCommandsAllowed() == true ?                       │   │
│  │      │                                                               │   │
│  │      ├── true ─────────────────────────────────────────▶ RETURN false│   │
│  │      │           (bypass granted by policy)                          │   │
│  │      │                                                               │   │
│  │      └── false ─▶ Continue to Gate 3                                 │   │
│  │                   (either not requested or not allowed)              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Gate 3: Command Presence Check                    │   │
│  │                                                                       │   │
│  │  toolInput.command exists ?                                          │   │
│  │      │                                                               │   │
│  │      ├── false ────────────────────────────────────────▶ RETURN false│   │
│  │      │           (nothing to sandbox)                                │   │
│  │      │                                                               │   │
│  │      └── true ─▶ Continue to Gate 4                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Gate 4: Excluded Command Check                    │   │
│  │                                                                       │   │
│  │  isExcludedCommand(toolInput.command) ?                              │   │
│  │      │                                                               │   │
│  │      ├── true ─────────────────────────────────────────▶ RETURN false│   │
│  │      │           (command explicitly excluded)                       │   │
│  │      │                                                               │   │
│  │      └── false ─▶ RETURN true                                        │   │
│  │                   (run in sandbox)                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Sandbox Availability Check

### isSandboxingEnabled

```javascript
// ============================================
// isSandboxingEnabled - Check if sandbox is available and enabled
// Location: chunks.19.mjs:628-634
// ============================================

// ORIGINAL (for source lookup):
function ixA() {
  let A = dQ(),
    Q = A === "wsl" ? "linux" : A;
  if (!xI.isSupportedPlatform(Q)) return !1;
  if (!oH1()) return !1;
  return m64()
}

// READABLE (for understanding):
function isSandboxingEnabled() {
  // Step 1: Get platform (treat WSL as Linux)
  let platform = getPlatformId();  // dQ
  let normalizedPlatform = platform === "wsl" ? "linux" : platform;

  // Step 2: Check platform support
  if (!sandboxEngine.isSupportedPlatform(normalizedPlatform)) {
    return false;  // Platform not supported (Windows, etc.)
  }

  // Step 3: Check dependencies
  if (!checkDependencies()) {  // oH1 - cached
    return false;  // Missing ripgrep, bwrap, socat, etc.
  }

  // Step 4: Check settings
  return isSandboxEnabledInSettings();  // m64
}

// Mapping: ixA→isSandboxingEnabled, A→platform, dQ→getPlatformId, xI→sandboxEngine, oH1→checkDependencies
```

### Platform Support Check

```javascript
// ============================================
// isSupportedPlatform - Check if platform supports sandboxing
// Location: chunks.17.mjs:290-292
// ============================================

// ORIGINAL (for source lookup):
function xm0(A) {
  return ["macos", "linux"].includes(A)
}

// READABLE (for understanding):
function isSupportedPlatform(platform) {
  return ["macos", "linux"].includes(platform);
  // Windows and other platforms not supported
}

// Mapping: xm0→isSupportedPlatform
```

---

## 3. Auto-Allow Mode

### Auto-Allow Decision Logic

When `autoAllowBashIfSandboxed` is enabled, bash commands in sandboxed mode are automatically approved without prompting:

```javascript
// ============================================
// autoAllowBashDecision - Auto-allow sandboxed bash commands
// Location: chunks.90.mjs:1925-1932
// ============================================

// Context: This is returned when checking bash permission in sandbox mode

// READABLE (for understanding):
// When in sandbox mode with autoAllowBashIfSandboxed enabled:
return {
  behavior: "allow",
  updatedInput: toolInput,
  decisionReason: {
    type: "other",
    reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
  }
};

// This means:
// 1. Command runs without user prompt
// 2. Sandbox restrictions still apply
// 3. User can disable via settings
```

### Mode Comparison

| Mode | `sandbox.enabled` | `autoAllowBashIfSandboxed` | Behavior |
|------|-------------------|---------------------------|----------|
| **Disabled** | false | N/A | Normal permission prompts |
| **Auto-Allow** | true | true | Sandbox + no bash prompts (in accept-edits) |
| **Strict** | true | false | Sandbox + prompt for each command |

---

## 4. Bypass Policy (dangerouslyDisableSandbox)

### Policy Gate

The `dangerouslyDisableSandbox` parameter allows bypassing sandbox, but only if policy permits:

```javascript
// ============================================
// Bypass decision in isBashSandboxed
// Location: chunks.106.mjs:448
// ============================================

// ORIGINAL:
if (A.dangerouslyDisableSandbox && nQ.areUnsandboxedCommandsAllowed()) return !1;

// READABLE:
// Both conditions must be true for bypass:
// 1. Tool requested bypass: dangerouslyDisableSandbox = true
// 2. Policy allows bypass: areUnsandboxedCommandsAllowed() = true

// If allowUnsandboxedCommands is false in settings:
// - dangerouslyDisableSandbox is completely ignored
// - All commands MUST run in sandbox
```

### Bash Tool Schema

```javascript
// ============================================
// Bash tool input schema with dangerouslyDisableSandbox
// Location: chunks.106.mjs:663
// ============================================

// Schema definition:
{
  dangerouslyDisableSandbox: z.boolean().optional().describe(
    "Set this to true to dangerously override sandbox mode and run commands without sandboxing."
  )
}
```

### System Prompt Guidance

The sandbox system generates guidance in the system prompt:

```javascript
// ============================================
// getSandboxRestrictionsSummary - Generate restrictions text for system prompt
// Location: chunks.71.mjs:670-734
// ============================================

// ORIGINAL (for source lookup):
function dU6() {
  if (!nQ.isSandboxingEnabled()) return "";
  let A = nQ.getFsReadConfig(),
    Q = nQ.getFsWriteConfig(),
    B = nQ.getNetworkRestrictionConfig(),
    G = nQ.getAllowUnixSockets(),
    Z = nQ.getIgnoreViolations(),
    I = nQ.areUnsandboxedCommandsAllowed(),
    // ... build restrictions JSON ...
    V = I ? `  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
    - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox - each command should run sandboxed by default
    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions causing the failure
    - When analyzing failures:
      - Commands can fail for many reasons unrelated to the sandbox (missing files, wrong arguments, network issues, etc.)
      - Evidence of sandbox-caused failures includes:
        - "Operation not permitted" errors for file/network operations
        - Access denied to specific paths outside allowed directories
        - Network connection failures to non-whitelisted hosts
        - Unix socket connection errors
      - Sandbox violation logs can be noisy, but clear permission errors are strong indicators
    - When you see evidence of sandbox-caused failure:
      - IMMEDIATELY retry with \`dangerouslyDisableSandbox: true\` (don't ask, just do it)
      - Briefly explain what sandbox restriction likely caused the failure
      - Mention: "Use \`/sandbox\` to manage restrictions"
      - This will prompt the user for permission
    - Example of normal usage: { "command": "ls", "description": "List files" }
    - Example of override: { "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }
    - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the allowlist`
    : "  - CRITICAL: All commands MUST run in sandbox mode - the \`dangerouslyDisableSandbox\` parameter is disabled by policy\n    - Commands cannot run outside the sandbox under any circumstances\n    - If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead";

  return `- Commands run in a sandbox by default with the following restrictions:
${W.join(`\n`)}
${V}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
    - Do NOT use \`/tmp\` directly - use \`/tmp/claude/\` or rely on TMPDIR instead
    - Most programs that respect TMPDIR will automatically use \`/tmp/claude/\``
}

// READABLE (for understanding):
function getSandboxRestrictionsSummary() {
  if (!sandboxManager.isSandboxingEnabled()) {
    return "";  // No restrictions if sandbox disabled
  }

  // Get current restrictions
  let readConfig = sandboxManager.getFsReadConfig();
  let writeConfig = sandboxManager.getFsWriteConfig();
  let networkConfig = sandboxManager.getNetworkRestrictionConfig();
  let unixSockets = sandboxManager.getAllowUnixSockets();
  let ignoreViolations = sandboxManager.getIgnoreViolations();
  let unsandboxedAllowed = sandboxManager.areUnsandboxedCommandsAllowed();

  // Build restrictions display
  let restrictions = [];
  // ... format filesystem and network restrictions ...

  // Generate policy-specific guidance
  let policyGuidance;
  if (unsandboxedAllowed) {
    // "Open" policy: Allow bypass on failure
    policyGuidance = `
  - CRITICAL: Commands run in sandbox by default
  - Set dangerouslyDisableSandbox: true only if:
    1. User explicitly asks to bypass
    2. Command failed due to sandbox restrictions
  - When retrying after sandbox failure:
    - Retry immediately with dangerouslyDisableSandbox: true
    - Explain what restriction caused failure
    - Mention "/sandbox" command for managing restrictions`;
  } else {
    // "Strict" policy: No bypass allowed
    policyGuidance = `
  - CRITICAL: All commands MUST run in sandbox mode
  - dangerouslyDisableSandbox parameter is disabled by policy
  - Work with user to adjust settings if commands fail`;
  }

  return `
- Commands run in sandbox with restrictions:
${restrictions.join('\n')}
${policyGuidance}
- Use /tmp/claude/ for temporary files (TMPDIR is set automatically)`;
}

// Mapping: dU6→getSandboxRestrictionsSummary, I→unsandboxedAllowed, nQ→sandboxManager
```

---

## 5. Excluded Commands

### Checking Excluded Commands

```javascript
// ============================================
// isExcludedCommand - Check if command is in excluded list
// Location: chunks.106.mjs (referenced in WIA)
// ============================================

// READABLE (for understanding):
function isExcludedCommand(command) {
  let excludedCommands = getExcludedCommands();  // n64

  for (let excluded of excludedCommands) {
    // Check for exact match
    if (command === excluded) {
      return true;
    }

    // Check for prefix match (e.g., "npm" matches "npm run test")
    if (command.startsWith(excluded + " ")) {
      return true;
    }

    // Check for pattern match (e.g., "npm:*" matches any npm command)
    if (excluded.endsWith(":*")) {
      let prefix = excluded.slice(0, -2);
      if (command.startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
}
```

### Managing Excluded Commands

Users can manage excluded commands via the `/sandbox` command:

```
/sandbox exclude "npm run test"    # Exclude specific command
/sandbox exclude "npm:*"           # Exclude all npm commands
/sandbox list                      # List current exclusions
```

---

## 6. Permission Modes Comparison

### Open Mode (Default)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Open Mode (Default Policy)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Settings:                                                       │
│    sandbox.enabled = true                                        │
│    sandbox.allowUnsandboxedCommands = true (default)            │
│                                                                  │
│  Behavior:                                                       │
│    1. Commands run in sandbox by default                         │
│    2. If command fails due to sandbox restrictions:              │
│       - Model can retry with dangerouslyDisableSandbox: true    │
│       - User is prompted to approve unsandboxed execution       │
│    3. Approved commands can bypass sandbox                       │
│                                                                  │
│  Use Case:                                                       │
│    - Development environments                                    │
│    - When some tools need full system access                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Strict Mode

```
┌─────────────────────────────────────────────────────────────────┐
│                    Strict Mode (Closed Policy)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Settings:                                                       │
│    sandbox.enabled = true                                        │
│    sandbox.allowUnsandboxedCommands = false                     │
│                                                                  │
│  Behavior:                                                       │
│    1. ALL commands run in sandbox, no exceptions                 │
│    2. dangerouslyDisableSandbox parameter is ignored            │
│    3. Commands failing due to sandbox must:                      │
│       - Be added to excludedCommands, OR                         │
│       - Have sandbox settings adjusted                           │
│                                                                  │
│  Use Case:                                                       │
│    - High-security environments                                  │
│    - Enterprise deployments                                      │
│    - When absolute containment is required                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Root/Sudo Protection

### IS_SANDBOX Environment Variable

```javascript
// ============================================
// Root privilege check with IS_SANDBOX bypass
// Location: chunks.157.mjs:1648
// ============================================

// ORIGINAL (for source lookup):
if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0 && !process.env.IS_SANDBOX)
  console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"), process.exit(1)

// READABLE (for understanding):
function checkRootPrivilegeBypass() {
  // Only check on Unix-like systems
  if (process.platform === "win32") return;
  if (typeof process.getuid !== "function") return;

  // If running as root (UID 0)
  if (process.getuid() === 0) {
    // IS_SANDBOX env var allows bypass when in sandbox
    if (!process.env.IS_SANDBOX) {
      console.error(
        "--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"
      );
      process.exit(1);
    }
    // If IS_SANDBOX is set, root bypass is allowed
    // (sandbox provides the security boundary)
  }
}

// Purpose:
// - Prevent privilege escalation when running as root
// - IS_SANDBOX indicates sandbox is providing security
// - Root bypass only allowed inside sandbox container
```

---

## 8. Network Permission Checks

### Why Proxy-based Network Control?

**Problem:** Need to filter network access by domain, but:
- Container-level network isolation blocks ALL network (too restrictive)
- Cannot inspect encrypted HTTPS traffic destination
- Application-layer filtering (iptables) requires root

**Solution: Transparent proxy with CONNECT inspection**

```
Command: curl https://api.github.com/user
    │
    ▼
HTTPS_PROXY=localhost:3128
    │
    ▼
HTTP CONNECT api.github.com:443
    │
    ▼
Proxy Server (checkNetworkAccess)
    │
    ├─► Deny list match? → Block
    ├─► Allow list match? → Permit
    └─► Neither? → Ask user (or deny)
```

**Why this approach:**
1. **HTTP CONNECT reveals destination** - Even for HTTPS, proxy sees target domain
2. **No certificate manipulation** - Doesn't break TLS (unlike MITM proxies)
3. **Works with most tools** - Standard proxy env vars widely supported
4. **User can approve** - Interactive permission for unknown domains

**Key insight:** The proxy doesn't decrypt traffic - it only sees the CONNECT request which contains the target hostname. Actual data remains encrypted end-to-end.

### Domain Matching Logic

```javascript
// ============================================
// domainMatches - Check if domain matches allow/deny pattern
// Location: chunks.17.mjs:190-196
// ============================================

// ORIGINAL (for source lookup):
function _m0(A, Q) {
  if (Q.startsWith("*.")) {
    let B = Q.substring(2);
    return A.toLowerCase().endsWith("." + B.toLowerCase())
  }
  return A.toLowerCase() === Q.toLowerCase()
}

// READABLE (for understanding):
function domainMatches(requestDomain, rulePattern) {
  // Wildcard subdomain pattern: *.example.com
  if (rulePattern.startsWith("*.")) {
    let baseDomain = rulePattern.substring(2);  // "example.com"
    // Check if request ends with ".example.com"
    return requestDomain.toLowerCase().endsWith("." + baseDomain.toLowerCase());
    // Matches: sub.example.com, deep.sub.example.com
    // Does NOT match: example.com (exact match needed for that)
  }

  // Exact domain match (case-insensitive)
  return requestDomain.toLowerCase() === rulePattern.toLowerCase();
}

// Mapping: _m0→domainMatches, A→requestDomain, Q→rulePattern
```

### Network Access Decision

```javascript
// ============================================
// checkNetworkAccess - Decide if network request is allowed
// Location: chunks.17.mjs:198-217
// ============================================

// ORIGINAL (for source lookup):
async function ym0(A, Q, B) {
  if (!e8) return kQ("No config available, denying network request"), !1;
  for (let G of e8.network.deniedDomains)
    if (_m0(Q, G)) return kQ(`Denied by config rule: ${Q}:${A}`), !1;
  for (let G of e8.network.allowedDomains)
    if (_m0(Q, G)) return kQ(`Allowed by config rule: ${Q}:${A}`), !0;
  if (!B) return kQ(`No matching config rule, denying: ${Q}:${A}`), !1;
  kQ(`No matching config rule, asking user: ${Q}:${A}`);
  try {
    if (await B({ host: Q, port: A })) return kQ(`User allowed: ${Q}:${A}`), !0;
    else return kQ(`User denied: ${Q}:${A}`), !1
  } catch (G) {
    return kQ(`Error in permission callback: ${G}`, { level: "error" }), !1
  }
}

// READABLE (for understanding):
async function checkNetworkAccess(port, domain, userPermissionCallback) {
  // No config = deny all
  if (!globalConfig) {
    log("No config available, denying network request");
    return false;
  }

  // Step 1: Check deny list first (deny wins over allow)
  for (let deniedPattern of globalConfig.network.deniedDomains) {
    if (domainMatches(domain, deniedPattern)) {
      log(`Denied by config rule: ${domain}:${port}`);
      return false;
    }
  }

  // Step 2: Check allow list
  for (let allowedPattern of globalConfig.network.allowedDomains) {
    if (domainMatches(domain, allowedPattern)) {
      log(`Allowed by config rule: ${domain}:${port}`);
      return true;
    }
  }

  // Step 3: No matching rule - ask user or deny
  if (!userPermissionCallback) {
    log(`No matching config rule, denying: ${domain}:${port}`);
    return false;
  }

  log(`No matching config rule, asking user: ${domain}:${port}`);
  try {
    if (await userPermissionCallback({ host: domain, port: port })) {
      log(`User allowed: ${domain}:${port}`);
      return true;
    } else {
      log(`User denied: ${domain}:${port}`);
      return false;
    }
  } catch (error) {
    log(`Error in permission callback: ${error}`, { level: "error" });
    return false;
  }
}

// Mapping: ym0→checkNetworkAccess, A→port, Q→domain, B→userPermissionCallback, e8→globalConfig
```

---

## 9. MCP CLI Exception

MCP CLI commands have a special exception:

```javascript
// From getSandboxRestrictionsSummary (dU6):
let X = bZ() ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true` as they do not work properly in sandboxed mode\n" : "";

// When MCP CLI is enabled (bZ() returns true):
// - mcp-cli commands are documented as requiring sandbox bypass
// - This is a known limitation of MCP protocol in sandboxed environments
```

---

## See Also

- [overview.md](./overview.md) - System architecture
- [configuration.md](./configuration.md) - Configuration structure
- [macos_implementation.md](./macos_implementation.md) - macOS implementation
- [linux_implementation.md](./linux_implementation.md) - Linux implementation
