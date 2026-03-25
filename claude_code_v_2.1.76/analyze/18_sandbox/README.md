# Sandbox Module - Complete Documentation

> **Module**: Sandbox (Command Execution Isolation)
> **Version**: Claude Code 2.1.76
> **Source Files**:
> - `chunks.55.mjs` - Core sandbox infrastructure (platform abstraction, network proxies, seccomp filters)
> - `chunks.56.mjs` - High-level sandbox API (`vA` - sandboxConfigObject)
> - `chunks.172.mjs` - Command exclusion system, permission checks
> - `chunks.165.mjs` - UI components (settings panels, slash command)
> - `chunks.171.mjs` - System prompt integration

---

## Overview

The sandbox system is a critical security boundary that restricts what commands executed by Claude can do to the host system. It operates at the OS level using platform-native isolation mechanisms to enforce filesystem, network, and process restrictions on every bash command the model invokes.

**Key Capabilities:**
- **Filesystem Isolation**: Read/write access control with allow/deny lists
- **Network Isolation**: Domain filtering via HTTP/SOCKS proxies
- **Process Isolation**: Namespace isolation (Linux) or seatbelt profiles (macOS)
- **Unix Socket Blocking**: Seccomp BPF filters prevent local IPC bypass
- **Violation Monitoring**: Real-time detection and reporting of sandbox violations (macOS)

---

## Symbol Validation Status (v2.1.76)

All core symbols have been cross-validated against source code:

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | ✅ Validated |
| `QZ7` | wrapWithMacOSSandbox | chunks.55.mjs:2803 | ✅ Validated |
| `xb3` | generateSeatbeltProfile | chunks.55.mjs:2755 | ✅ Validated |
| `uZ7` | wrapWithLinuxSandbox | chunks.55.mjs:2564 | ✅ Validated |
| `HD6` | SandboxViolationStore | chunks.55.mjs:2902 | ✅ Validated |
| `yYz` | isCommandInExcludedList | chunks.172.mjs:2412 | ✅ Validated |
| `Ti` | isCommandSandboxed | chunks.172.mjs:2454 | ✅ Validated |
| `E9z` | getSandboxSystemPromptBlock | chunks.171.mjs:1892 | ✅ Validated |

> **⚠️ Important Symbol Corrections (v2.1.76):**
> - `b8` is NOT sandboxConfigObject - use `vA` instead
> - `Ye8` is NOT wrapWithMacOSSandbox - use `QZ7` instead
> - `FP5` is NOT buildSeatbeltProfile - use `xb3` instead
> - `nBY` is NOT getSandboxSystemPromptBlock - use `E9z` instead
> - `Lzz` is NOT isCommandInExcludedList - use `yYz` instead

---

## Documentation Index

### Core Documentation

| Document | Purpose | Key Topics |
|----------|---------|------------|
| [**overview.md**](./overview.md) | Architecture overview | Platform abstraction, three-layer security model, initialization flow |
| [**algorithm_analysis.md**](./algorithm_analysis.md) | Algorithm deep dive | BFS pattern matching, ring buffer, SBPL construction, domain matching |
| [**symbol_validation.md**](./symbol_validation.md) | Validated symbols | Cross-validated mappings with corrections |
| [**cross_module_integration.md**](./cross_module_integration.md) | Module integration | System reminders, permissions, hooks, MCP, UI |
| [**system_prompt_integration.md**](./system_prompt_integration.md) | System prompt injection | E9z function, open/closed mode instructions, TMPDIR guidance |

### Platform-Specific Implementation

| Document | Platform | Key Topics |
|----------|----------|------------|
| [**seatbelt_profile.md**](./seatbelt_profile.md) | macOS | SBPL profile generation, Mach IPC rules, sysctl whitelisting |
| [**bwrap_implementation.md**](./bwrap_implementation.md) | Linux | Bubblewrap arguments, filesystem mounts, network namespace |
| [**seccomp_filter.md**](./seccomp_filter.md) | Linux | BPF filter for Unix socket blocking, architecture detection |

### Subsystems

| Document | Purpose | Key Topics |
|----------|---------|------------|
| [**network_proxy.md**](./network_proxy.md) | Network isolation | HTTP/SOCKS proxies, domain filtering, Linux bridge sockets |
| [**violation_system.md**](./violation_system.md) | Violation handling | Log monitoring (macOS), violation store, stderr annotation |
| [**initialization_flow.md**](./initialization_flow.md) | Boot sequence | Dependency checks, proxy startup, cleanup handlers |
| [**permission_sync.md**](./permission_sync.md) | Permission integration | Auto-allow logic, fallback policy, rule synchronization |
| [**settings_schema.md**](./settings_schema.md) | Configuration | JSON schema, validation, defaults |

