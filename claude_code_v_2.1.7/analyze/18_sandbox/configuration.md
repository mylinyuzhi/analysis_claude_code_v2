# Sandbox Configuration (2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isSandboxEnabledInSettings` (xEB) - Check if sandbox enabled
- `isAutoAllowBashEnabled` (yEB) - Check auto-allow mode
- `areUnsandboxedCommandsAllowed` (vEB) - Check bypass policy
- `sandboxManager` (XB) - Central sandbox management object

---

## 1. Configuration Sources

### Settings Hierarchy

Configuration is loaded from multiple sources with the following priority (highest to lowest):

```
+------------------------------------------------------------------+
|                    Configuration Priority                          |
+------------------------------------------------------------------+
|                                                                    |
|  1. CLI Arguments (--sandbox, --no-sandbox)                       |
|     ├── Highest priority                                          |
|     └── Set via command line flags                                |
|                                                                    |
|  2. policySettings (Enterprise/MDM)                               |
|     ├── Organization-controlled                                   |
|     └── Cannot be overridden by user                              |
|                                                                    |
|  3. flagSettings (Session flags)                                  |
|     ├── Temporary overrides                                       |
|     └── Per-session only                                          |
|                                                                    |
|  4. localSettings (User preferences)                              |
|     ├── Per-project settings                                      |
|     └── Stored in .claude/ directory                              |
|                                                                    |
|  5. userSettings (Global user preferences)                        |
|     ├── User-level defaults                                       |
|     └── Stored in ~/.config/claude-code/                          |
|                                                                    |
|  6. Default Values                                                 |
|     ├── sandbox.enabled = false                                   |
|     ├── sandbox.autoAllowBashIfSandboxed = true                  |
|     └── sandbox.allowUnsandboxedCommands = true                  |
|                                                                    |
+------------------------------------------------------------------+
```

### Why This Hierarchy

1. **Enterprise control** - Organizations can enforce sandbox policies via MDM
2. **User flexibility** - Users can customize within policy constraints
3. **Project-specific** - Different projects can have different settings
4. **Sensible defaults** - Works out of the box without configuration

---

## 2. Configuration Schema

### Sandbox Configuration Section

```typescript
interface SandboxSettings {
  // Core settings
  sandbox?: {
    enabled?: boolean;              // Enable sandbox mode (default: false)
    autoAllowBashIfSandboxed?: boolean;  // Auto-approve bash in sandbox (default: true)
    allowUnsandboxedCommands?: boolean;  // Allow dangerouslyDisableSandbox (default: true)
  };

  // Detailed configuration (when sandbox is enabled)
  sandboxConfig?: SandboxConfig;
}

interface SandboxConfig {
  network: {
    allowedDomains: string[];       // Whitelist of allowed domains
    deniedDomains: string[];        // Blacklist of denied domains
    allowUnixSockets?: string[];    // Specific Unix socket paths to allow
    allowAllUnixSockets?: boolean;  // Allow all Unix sockets
    allowLocalBinding?: boolean;    // Allow localhost connections
    httpProxyPort?: number;         // External HTTP proxy port
    socksProxyPort?: number;        // External SOCKS proxy port
  };
  filesystem: {
    denyRead: string[];             // Paths to deny reading
    allowWrite: string[];           // Paths to allow writing
    denyWrite: string[];            // Paths to deny within allowed areas
  };
  ignoreViolations?: {
    "*"?: string[];                 // Global ignore patterns
    [command: string]: string[];    // Per-command ignore patterns
  };
  enableWeakerNestedSandbox?: boolean; // For Docker environments
  ripgrep?: {
    command: string;                // Custom ripgrep path
    args?: string[];                // Additional ripgrep arguments
  };
  mandatoryDenySearchDepth?: number;   // Depth for dangerous file search (default: 3)
}
```

### Permission Rules Integration

The sandbox configuration also interacts with permission rules:

```typescript
interface PermissionSettings {
  permissions?: {
    allow?: string[];               // Allowed tool patterns
    deny?: string[];                // Denied tool patterns
  };
}
```

---

## 3. Settings Getter Functions

### 3.1 isSandboxEnabledInSettings

```javascript
// ============================================
// isSandboxEnabledInSettings - Check if sandbox is enabled
// Location: chunks.55.mjs:1509-1511
// ============================================

// ORIGINAL (for source lookup):
xEB = W0((A) => {
  return A?.sandbox?.enabled ?? !1
});

// READABLE (for understanding):
const isSandboxEnabledInSettings = memoize((settings) => {
  return settings?.sandbox?.enabled ?? false;
});

// Mapping: xEB->isSandboxEnabledInSettings, W0->memoize, A->settings
```

**Why memoize:** Settings are read frequently during command execution. Memoization avoids repeated object traversal.

### 3.2 isAutoAllowBashEnabled

```javascript
// ============================================
// isAutoAllowBashEnabled - Check auto-allow bash mode
// Location: chunks.55.mjs:1512-1514
// ============================================

// ORIGINAL (for source lookup):
yEB = W0((A) => {
  return A?.sandbox?.autoAllowBashIfSandboxed ?? !0
});

// READABLE (for understanding):
const isAutoAllowBashEnabled = memoize((settings) => {
  return settings?.sandbox?.autoAllowBashIfSandboxed ?? true;
});

// Mapping: yEB->isAutoAllowBashEnabled
```

