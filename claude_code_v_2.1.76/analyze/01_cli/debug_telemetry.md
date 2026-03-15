# CLI-Debug Telemetry Integration

> How CLI flags control debugging output and telemetry verbosity

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry

Key functions in this document:
- `debug` (h) - Debug logging function
- `parseBoolean` (J6) - Boolean parsing utility
- `enableDebugMode` - Enable debug output

---

## Overview

The CLI provides several flags for debugging and verbose output:

1. **`-d, --debug [filter]`** - Enable debug mode with category filtering
2. **`--debug-to-stderr`** - Output debug to stderr
3. **`--debug-file <path>`** - Write debug logs to file
4. **`--verbose`** - Override verbose setting from config
5. **`--mcp-debug`** - [DEPRECATED] MCP debug mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → DEBUG/TELEMETRY PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  --debug         │    │  --debug-to-      │    │  --debug-file    │     │
│  │  [filter]        │    │  stderr           │    │  <path>          │     │
│  │  Enable debug    │    │  Output target    │    │  File logging    │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   Debug Output Router         │                       │
│                    │   stderr / file / both        │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                    Category Filter      No Filter                          │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────────┐               │
│           │ Filter by:              │   │ Output all      │               │
│           │ api,hooks,!1p,!file     │   │ debug messages  │               │
│           └─────────────────────────┘   └─────────────────┘               │
│                                                                              │
│  Additional: --verbose for config override                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 Debug Flags

**Source location:** `chunks.197.mjs:1017-1019`

```javascript
// ============================================
// Debug CLI flag definitions
// Location: chunks.197.mjs:1017-1019
// ============================================

// ORIGINAL (for source lookup):
.option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', (w) => {
    return !0
})
.addOption(new J5("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp())
.option("--debug-file <path>", "Write debug logs to a specific file path (implicitly enables debug mode)", () => !0)
.option("--verbose", "Override verbose mode setting from config", () => !0)
.option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0)

// READABLE (for understanding):
.option("-d, --debug [filter]",
    'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")',
    (value) => true)  // Parser returns true regardless of value
.addOption(new Option("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)")
    .argParser(Boolean)
    .hideHelp())
.option("--debug-file <path>",
    "Write debug logs to a specific file path (implicitly enables debug mode)",
    () => true)
.option("--verbose",
    "Override verbose mode setting from config",
    () => true)
.option("--mcp-debug",
    "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",
    () => true)

// Mapping: J5→Option, w→filterValue
```

### 1.2 Flag Extraction

**Source location:** `chunks.197.mjs:1032-1035`

```javascript
// ============================================
// Debug flag extraction
// Location: chunks.197.mjs:1032-1035
// ============================================

// ORIGINAL (for source lookup):
let {
    debug: $ = !1,
    debugToStderr: O = !1,
    ...
} = H
...
let g = H.verbose ?? f6().verbose

// READABLE (for understanding):
let {
    debug: isDebugEnabled = false,
    debugToStderr: debugToStderr = false,
    ...
} = options;

let verbose = options.verbose ?? getUserSettings().verbose;

// Mapping: $→isDebugEnabled, O→debugToStderr, g→verbose, f6→getUserSettings
```

---

## 2. Debug Category Filtering

### 2.1 Filter Syntax

**What it does:** The `--debug` flag accepts an optional filter string to control which debug messages are shown.

**Filter patterns:**

| Pattern | Meaning |
|---------|---------|
| `api` | Show API-related debug messages |
| `hooks` | Show hook execution messages |
| `tools` | Show tool execution messages |
| `mcp` | Show MCP server messages |
| `!api` | Exclude API messages |
| `!1p` | Exclude one-line-print messages |
| `!file` | Exclude file operation messages |
| `api,hooks` | Show only api and hooks |
| `!api,!hooks` | Show everything except api and hooks |

### 2.2 Common Filter Examples

```bash
# Show all debug messages
claude --debug

# Show only API and hooks messages
claude --debug "api,hooks"

# Show everything except file operations
claude --debug "!file"

# Show tools and MCP, exclude API
claude --debug "tools,mcp,!api"
```

---

## 3. Debug Output Targets

### 3.1 Stderr Output

**What it does:** By default, debug output goes to stderr. The `--debug-to-stderr` flag explicitly enables this.

```bash
# Debug to stderr (default behavior when debug enabled)
claude --debug --debug-to-stderr "Analyze code"

# Capture debug output separately
claude --debug "Analyze code" 2> debug.log
```

### 3.2 File Output

**What it does:** The `--debug-file` flag writes debug logs to a specified file, implicitly enabling debug mode.