### UI Documentation

| Document | Purpose | Key Topics |
|----------|---------|------------|
| [**ui_linkage.md**](./ui_linkage.md) | UI components | /sandbox command, settings panels, status indicators |
| [**ui_interaction_flows.md**](./ui_interaction_flows.md) | UI interaction patterns | State machines, observer pattern, settings persistence |

### System Prompt Integration

| Document | Purpose | Key Topics |
|----------|---------|------------|
| [**system_prompt_integration.md**](./system_prompt_integration.md) | System prompt injection | E9z function overview, open/closed mode |
| [**system_prompt_deep_dive.md**](./system_prompt_deep_dive.md) | E9z function analysis | Full source analysis, anti-learning pattern, TMPDIR handling |

---

## Architecture Diagram

```
User or Agent Loop
       |
       v
  +-----------+
  | vA (API)  |  <-- sandboxConfigObject: public interface
  +-----------+
       |
  isSandboxingEnabled()?
       |
  +----+----+
  | YES     | NO --> command runs unsandboxed (if allowed)
  v
wrapWithSandbox(command, shell, overrides, abortSignal)
       |
  +----+----+
  |         |
  v         v
macOS     Linux
QZ7()     uZ7()
  |         |
  v         v
sandbox-exec -p <SBPL>   bwrap --unshare-net --ro-bind ... + seccomp
  |                            |
  v                            v
Network proxy (HTTP+SOCKS)   Network via Unix socket bridge
  |                            |
  v                            v
Command runs in restricted environment
```

---

## Key Functions

### High-Level API (chunks.56.mjs)

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `sandboxConfigObject` | `vA` | Public API facade for all sandbox operations |
| `isSandboxingEnabled` | `h21` | Full gate: platform + dependencies + settings |
| `wrapWithSandbox` | `Xx3` | Main dispatch: wraps command with platform-specific sandbox |
| `isCommandSandboxed` | `Ti` | Per-command gate: enabled + not excluded + not override |
| `isAutoAllowBashIfSandboxedEnabled` | `$x3` | Check auto-allow setting |
| `areUnsandboxedCommandsAllowed` | `Hx3` | Check fallback allowed setting |

### Platform Abstraction (chunks.55.mjs)

| Function | Obfuscated | Platform | Purpose |
|----------|------------|----------|---------|
| `wrapWithMacOSSandbox` | `QZ7` | macOS | Wrap command with sandbox-exec |
| `generateSeatbeltProfile` | `xb3` | macOS | Generate SBPL policy string |
| `wrapWithLinuxSandbox` | `uZ7` | Linux | Wrap command with bwrap |
| `buildFilesystemMounts` | `Rb3` | Linux | Generate bwrap bind mount arguments |

### Network Isolation (chunks.55.mjs)

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `startHttpProxy` | `gb3` | Start HTTP proxy with domain filter |
| `startSocksProxy` | `Fb3` | Start SOCKS proxy with domain filter |
| `checkNetworkPermission` | `nZ7` | Check domain against allow/deny lists |
| `matchDomainPattern` | `bw8` | Match domain with wildcard support |

### Command Exclusion (chunks.172.mjs)

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `isCommandInExcludedList` | `yYz` | Check if command matches exclusion patterns |
| `isCommandSandboxed` | `Ti` | 4-gate check for sandboxing |
| `parseExclusionPattern` | `yfq` | Parse pattern into type/prefix/command |
| `matchWildcardPattern` | `Cn8` | Glob-style wildcard matching |
| `extractCommandBasename` | `Ac` | Strip env vars and prefixes |

### UI Components (chunks.165.mjs)

| Component | Obfuscated | Purpose |
|-----------|------------|---------|
| `sandboxSlashCommandDefinition` | `bAz` | /sandbox slash command |
| `SandboxModeSelector` | `TPq` | 3-way mode picker |
| `SandboxStatusDisplay` | `PPq` | Config summary display |
| `SandboxOverridesSettings` | `ZPq` | Fallback policy toggle |
| `SandboxDependenciesPanel` | `Ql8` | Dependency status display |
| `SandboxViolationStatusLine` | `aIq` | Status bar indicator |

---

## Integration Points

### 04_system_reminder
- `getSandboxSystemPromptBlock` (E9z) injects sandbox instructions into Bash tool system prompt
- Violation attachments inform model of blocked operations

### 05_tools (Bash Tool)
- `dangerouslyDisableSandbox` parameter for fallback execution
- Command output annotated with sandbox violations

### 37_permission_policy
- Auto-allow logic when sandbox is enabled
- Permission prompts for sandbox override

### 01_cli (UI)
- `/sandbox` slash command for configuration
- Status bar violation indicator
- `/doctor` dependency validation

