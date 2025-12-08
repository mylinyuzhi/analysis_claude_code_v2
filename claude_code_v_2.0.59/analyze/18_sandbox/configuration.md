# Sandbox Configuration

## Related Symbols

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `parseSettingsToSandboxConfig` (sH1) - Parse settings into sandbox config
- `isSandboxEnabledInSettings` (m64) - Check if sandbox enabled
- `isAutoAllowBashEnabled` (d64) - Check auto-allow mode
- `areUnsandboxedCommandsAllowed` (c64) - Check bypass policy
- `setSandboxSettings` (i64) - Persist sandbox settings
- `getExcludedCommands` (n64) - Get excluded commands list

---

## 1. Configuration Sources

### Settings Hierarchy

**Design Goal:** Balance user flexibility with enterprise control.

**Why this hierarchy?**
1. **CLI arguments first** - User's immediate intent should override all else
2. **Policy settings second** - Enterprise security policies cannot be bypassed
3. **Flag settings third** - Server-controlled feature toggles for gradual rollouts
4. **User settings last** - User preferences are base defaults

**Key insight:** The hierarchy ensures that:
- A user cannot accidentally weaken enterprise-mandated security
- Feature flags can be used to disable sandbox for specific users if issues arise
- Local overrides remain possible for development/testing

Settings are loaded from multiple sources with the following priority (highest to lowest):

```
┌─────────────────────────────────────────────────────────────────┐
│                     Settings Priority Chain                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CLI Arguments (--sandbox, --sandbox-mode)                   │
│     └──> Highest priority, overrides all                        │
│                                                                  │
│  2. policySettings (enterprise managed)                         │
│     └──> Cannot be overridden by user                           │
│                                                                  │
│  3. flagSettings (feature flags)                                │
│     └──> Server-controlled features                              │
│                                                                  │
│  4. localSettings (~/.claude/settings.local.json)               │
│     └──> User's local overrides                                  │
│                                                                  │
│  5. userSettings (~/.claude/settings.json)                      │
│     └──> User's global settings                                  │
│                                                                  │
│  6. projectSettings (.claude/settings.json)                     │
│     └──> Project-level settings                                  │
│                                                                  │
│  7. Default values                                              │
│     └──> Fallback when nothing specified                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Settings File Locations

| Setting Type | File Path | Purpose |
|--------------|-----------|---------|
| Local Settings | `~/.claude/settings.local.json` | User's local machine overrides |
| User Settings | `~/.claude/settings.json` | User's global preferences |
| Project Settings | `.claude/settings.json` | Project-specific config |
| Flag Settings | (server-managed) | Feature flags |
| Policy Settings | (enterprise-managed) | Enterprise policy enforcement |

---

## 2. Configuration Schema

### Sandbox Section in Settings

```typescript
interface SandboxSettings {
    // Core sandbox toggle
    enabled?: boolean;              // Default: false

    // Bash permission behavior
    autoAllowBashIfSandboxed?: boolean;  // Default: true
    allowUnsandboxedCommands?: boolean;  // Default: true

    // Excluded commands (bypass sandbox)
    excludedCommands?: string[];    // Default: []

    // Network configuration
    network?: {
        allowUnixSockets?: string[];      // Specific socket paths
        allowAllUnixSockets?: boolean;    // Disable seccomp
        allowLocalBinding?: boolean;      // Allow localhost
        httpProxyPort?: number;           // External HTTP proxy
        socksProxyPort?: number;          // External SOCKS proxy
    };

    // Violation handling
    ignoreViolations?: {
        "*"?: string[];                   // Global patterns
        [command: string]: string[];      // Per-command patterns
    };

    // Docker/nested sandbox support
    enableWeakerNestedSandbox?: boolean;

