# Sandbox Settings Schema (Claude Code 2.1.76)

## Overview

This document provides a comprehensive reference for all sandbox configuration options in Claude Code. The sandbox settings are stored in the `sandbox` object within the settings configuration.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Sandbox section

Key symbols in this document:
- `F57` - Sandbox settings Zod schema (chunks.40.mjs:1292)
- `Nw3` - Network restrictions schema (chunks.40.mjs:1280)
- `Vw3` - Filesystem restrictions schema (chunks.40.mjs:1288)
- `OG7` - Network config internal schema (chunks.56.mjs:21)
- `$G7` - Filesystem config internal schema (chunks.56.mjs:30)
- `Mx3` - setSandboxSettings function (chunks.56.mjs:395)
- `TG7` - isSandboxEnabledInSettings (chunks.56.mjs:329)
- `h21` - isSandboxingEnabled (chunks.56.mjs:357)

---

## Top-Level Sandbox Schema

```javascript
// ============================================
// SandboxSettingsSchema - Zod schema for sandbox configuration
// Location: chunks.40.mjs:1292-1306
// ============================================

// ORIGINAL (for source lookup):
F57 = F6(() => C.object({
    enabled: C.boolean().optional(),
    autoAllowBashIfSandboxed: C.boolean().optional(),
    allowUnsandboxedCommands: C.boolean().optional().describe("..."),
    network: Nw3(),
    filesystem: Vw3(),
    ignoreViolations: C.record(C.string(), C.array(C.string())).optional(),
    enableWeakerNestedSandbox: C.boolean().optional(),
    enableWeakerNetworkIsolation: C.boolean().optional().describe("..."),
    excludedCommands: C.array(C.string()).optional(),
    ripgrep: C.object({
        command: C.string(),
        args: C.array(C.string()).optional()
    }).optional().describe("...")
}).passthrough())

// READABLE (for understanding):
SandboxSettingsSchema = z.object({
    // Master switch
    enabled: z.boolean().optional(),                           // Default: false

    // Permission behavior
    autoAllowBashIfSandboxed: z.boolean().optional(),          // Default: true
    allowUnsandboxedCommands: z.boolean().optional(),          // Default: true

    // Restrictions
    network: NetworkRestrictionsSchema.optional(),
    filesystem: FilesystemRestrictionsSchema.optional(),

    // Violation handling
    ignoreViolations: z.record(z.string(), z.array(z.string())).optional(),

    // Advanced options
    enableWeakerNestedSandbox: z.boolean().optional(),         // Default: false
    enableWeakerNetworkIsolation: z.boolean().optional(),      // Default: false
    excludedCommands: z.array(z.string()).optional(),          // Default: []

    // Tool configuration
    ripgrep: z.object({
        command: z.string(),
        args: z.array(z.string()).optional()
    }).optional()
}).passthrough()

// Mapping: F57→SandboxSettingsSchema, C→z, Nw3→NetworkRestrictionsSchema, Vw3→FilesystemRestrictionsSchema
```

---

## Configuration Options Reference

### Core Settings

#### `enabled`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Description | Master switch for sandbox functionality |

**Behavior:**
- `true` - Commands run in sandbox by default
- `false` - No sandbox protection applied

**Example:**
```json
{
  "sandbox": {
    "enabled": true
  }
}
```

---

#### `autoAllowBashIfSandboxed`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `true` |
| Description | Auto-approve bash commands when sandboxed |

**Behavior:**
- `true` - Bash commands are auto-approved (no permission prompt) when sandbox is active
- `false` - Bash commands require explicit permission even when sandboxed

**Why this exists:**
When sandbox is enabled, commands are already isolated from sensitive system resources. Auto-approving reduces friction while maintaining security through the sandbox boundary.

**Example:**
```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  }
}
```

---

#### `allowUnsandboxedCommands`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `true` |
| Description | Allow `dangerouslyDisableSandbox` parameter to work |