**What this controls:**
- When `true` and sandbox is enabled, bash commands are auto-approved
- When `false`, each bash command requires explicit permission

### 3.3 areUnsandboxedCommandsAllowed

```javascript
// ============================================
// areUnsandboxedCommandsAllowed - Check bypass policy
// Location: chunks.55.mjs:1515-1517
// ============================================

// ORIGINAL (for source lookup):
vEB = W0((A) => {
  return A?.sandbox?.allowUnsandboxedCommands ?? !0
});

// READABLE (for understanding):
const areUnsandboxedCommandsAllowed = memoize((settings) => {
  return settings?.sandbox?.allowUnsandboxedCommands ?? true;
});

// Mapping: vEB->areUnsandboxedCommandsAllowed
```

**What this controls:**
- When `true`, `dangerouslyDisableSandbox` parameter can bypass sandbox
- When `false`, all commands MUST run in sandbox (parameter is ignored)

---

## 4. Configuration Persistence

### Settings File Locations

| Type | Location | Purpose |
|------|----------|---------|
| User settings | `~/.config/claude-code/settings.json` | User-level defaults |
| Local settings | `.claude/settings.json` | Project-specific settings |
| Policy settings | MDM-managed | Enterprise policies |

### setSandboxSettings

```javascript
// Settings can be updated via:
sandboxManager.setSandboxSettings({
  enabled: true,
  autoAllowBashIfSandboxed: true,
  allowUnsandboxedCommands: false
});
```

---

## 5. Policy Locking

### areSandboxSettingsLockedByPolicy

Enterprise environments can lock sandbox settings:

```javascript
// When policy locks settings:
// - User cannot disable sandbox
// - User cannot enable dangerouslyDisableSandbox bypass
// - User can only adjust within policy constraints
```

**Policy enforcement flow:**

```
User attempts to change sandbox setting
           |
           v
Is setting locked by policy?
           |
    YES    |    NO
     |     |     |
     v     |     v
REJECT     |   APPLY
change     |   change
```

---

## 6. Excluded Commands

### getExcludedCommands

Commands can be excluded from sandboxing:

```javascript
// Get list of excluded commands
const excludedCommands = sandboxManager.getExcludedCommands();
// Returns: ["mcp-cli:*", "my-trusted-tool"]
```

### addExcludedCommand

```javascript
// Add command to exclusion list
sandboxManager.addExcludedCommand("my-tool");
```

**Exclusion patterns:**
- Exact match: `"npm install"`
- Prefix match: `"npm:*"`
- Wildcard match: `"npm *"`

---

## 7. Configuration Refresh

### refreshConfig

When settings change, configuration is refreshed:

```javascript
// Settings change subscription
settingsStore.subscribe((newSettings) => {
  sandboxManager.refreshConfig();
});
```

**What happens on refresh:**
1. Re-read all settings sources
2. Apply priority hierarchy
3. Update internal configuration
4. Notify dependent systems

---

## 8. Default Values Summary

| Setting | Default | Description |
|---------|---------|-------------|
| `sandbox.enabled` | `false` | Sandbox disabled by default |
| `sandbox.autoAllowBashIfSandboxed` | `true` | Auto-approve bash when sandboxed |
| `sandbox.allowUnsandboxedCommands` | `true` | Allow bypass via dangerouslyDisableSandbox |
| `network.allowedDomains` | `[]` | No domains allowed by default |
| `network.deniedDomains` | `[]` | No domains explicitly denied |
| `filesystem.denyRead` | `[]` | No read restrictions by default |
| `filesystem.allowWrite` | `[cwd]` | Current directory is writable |
| `filesystem.denyWrite` | `[]` | No explicit write denials |
| `mandatoryDenySearchDepth` | `3` | Search 3 levels for dangerous files |

---

## 9. Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_SANDBOX_ENABLED` | Override sandbox.enabled | None |
| `CLAUDE_CODE_SANDBOX_AUTO_ALLOW` | Override autoAllowBashIfSandboxed | None |

---

## 10. Configuration Example

### Enabling Sandbox with Custom Settings

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "allowUnsandboxedCommands": false
  },
  "sandboxConfig": {
    "network": {
      "allowedDomains": ["*.github.com", "registry.npmjs.org"],
      "deniedDomains": [],
      "allowLocalBinding": true
    },
    "filesystem": {
      "denyRead": ["/etc/passwd", "~/.ssh"],
      "allowWrite": ["/tmp/claude", "./"],
      "denyWrite": [".git/hooks", ".gitconfig"]
    },
    "ignoreViolations": {
      "*": ["mDNSResponder"],
      "git fetch": ["network-outbound"]
    }
  }
}
```

### Enterprise Policy Example

```json
{
  "policySettings": {
    "sandbox": {
      "enabled": true,
      "allowUnsandboxedCommands": false
    },
    "sandboxSettingsLocked": true
  }
}
```

---

## See Also

- [overview.md](./overview.md) - System architecture
- [tool_integration.md](./tool_integration.md) - How settings affect tool execution
- [wildcard_permissions.md](./wildcard_permissions.md) - Permission pattern matching