    // Custom ripgrep configuration
    ripgrep?: {
        command: string;
        args?: string[];
    };
}
```

### Permission Rules Integration

The sandbox also reads from the `permissions` section to derive file/network rules:

```typescript
interface PermissionRules {
    allow?: string[];  // Format: "ToolName:rule_content"
    deny?: string[];   // Format: "ToolName:rule_content"
}
```

**Rule Parsing:**
- `WebFetch:domain:example.com` → Add `example.com` to network allowedDomains
- `Edit:./src/**` → Add `./src/**` to filesystem allowWrite
- `Read:~/.secrets` → Add `~/.secrets` to filesystem denyRead

---

## 3. Configuration Parsing

### parseSettingsToSandboxConfig

```javascript
// ============================================
// parseSettingsToSandboxConfig - Transform settings to sandbox config
// Location: chunks.19.mjs:549-607
// ============================================

// ORIGINAL (for source lookup):
function sH1(A) {
  let Q = A.permissions || {},
    B = [],
    G = [];
  for (let F of Q.allow || []) {
    let K = LKA(F);
    if (K.toolName === $X && K.ruleContent?.startsWith("domain:")) B.push(K.ruleContent.substring(7))
  }
  for (let F of Q.deny || []) {
    let K = LKA(F);
    if (K.toolName === $X && K.ruleContent?.startsWith("domain:")) G.push(K.ruleContent.substring(7))
  }
  let Z = ["."],
    I = [],
    Y = [],
    J = iN.map((F) => Gw(F)).filter((F) => F !== void 0);
  I.push(...J);
  let W = I2A(),
    X = uQ();
  if (W !== X) I.push(rd0(W, ".claude", "settings.json")), I.push(rd0(W, ".claude", "settings.local.json"));
  for (let F of Q.allow || []) {
    let K = LKA(F);
    if (K.toolName === $5 && K.ruleContent) Z.push(K.ruleContent)
  }
  for (let F of Q.deny || []) {
    let K = LKA(F);
    if (K.toolName === $5 && K.ruleContent) I.push(K.ruleContent);
    if (K.toolName === d5 && K.ruleContent) Y.push(K.ruleContent)
  }
  let V = A.sandbox?.ripgrep ? A.sandbox.ripgrep : (() => {
    let { rgPath: F, rgArgs: K } = Y9A();
    return { command: F, args: K }
  })();
  return {
    network: {
      allowedDomains: B,
      deniedDomains: G,
      allowUnixSockets: A.sandbox?.network?.allowUnixSockets,
      allowAllUnixSockets: A.sandbox?.network?.allowAllUnixSockets,
      allowLocalBinding: A.sandbox?.network?.allowLocalBinding,
      httpProxyPort: A.sandbox?.network?.httpProxyPort,
      socksProxyPort: A.sandbox?.network?.socksProxyPort
    },
    filesystem: {
      denyRead: Y,
      allowWrite: Z,
      denyWrite: I
    },
    ignoreViolations: A.sandbox?.ignoreViolations,
    enableWeakerNestedSandbox: A.sandbox?.enableWeakerNestedSandbox,
    ripgrep: V
  }
}

// READABLE (for understanding):
function parseSettingsToSandboxConfig(settings) {
  let permissions = settings.permissions || {};

  // ─── NETWORK CONFIGURATION ───
  let allowedDomains = [];
  let deniedDomains = [];

  // Extract network rules from permission allow list
  for (let rule of permissions.allow || []) {
    let parsed = parseRuleString(rule);  // LKA
    // WebFetch:domain:example.com → allowedDomains.push("example.com")
    if (parsed.toolName === WEBFETCH_TOOL_NAME && parsed.ruleContent?.startsWith("domain:")) {
      allowedDomains.push(parsed.ruleContent.substring(7));
    }
  }

  // Extract network rules from permission deny list
  for (let rule of permissions.deny || []) {
    let parsed = parseRuleString(rule);
    if (parsed.toolName === WEBFETCH_TOOL_NAME && parsed.ruleContent?.startsWith("domain:")) {
      deniedDomains.push(parsed.ruleContent.substring(7));
    }
  }

  // ─── FILESYSTEM CONFIGURATION ───
  let allowWrite = ["."];  // Current directory always writable
  let denyWrite = [];
  let denyRead = [];

  // Add settings file locations to deny list (protect settings)
  let settingsFilePaths = FILE_BASED_SOURCES.map(source => getFilePath(source))
    .filter(path => path !== undefined);
  denyWrite.push(...settingsFilePaths);

  // Protect remote settings if working in different directory
  let homeDir = getHomeDirectory();  // I2A
  let cwd = getCurrentWorkDir();     // uQ
  if (homeDir !== cwd) {
    denyWrite.push(joinPath(homeDir, ".claude", "settings.json"));
    denyWrite.push(joinPath(homeDir, ".claude", "settings.local.json"));
  }

  // Extract file rules from permission lists
  for (let rule of permissions.allow || []) {
    let parsed = parseRuleString(rule);
    // Edit:./src/** → allowWrite.push("./src/**")
    if (parsed.toolName === EDIT_TOOL_NAME && parsed.ruleContent) {
      allowWrite.push(parsed.ruleContent);
    }
  }

  for (let rule of permissions.deny || []) {
    let parsed = parseRuleString(rule);
    // Edit:~/.secrets → denyWrite.push("~/.secrets")
    if (parsed.toolName === EDIT_TOOL_NAME && parsed.ruleContent) {
      denyWrite.push(parsed.ruleContent);
    }
    // Read:~/.secrets → denyRead.push("~/.secrets")
    if (parsed.toolName === READ_TOOL_NAME && parsed.ruleContent) {
      denyRead.push(parsed.ruleContent);
    }
  }

  // ─── RIPGREP CONFIGURATION ───
  let ripgrepConfig = settings.sandbox?.ripgrep
    ? settings.sandbox.ripgrep
    : (() => {
        let { rgPath, rgArgs } = getRipgrepPath();  // Y9A
        return { command: rgPath, args: rgArgs };
      })();

  // ─── BUILD FINAL CONFIG ───
  return {
    network: {
      allowedDomains: allowedDomains,
      deniedDomains: deniedDomains,
      allowUnixSockets: settings.sandbox?.network?.allowUnixSockets,
      allowAllUnixSockets: settings.sandbox?.network?.allowAllUnixSockets,
      allowLocalBinding: settings.sandbox?.network?.allowLocalBinding,
      httpProxyPort: settings.sandbox?.network?.httpProxyPort,
      socksProxyPort: settings.sandbox?.network?.socksProxyPort
    },
    filesystem: {
      denyRead: denyRead,
      allowWrite: allowWrite,
      denyWrite: denyWrite
    },
    ignoreViolations: settings.sandbox?.ignoreViolations,
    enableWeakerNestedSandbox: settings.sandbox?.enableWeakerNestedSandbox,
    ripgrep: ripgrepConfig
  };
}

// Mapping: sH1→parseSettingsToSandboxConfig, A→settings, Q→permissions, B→allowedDomains,
//          G→deniedDomains, Z→allowWrite, I→denyWrite, Y→denyRead, LKA→parseRuleString
```

---

## 4. Settings Getter Functions

### isSandboxEnabledInSettings

```javascript
// ============================================
// isSandboxEnabledInSettings - Check if sandbox is enabled
// Location: chunks.19.mjs:609-616
// ============================================

// ORIGINAL (for source lookup):
function m64() {
  try {
    let A = l0();
    return od0(A)
  } catch (A) {
    return g(`Failed to get settings for sandbox check: ${A}`), !1
  }
}

// READABLE (for understanding):
function isSandboxEnabledInSettings() {
  try {
    let settings = getMergedSettings();  // l0
    return checkSandboxEnabled(settings);  // od0 - returns settings?.sandbox?.enabled ?? false
  } catch (error) {
    log(`Failed to get settings for sandbox check: ${error}`);
    return false;  // Default to disabled on error
  }
}

// Mapping: m64→isSandboxEnabledInSettings, l0→getMergedSettings, od0→checkSandboxEnabled
```

### isAutoAllowBashEnabled

```javascript
// ============================================
// isAutoAllowBashEnabled - Check if auto-allow bash is enabled
// Location: chunks.19.mjs:618-621
// ============================================

// ORIGINAL (for source lookup):
function d64() {
  let A = l0();
  return td0(A)
}

// READABLE (for understanding):
function isAutoAllowBashEnabled() {
  let settings = getMergedSettings();
  return checkAutoAllowBash(settings);  // td0 - returns settings?.sandbox?.autoAllowBashIfSandboxed ?? true
}

// Mapping: d64→isAutoAllowBashEnabled, td0→checkAutoAllowBash
```

### areUnsandboxedCommandsAllowed

```javascript
// ============================================
// areUnsandboxedCommandsAllowed - Check if bypass is allowed
// Location: chunks.19.mjs:623-626
// ============================================

// ORIGINAL (for source lookup):
function c64() {
  let A = l0();
  return ed0(A)
}

// READABLE (for understanding):
function areUnsandboxedCommandsAllowed() {
  let settings = getMergedSettings();
  return checkUnsandboxedAllowed(settings);  // ed0 - returns settings?.sandbox?.allowUnsandboxedCommands ?? true
}

// Mapping: c64→areUnsandboxedCommandsAllowed, ed0→checkUnsandboxedAllowed
```

---

## 5. Configuration Persistence

### setSandboxSettings

```javascript
// ============================================
// setSandboxSettings - Persist sandbox settings to localSettings
// Location: chunks.19.mjs:666-682
// ============================================

// ORIGINAL (for source lookup):
async function i64(A) {
  let Q = OB("localSettings");
  cB("localSettings", {
    sandbox: {
      ...Q?.sandbox,
      ...A.enabled !== void 0 && {
        enabled: A.enabled
      },
      ...A.autoAllowBashIfSandboxed !== void 0 && {
        autoAllowBashIfSandboxed: A.autoAllowBashIfSandboxed
      },
      ...A.allowUnsandboxedCommands !== void 0 && {
        allowUnsandboxedCommands: A.allowUnsandboxedCommands
      }
    }
  })
}

// READABLE (for understanding):
async function setSandboxSettings(newSettings) {
  // Read current local settings
  let currentSettings = readSettingsFile("localSettings");  // OB

  // Deep merge sandbox section with new values
  writeSettingsFile("localSettings", {  // cB
    sandbox: {
      ...currentSettings?.sandbox,  // Preserve existing values
      // Only include properties that are explicitly set
      ...(newSettings.enabled !== undefined && {
        enabled: newSettings.enabled
      }),
      ...(newSettings.autoAllowBashIfSandboxed !== undefined && {
        autoAllowBashIfSandboxed: newSettings.autoAllowBashIfSandboxed
      }),
      ...(newSettings.allowUnsandboxedCommands !== undefined && {
        allowUnsandboxedCommands: newSettings.allowUnsandboxedCommands
      })
    }
  });
}

// Mapping: i64→setSandboxSettings, A→newSettings, Q→currentSettings, OB→readSettingsFile, cB→writeSettingsFile
```

---

## 6. Policy Locking

### areSandboxSettingsLocked

Enterprise policies can lock sandbox settings to prevent user override:

```javascript
// ============================================
// areSandboxSettingsLocked - Check if sandbox settings are policy-locked
// Location: chunks.19.mjs:657-664
// ============================================

// ORIGINAL (for source lookup):
function l64() {
  let A = ["flagSettings", "policySettings"];
  for (let Q of A) {
    let B = OB(Q);
    if (B?.sandbox?.enabled !== void 0 || B?.sandbox?.autoAllowBashIfSandboxed !== void 0 || B?.sandbox?.allowUnsandboxedCommands !== void 0) return !0
  }
  return !1
}

// READABLE (for understanding):
function areSandboxSettingsLocked() {
  // Check both flag and policy settings sources
  let policySources = ["flagSettings", "policySettings"];

  for (let source of policySources) {
    let settings = readSettingsFile(source);

    // If any sandbox setting is defined in policy, it's locked
    if (settings?.sandbox?.enabled !== undefined ||
        settings?.sandbox?.autoAllowBashIfSandboxed !== undefined ||
        settings?.sandbox?.allowUnsandboxedCommands !== undefined) {
      return true;  // Settings are locked by policy
    }
  }

  return false;  // User can modify settings
}

// Mapping: l64→areSandboxSettingsLocked, A→policySources, OB→readSettingsFile
```

---

## 7. Excluded Commands

### getExcludedCommands

```javascript
// ============================================
// getExcludedCommands - Get list of commands that bypass sandbox
// Location: chunks.19.mjs:684-686
// ============================================

// ORIGINAL (for source lookup):
function n64() {
  return l0()?.sandbox?.excludedCommands ?? []
}

// READABLE (for understanding):
function getExcludedCommands() {
  return getMergedSettings()?.sandbox?.excludedCommands ?? [];
}

// Mapping: n64→getExcludedCommands
```

### Adding Excluded Commands

```javascript
// ============================================
// addExcludedCommand - Add command to excluded list
// Location: chunks.19.mjs:724-739
// ============================================

// ORIGINAL (for source lookup):
function Ac0(A, Q) {
  let B = OB("localSettings"),
    G = B?.sandbox?.excludedCommands || [],
    Z = A;
  if (Q) {
    let I = Q.filter((Y) => Y.type === "addRules" && Y.rules.some((J) => J.toolName === C9));
    if (I.length > 0 && I[0].type === "addRules") {
      let Y = I[0].rules.find((J) => J.toolName === C9);
      if (Y?.ruleContent) Z = u64(Y.ruleContent) || Y.ruleContent
    }
  }
  if (!G.includes(Z)) cB("localSettings", {
    sandbox: {
      ...B?.sandbox,
      excludedCommands: [...G, Z]
    }
  })
}

// READABLE (for understanding):
function addExcludedCommand(command, permissionUpdates) {
  let currentSettings = readSettingsFile("localSettings");
  let excludedCommands = currentSettings?.sandbox?.excludedCommands || [];
  let commandToExclude = command;

  // If permission updates provided, extract command pattern from rules
  if (permissionUpdates) {
    let addRuleUpdates = permissionUpdates.filter(update =>
      update.type === "addRules" && update.rules.some(rule => rule.toolName === BASH_TOOL_NAME)
    );

    if (addRuleUpdates.length > 0 && addRuleUpdates[0].type === "addRules") {
      let bashRule = addRuleUpdates[0].rules.find(rule => rule.toolName === BASH_TOOL_NAME);
      if (bashRule?.ruleContent) {
        // Extract prefix pattern from rule (e.g., "npm:*" → "npm")
        commandToExclude = extractPrefixPattern(bashRule.ruleContent) || bashRule.ruleContent;
      }
    }
  }

  // Add to excluded list if not already present
  if (!excludedCommands.includes(commandToExclude)) {
    writeSettingsFile("localSettings", {
      sandbox: {
        ...currentSettings?.sandbox,
        excludedCommands: [...excludedCommands, commandToExclude]
      }
    });
  }
}

// Mapping: Ac0→addExcludedCommand, A→command, Q→permissionUpdates, u64→extractPrefixPattern
```

---

## 8. Configuration Refresh

### refreshSandboxConfig

```javascript
// ============================================
// refreshSandboxConfig - Reload config from settings
// Location: chunks.19.mjs:713-718
// ============================================

// ORIGINAL (for source lookup):
function r64() {
  if (!ixA()) return;
  let A = l0(),
    Q = sH1(A);
  xI.updateConfig(Q)
}

// READABLE (for understanding):
function refreshSandboxConfig() {
  // Only refresh if sandbox is enabled
  if (!isSandboxingEnabled()) return;

  // Re-parse settings to sandbox config
  let settings = getMergedSettings();
  let newConfig = parseSettingsToSandboxConfig(settings);

  // Update sandbox engine with new config
  sandboxEngine.updateConfig(newConfig);
}

// Mapping: r64→refreshSandboxConfig, ixA→isSandboxingEnabled, sH1→parseSettingsToSandboxConfig, xI→sandboxEngine
```

### Settings Change Subscription

The sandbox automatically refreshes when settings change:

```javascript
// ============================================
// initializeSandboxFromSettings - Init with settings subscription
// Location: chunks.19.mjs:695-711
// ============================================

// ORIGINAL (for source lookup):
async function s64(A) {
  if (hm) return hm;
  if (!ixA()) return;
  let Q = l0(),
    B = sH1(Q);
  return hm = (async () => {
    try {
      await xI.initialize(B, A), rH1 = fm.subscribe(() => {
        let G = l0(),
          Z = sH1(G);
        xI.updateConfig(Z), g("Sandbox configuration updated from settings change")
      })
    } catch (G) {
      hm = void 0, g(`Failed to initialize sandbox: ${G instanceof Error?G.message:String(G)}`)
    }
  })(), hm
}

// READABLE (for understanding):
async function initializeSandboxFromSettings(permissionCallback) {
  // Return existing promise if already initializing
  if (initializationPromise) return initializationPromise;

  // Skip if sandbox not enabled
  if (!isSandboxingEnabled()) return;

  // Parse current settings
  let settings = getMergedSettings();
  let sandboxConfig = parseSettingsToSandboxConfig(settings);

  // Create initialization promise
  initializationPromise = (async () => {
    try {
      // Initialize sandbox engine
      await sandboxEngine.initialize(sandboxConfig, permissionCallback);

      // Subscribe to settings changes for auto-refresh
      settingsSubscription = fileWatcher.subscribe(() => {
        let newSettings = getMergedSettings();
        let newConfig = parseSettingsToSandboxConfig(newSettings);
        sandboxEngine.updateConfig(newConfig);
        log("Sandbox configuration updated from settings change");
      });

    } catch (error) {
      initializationPromise = undefined;
      log(`Failed to initialize sandbox: ${error instanceof Error ? error.message : String(error)}`);
    }
  })();

  return initializationPromise;
}

// Mapping: s64→initializeSandboxFromSettings, hm→initializationPromise, rH1→settingsSubscription, fm→fileWatcher
```

---

## 9. Default Values Summary

| Setting | Default | Description |
|---------|---------|-------------|
| `sandbox.enabled` | `false` | Sandbox disabled by default |
| `sandbox.autoAllowBashIfSandboxed` | `true` | Auto-allow bash in accept-edits mode |
| `sandbox.allowUnsandboxedCommands` | `true` | Allow dangerouslyDisableSandbox |
| `sandbox.excludedCommands` | `[]` | No excluded commands |
| `sandbox.mandatoryDenySearchDepth` | `3` | Search depth for dangerous files |
| `network.allowAllUnixSockets` | `false` | Block Unix sockets by default |
| `network.allowLocalBinding` | `false` | Block localhost binding by default |

---

## See Also

- [overview.md](./overview.md) - System architecture
- [permissions.md](./permissions.md) - Permission decision flow
- [macos_implementation.md](./macos_implementation.md) - macOS implementation
- [linux_implementation.md](./linux_implementation.md) - Linux implementation