**Behavior:**
- `true` - Model can request sandbox bypass via `dangerouslyDisableSandbox: true`
- `false` - `dangerouslyDisableSandbox` parameter is ignored, all commands must run sandboxed

**Security consideration:**
Setting to `false` provides a "closed policy" where commands can ONLY run in sandbox. This is useful for:
- Enterprise environments with strict security requirements
- Untrusted code execution scenarios
- Enforcing sandbox usage regardless of model decisions

**Example:**
```json
{
  "sandbox": {
    "enabled": true,
    "allowUnsandboxedCommands": false
  }
}
```

---

### Network Restrictions

#### `network` Schema

```javascript
// ============================================
// NetworkRestrictionsSchema - Network filtering configuration
// Location: chunks.56.mjs:21-29
// ============================================

// ORIGINAL (for source lookup):
OG7 = K4.object({
    allowedDomains: K4.array(mw8).describe('...'),
    deniedDomains: K4.array(mw8).describe("..."),
    allowUnixSockets: K4.array(K4.string()).optional().describe("..."),
    allowAllUnixSockets: K4.boolean().optional().describe("..."),
    allowLocalBinding: K4.boolean().optional().describe("..."),
    httpProxyPort: K4.number().int().min(1).max(65535).optional().describe("..."),
    socksProxyPort: K4.number().int().min(1).max(65535).optional().describe("..."),
    mitmProxy: qx3.optional().describe("...")
})

// READABLE (for understanding):
NetworkRestrictionsSchema = z.object({
    // Domain filtering
    allowedDomains: z.array(DomainPatternSchema).describe('List of allowed domains'),
    deniedDomains: z.array(DomainPatternSchema).describe('List of denied domains'),

    // Unix socket control
    allowUnixSockets: z.array(z.string()).optional().describe('macOS: Unix socket paths to allow'),
    allowAllUnixSockets: z.boolean().optional().describe('Allow all Unix sockets (disables blocking)'),

    // Local network
    allowLocalBinding: z.boolean().optional().describe('Allow binding to local ports'),

    // Proxy configuration
    httpProxyPort: z.number().int().min(1).max(65535).optional().describe('External HTTP proxy port'),
    socksProxyPort: z.number().int().min(1).max(65535).optional().describe('External SOCKS proxy port'),

    // MITM proxy
    mitmProxy: MitmProxySchema.optional().describe('MITM proxy configuration')
})

// Mapping: OG7→NetworkRestrictionsSchema, K4→z, mw8→DomainPatternSchema, qx3→MitmProxySchema
```

---

#### `network.allowedDomains`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[]` (empty - all domains blocked) |
| Description | Domains that are allowed for network access |

**Domain pattern format:**
- Exact domain: `"github.com"`
- Wildcard subdomain: `"*.example.com"`

**Validation rules:**
- Must be a valid domain or wildcard pattern
- Wildcards must have at least two parts: `"*.example.com"` (not `"*.com"`)
- Cannot contain `://`, `/`, or `:` characters

**Example:**
```json
{
  "sandbox": {
    "network": {
      "allowedDomains": [
        "api.anthropic.com",
        "github.com",
        "*.npmjs.org"
      ]
    }
  }
}
```

---

#### `network.deniedDomains`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[]` |
| Description | Domains that are explicitly blocked |

**Behavior:**
- Takes precedence over `allowedDomains`
- Useful for blocking specific sensitive domains

**Example:**
```json
{
  "sandbox": {
    "network": {
      "allowedDomains": ["*"],
      "deniedDomains": ["internal.company.com", "admin.local"]
    }
  }
}
```

---

#### `network.allowUnixSockets`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[]` (all Unix sockets blocked) |
| Platform | macOS only |
| Description | Unix socket paths that are allowed |

**Why Unix socket blocking:**
- Unix sockets can bypass network filtering
- Docker daemon socket (`/var/run/docker.sock`) provides container access
- SSH agent socket (`~/.ssh/agent.sock`) provides key access