### 06_mcp (MCP Protocol)
- `mcp-cli` commands exempt from sandboxing
- MCP server communication runs unsandboxed

### 30_agent_teams (Swarm)
- Mailbox-based permission sync between leader/workers
- `sendSandboxPermissionRequest` for worker→leader requests
- `sendSandboxPermissionResponse` for leader→worker responses
- Callback system for async permission resolution

---

## Settings Schema

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "allowUnsandboxedCommands": false,
    "enabledPlatforms": ["macos", "linux"],
    "excludedCommands": ["npm run test:*", "make build"],
    "filesystem": {
      "allowWrite": ["/path/to/project"],
      "denyWrite": ["/path/to/project/.env"],
      "denyRead": ["/etc/passwd"]
    },
    "network": {
      "allowedDomains": ["api.anthropic.com", "*.github.com"],
      "deniedDomains": ["malware.example.com"],
      "allowUnixSockets": ["/var/run/docker.sock"],
      "allowAllUnixSockets": false,
      "allowLocalBinding": false
    },
    "seccomp": {
      "bpfPath": "/custom/path/to/unix-block.bpf",
      "applyPath": "/custom/path/to/apply-seccomp"
    }
  }
}
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI components

---

## Document Status

| Document | Status | Completeness |
|----------|--------|--------------|
| overview.md | Complete | Full architecture with code snippets |
| algorithm_analysis.md | Complete | 18+ key algorithms with source-verified code |
| symbol_validation.md | Complete | All symbols cross-validated with source-verified table |
| cross_module_integration.md | Complete | All integration points documented, 04_system_reminder deep-dive |
| system_prompt_integration.md | Complete | Full E9z function analysis |
| system_prompt_deep_dive.md | Complete | Deep analysis of E9z with line-by-line annotation |
| seatbelt_profile.md | Complete | Full SBPL analysis |
| bwrap_implementation.md | Complete | Full bwrap argument analysis |
| seccomp_filter.md | Complete | BPF filter implementation |
| network_proxy.md | Complete | Proxy architecture |
| violation_system.md | Complete | Monitoring and reporting |
| initialization_flow.md | Complete | Boot sequence |
| permission_sync.md | Complete | Permission integration |
| settings_schema.md | Complete | JSON schema documentation |
| ui_linkage.md | Complete | All UI components with state management patterns |
| ui_interaction_flows.md | Complete | State machines, observer patterns, permission prompts, /doctor |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: ✅ COMPLETE - All symbols cross-validated against source code, 25+ algorithms with source-verified code, UI interaction patterns documented, complete violation detection flow, status line lifecycle documented, 04_system_reminder deep-dive completed, 30_agent_teams permission sync documented

## Summary of Enhancements (v2.1.76)

### Symbol Validation (Source-Verified) ✅
All 25+ core symbols cross-validated against source code:
- **Core API**: vA, h21, Xx3, Ti
- **Platform Implementation**: QZ7, uZ7, xb3, Rb3
- **Network**: gb3, Fb3, nZ7, bw8
- **Violation Handling**: HD6, UZ7, eb3
- **Command Exclusion**: yYz, yfq, Cn8, Ac
- **UI Components**: bAz, TPq, PPq, ZPq, Ql8, aIq
- **System Prompt**: E9z
- **Agent Teams Permission Sync**: al4, sl4, tl4, nc6, Yi4, zi4 (NEW)

### Algorithm Analysis ✅
- 25+ algorithms documented with source code
- BFS variant expansion in `isCommandInExcludedList`
- Ring buffer management in `SandboxViolationStore`
- Domain pattern matching with wildcard support
- Network permission check flow
- SBPL profile construction
- Agent Teams permission callback system (NEW)

### UI Interaction Flows ✅
- Complete permission prompt flow with sandbox context
- SandboxOverridesSettings (ZPq) component analysis (NEW)
- SandboxDependenciesPanel (Ql8) component analysis (NEW)

### Cross-Module Integration ✅
- 04_system_reminder deep-dive
- 05_tools (Bash) integration
- 37_permission_policy integration
- 30_agent_teams permission sync (NEW)
- Complete violation detection → model visibility flow
- Linux vs macOS violation detection differences
- "Bash command (unsandboxed)" title logic documented
- /doctor command integration for dependency validation
- Status line violation indicator lifecycle (NEW)
- Mode selector state machine
- Settings persistence flow

### Cross-Module Integration ✅
- Deep dive into 04_system_reminder integration
- Complete E9z function analysis with anti-learning pattern
- MCP sandbox bypass (mcp-cli exemption)
- Background agents sandbox behavior
- Complete violation detection → model visibility flow (NEW)
- Linux vs macOS violation detection differences (NEW)