```bash
# Write debug logs to file
claude --debug-file /tmp/claude-debug.log "Analyze code"

# File output includes:
# - Timestamp
# - Category
# - Message
# - Stack traces (for errors)
```

### 3.3 Output Format

```
[2025-01-15T10:30:45.123Z] [api] Sending request to Claude API
[2025-01-15T10:30:45.456Z] [api] Received response (latency: 333ms)
[2025-01-15T10:30:45.500Z] [tools] Executing Bash tool: git status
[2025-01-15T10:30:45.550Z] [hooks] Running PreToolUse hooks
```

---

## 4. Verbose Mode

### 4.1 Verbose Flag Behavior

**What it does:** Overrides the `verbose` setting from user configuration, enabling more detailed output.

**Source location:** `chunks.197.mjs:1054`

```javascript
// ============================================
// Verbose mode resolution
// Location: chunks.197.mjs:1054
// ============================================

// ORIGINAL (for source lookup):
let g = H.verbose ?? f6().verbose

// READABLE (for understanding):
let verbose = options.verbose ?? getUserSettings().verbose;

// Mapping: g→verbose, H→options, f6→getUserSettings
```

### 4.2 Verbose vs Debug

| Aspect | Verbose | Debug |
|--------|---------|-------|
| Output detail | Medium | High |
| API details | Basic | Full |
| Hook execution | Summary | Full |
| Stack traces | No | Yes |
| Category filter | No | Yes |
| File output | No | Yes |

---

## 5. MCP Debug Mode (Deprecated)

### 5.1 MCP Debug Flag

**What it does:** Legacy flag for MCP-specific debug output. Now deprecated in favor of `--debug mcp`.

**Source location:** `chunks.197.mjs:1019`

```javascript
// ============================================
// --mcp-debug flag (deprecated)
// Location: chunks.197.mjs:1019
// ============================================

// ORIGINAL (for source lookup):
.option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0)

// READABLE (for understanding):
.option("--mcp-debug",
    "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",
    () => true)
```

### 5.2 Migration Guide

```bash
# Old way (deprecated)
claude --mcp-debug

# New way
claude --debug mcp

# Or with other categories
claude --debug "mcp,tools"
```

---

## 6. Environment Variables

### 6.1 Debug Environment Variables

| Variable | Effect |
|----------|--------|
| `CLAUDE_DEBUG=1` | Enable debug mode |
| `CLAUDE_DEBUG_FILE=/path` | Write debug to file |
| `CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES=1` | Include partial messages |

### 6.2 Verbose Environment Variable

```bash
# Enable verbose mode via environment
CLAUDE_VERBOSE=1 claude "Analyze code"
```

---

## 7. Use Cases

### 7.1 Basic Debugging

```bash
# Enable debug output
claude --debug "What is this code doing?"

# Debug with file logging
claude --debug-file debug.log "Analyze architecture"
```

### 7.2 API Debugging

```bash
# Debug API calls only
claude --debug api "Generate code"

# Debug API and tools
claude --debug "api,tools" "Complex task"
```

### 7.3 Hook Debugging

```bash
# Debug hook execution
claude --debug hooks "Run with hooks"

# Debug hooks and MCP
claude --debug "hooks,mcp" "Integration task"
```

### 7.4 Exclude Noise

```bash
# Exclude file operations from debug
claude --debug "!file" "File-heavy operation"

# Exclude one-line-print noise
claude --debug "!1p" "Analysis task"
```

### 7.5 Verbose Mode

```bash
# Override config verbose setting
claude --verbose "Standard task"

# Verbose with debug
claude --verbose --debug "Detailed analysis"
```

---

## 8. Debug Categories Reference

### 8.1 Available Categories

| Category | Description |
|----------|-------------|
| `api` | LLM API requests/responses |
| `hooks` | Hook execution lifecycle |
| `tools` | Tool execution details |
| `mcp` | MCP server communication |
| `file` | File operations |
| `1p` | One-line-print messages |
| `startup` | Initialization and startup |
| `compact` | Compaction operations |
| `state` | State management |
| `telemetry` | Telemetry events |

### 8.2 Category Hierarchy

```
debug (root)
├── api
│   ├── request
│   ├── response
│   └── streaming
├── hooks
│   ├── preToolUse
│   ├── postToolUse
│   └── sessionStart
├── tools
│   ├── bash
│   ├── read
│   └── edit
├── mcp
│   ├── server
│   ├── client
│   └── protocol
└── startup
    ├── config
    ├── session
    └── agents
```

---

## 9. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.197.mjs:1017` | Commander options |
| Flag extraction | `chunks.197.mjs:1032` | Action handler |
| Verbose resolution | `chunks.197.mjs:1054` | Settings override |
| Category filtering | Various | Debug function calls |
| File logging | Various | Debug file output |