**Example:**
```json
{
  "sandbox": {
    "network": {
      "allowUnixSockets": [
        "/var/run/my-service.sock"
      ]
    }
  }
}
```

---

#### `network.allowAllUnixSockets`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Description | Disable Unix socket blocking entirely |

**Warning:**
Setting to `true` allows all Unix socket connections, bypassing a significant security boundary.

---

#### `network.allowLocalBinding`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Description | Allow binding to local ports |

**Use case:**
Required when running local development servers that need to bind to ports.

---

#### `network.httpProxyPort`

| Property | Value |
|----------|-------|
| Type | `number` (1-65535) |
| Default | Auto-generated |
| Description | External HTTP proxy port |

**Behavior:**
- When set, uses external proxy instead of starting a local one
- External proxy must handle domain filtering

---

#### `network.socksProxyPort`

| Property | Value |
|----------|-------|
| Type | `number` (1-65535) |
| Default | Auto-generated |
| Description | External SOCKS proxy port |

---

#### `network.mitmProxy`

| Property | Value |
|----------|-------|
| Type | `object` |
| Default | `undefined` |
| Description | MITM proxy configuration for HTTPS inspection |

**Schema:**
```javascript
MitmProxySchema = z.object({
    socketPath: z.string().min(1).describe('Unix socket path to the MITM proxy'),
    domains: z.array(DomainPatternSchema).min(1).describe('Domains to route through MITM')
})
```

**Use case:**
Required when:
- Using a corporate MITM proxy with custom CA
- Go-based tools (gh, gcloud, terraform) need TLS verification
- Inspecting HTTPS traffic for debugging

**Example:**
```json
{
  "sandbox": {
    "network": {
      "httpProxyPort": 8080,
      "mitmProxy": {
        "socketPath": "/var/run/mitm.sock",
        "domains": ["api.company.internal", "*.corp.local"]
      }
    },
    "enableWeakerNetworkIsolation": true
  }
}
```

---

### Filesystem Restrictions

#### `filesystem` Schema

```javascript
// ============================================
// FilesystemRestrictionsSchema - File access control
// Location: chunks.56.mjs:30-35
// ============================================

// ORIGINAL (for source lookup):
$G7 = K4.object({
    denyRead: K4.array(uw8).describe("..."),
    allowWrite: K4.array(uw8).describe("..."),
    denyWrite: K4.array(uw8).describe("..."),
    allowGitConfig: K4.boolean().optional().describe("...")
})

// READABLE (for understanding):
FilesystemRestrictionsSchema = z.object({
    denyRead: z.array(PathSchema).describe('Paths denied for reading'),
    allowWrite: z.array(PathSchema).describe('Paths allowed for writing'),
    denyWrite: z.array(PathSchema).describe('Paths denied for writing'),
    allowGitConfig: z.boolean().optional().describe('Allow .git/config writes')
})

// Mapping: $G7→FilesystemRestrictionsSchema, uw8→PathSchema
```

---

#### `filesystem.denyRead`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[]` |
| Description | Paths that are denied for reading |

**Common sensitive paths:**
```json
{
  "filesystem": {
    "denyRead": [
      "~/.ssh",
      "~/.gnupg",
      "~/.aws/credentials",
      "~/.config/gcloud"
    ]
  }
}
```

---

#### `filesystem.allowWrite`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[cwd]` (project directory) |
| Description | Paths that are allowed for writing |

**Behavior:**
- If empty, all writes may be denied
- Project directory is implicitly allowed

**Example:**
```json
{
  "filesystem": {
    "allowWrite": [
      "/home/user/project",
      "/tmp/claude"
    ]
  }
}
```

---

#### `filesystem.denyWrite`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[]` |
| Description | Paths that are denied for writing (takes precedence over allowWrite) |

**Common protected paths:**
```json
{
  "filesystem": {
    "denyWrite": [
      "~/.bashrc",
      "~/.zshrc",
      "~/.profile",
      "~/.ssh"
    ]
  }
}
```

---

#### `filesystem.allowGitConfig`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Description | Allow writes to `.git/config` files |

**Why this is separate:**
- `.git/config` is often modified during normal git operations
- But `.git/hooks` could be used for persistence
- This option allows config writes while keeping hooks protected

---

### Violation Handling

#### `ignoreViolations`

| Property | Value |
|----------|-------|
| Type | `Record<string, string[]>` |
| Default | `{}` |
| Description | Per-command violation types to ignore |

**Format:**
```json
{
  "ignoreViolations": {
    "<command_pattern>": ["<violation_type>", ...],
    "*": ["<violation_type>", ...]  // Applies to all commands
  }
}
```

**Violation types:**
- `file-read-data` - File read operations
- `file-write-data` - File write operations
- `network-outbound` - Network connections
- `process-exec` - Process execution

**Example:**
```json
{
  "ignoreViolations": {
    "npm": ["file-read-data", "file-write-data"],
    "git": ["network-outbound"],
    "docker": ["network-outbound", "process-exec"]
  }
}
```

**Why this exists:**
Some legitimate tools trigger many violations that are expected behavior. Ignoring these prevents noise in logs while maintaining the security boundary.

---

### Advanced Options

#### `enableWeakerNestedSandbox`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Description | Enable weaker sandbox for Docker/nested environments |

**When to use:**
- Running Claude Code inside a Docker container
- Running in a nested sandbox environment
- Standard sandbox profile conflicts with container runtime

**Security consideration:**
Enabling this reduces isolation strength. Only use when standard sandbox doesn't work.

---

#### `enableWeakerNetworkIsolation`

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Platform | macOS only |
| Description | Allow `com.apple.trustd.agent` access for TLS verification |

**When to use:**
- Using MITM proxy with custom CA
- Go-based tools (gh, gcloud, terraform, kubectl) need TLS verification
- Corporate proxy inspection

**Security warning:**
> **Reduces security** — opens a potential data exfiltration vector through the trustd service. Only enable if you need Go TLS verification.

---

#### `excludedCommands`

| Property | Value |
|----------|-------|
| Type | `string[]` |
| Default | `[]` |
| Description | Command patterns that skip sandbox entirely |

**Pattern types:**
| Pattern | Example | Matches |
|---------|---------|---------|
| Prefix | `npm:*` | `npm install`, `npm run build` |
| Exact | `git` | Exactly `git` |
| Wildcard | `docker compose *` | `docker compose up` |

**Example:**
```json
{
  "excludedCommands": [
    "npm:*",
    "yarn:*",
    "pnpm:*",
    "git",
    "docker compose *"
  ]
}
```

**Why exclude commands:**
- Some tools don't work correctly in sandbox
- Developer experience optimization for trusted tools
- Performance-critical operations

---

#### `ripgrep`

| Property | Value |
|----------|-------|
| Type | `object` |
| Default | `{ "command": "rg" }` |
| Description | Custom ripgrep configuration |

**Schema:**
```javascript
{
  command: z.string().describe("The ripgrep command to execute"),
  args: z.array(z.string()).optional().describe("Additional arguments"),
  argv0: z.string().optional().describe("Override argv[0] for multicall binaries")
}
```

---

#### `seccomp` (Linux only)

| Property | Value |
|----------|-------|
| Type | `object` |
| Default | Built-in paths |
| Platform | Linux only |
| Description | Custom seccomp binary paths |

**Schema:**
```javascript
{
  bpfPath: z.string().optional().describe("Path to unix-block.bpf filter"),
  applyPath: z.string().optional().describe("Path to apply-seccomp binary")
}
```

---

#### `allowPty` (macOS only)

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Default | `false` |
| Platform | macOS only |
| Description | Allow pseudo-terminal (pty) operations |

---

#### `mandatoryDenySearchDepth` (Linux only)

| Property | Value |
|----------|-------|
| Type | `number` (1-10) |
| Default | `3` |
| Platform | Linux only |
| Description | Directory depth to search for dangerous files |

**Behavior:**
- Higher values = more protection but slower
- Searches for files that would trigger mandatory deny rules

---

## Default Values Summary

| Setting | Default Value |
|---------|--------------|
| `enabled` | `false` |
| `autoAllowBashIfSandboxed` | `true` |
| `allowUnsandboxedCommands` | `true` |
| `network.allowedDomains` | `[]` (all blocked) |
| `network.deniedDomains` | `[]` |
| `network.allowUnixSockets` | `[]` (all blocked) |
| `network.allowAllUnixSockets` | `false` |
| `network.allowLocalBinding` | `false` |
| `filesystem.denyRead` | `[]` |
| `filesystem.allowWrite` | `[cwd]` |
| `filesystem.denyWrite` | `[]` |
| `filesystem.allowGitConfig` | `false` |
| `ignoreViolations` | `{}` |
| `enableWeakerNestedSandbox` | `false` |
| `enableWeakerNetworkIsolation` | `false` |
| `excludedCommands` | `[]` |
| `ripgrep` | `{ "command": "rg" }` |
| `mandatoryDenySearchDepth` | `3` |
| `allowPty` | `false` |

---

## Example Configurations

### Development Environment

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "allowUnsandboxedCommands": true,
    "network": {
      "allowedDomains": [
        "github.com",
        "*.npmjs.org",
        "registry.yarnpkg.com"
      ],
      "allowLocalBinding": true
    },
    "excludedCommands": [
      "npm:*",
      "yarn:*",
      "pnpm:*"
    ]
  }
}
```

### Enterprise Security

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": false,
    "allowUnsandboxedCommands": false,
    "network": {
      "allowedDomains": [
        "api.company.internal",
        "github.enterprise.com"
      ],
      "deniedDomains": [
        "*.public-storage.com"
      ]
    },
    "filesystem": {
      "denyRead": [
        "~/.ssh",
        "~/.aws",
        "~/.gnupg"
      ],
      "denyWrite": [
        "~/.bashrc",
        "~/.zshrc",
        "~/.profile"
      ]
    }
  }
}
```

### Corporate Proxy with MITM

```json
{
  "sandbox": {
    "enabled": true,
    "network": {
      "httpProxyPort": 8080,
      "socksProxyPort": 1080,
      "mitmProxy": {
        "socketPath": "/var/run/corporate-proxy.sock",
        "domains": ["*.company.internal", "api.trusted-partner.com"]
      }
    },
    "enableWeakerNetworkIsolation": true
  }
}
```

---

## Settings Functions API

### `setSandboxSettings` (Mx3)

```javascript
// ============================================
// setSandboxSettings - Updates sandbox settings in local config
// Location: chunks.56.mjs:395-411
// ============================================

// ORIGINAL (for source lookup):
async function Mx3(A) {
    let q = L8("localSettings");
    TA("localSettings", {
        sandbox: {
            ...q?.sandbox,
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
async function setSandboxSettings(updates) {
    let currentSettings = getLocalSettings("localSettings");
    saveLocalSettings("localSettings", {
        sandbox: {
            ...currentSettings?.sandbox,
            // Only update fields that are provided
            ...(updates.enabled !== undefined) && { enabled: updates.enabled },
            ...(updates.autoAllowBashIfSandboxed !== undefined) && {
                autoAllowBashIfSandboxed: updates.autoAllowBashIfSandboxed
            },
            ...(updates.allowUnsandboxedCommands !== undefined) && {
                allowUnsandboxedCommands: updates.allowUnsandboxedCommands
            }
        }
    });
}

// Mapping: Mx3→setSandboxSettings, L8→getLocalSettings, TA→saveLocalSettings
```

**Note:** Only `enabled`, `autoAllowBashIfSandboxed`, and `allowUnsandboxedCommands` can be updated via this function. Other settings require direct config file modification.

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture
- [cross_module_integration.md](./cross_module_integration.md) - Module integration
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux implementation
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS implementation
- [symbol_validation.md](./symbol_validation.md) - Symbol mappings