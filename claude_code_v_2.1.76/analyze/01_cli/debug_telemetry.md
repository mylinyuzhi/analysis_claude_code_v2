# CLI-Debug Telemetry Integration

> How CLI flags control debugging output and telemetry verbosity

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry

Key functions in this document:
- `debugLog` (k) - Debug logging function with level filtering
- `trackEvent` (d) - Telemetry event tracking function
- `setTelemetryBackend` (oAA) - Set telemetry backend
- `parseBoolean` (t6) - Boolean parsing utility
- `isDebugEnabled` (PT) - Check if debug mode is enabled
- `getDebugFilter` (Krq) - Get debug category filter
- `isDebugToStderr` (Sx) - Check if debug goes to stderr
- `getDebugFilePath` (iAA) - Get debug file path

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
│  Telemetry (parallel track):                                                 │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  trackEvent()    │───►│  TelemetryBackend │───►│  Segment/DD/1P   │     │
│  │  d()             │    │  (tw6)            │    │  Analytics       │     │
│  └──────────────────┘    └───────────────────┘    └──────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 Debug Flags

**Source location:** `chunks.197.mjs:1017-1019`

```javascript
// ============================================
// debugLogFlags - CLI flag definitions for debug mode
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
// debugFlagExtraction - Debug flag extraction in action handler
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

## 2. Debug Log Function Implementation

### 2.1 Debug Log Function

**Source location:** `chunks.2.mjs:165-181`

```javascript
// ============================================
// debugLog - Debug logging function with level filtering
// Location: chunks.2.mjs:165-181
// ============================================

// ORIGINAL (for source lookup):
function k(A, {
    level: q
} = {
    level: "debug"
}) {
    if (Jm1[q] < Jm1[qrq()]) return;
    if (!Yrq(A)) return;
    if (nAA && A.includes(`
`)) A = B6(A);
    let Y = `${new Date().toISOString()} [${q.toUpperCase()}] ${A.trim()}
`;
    if (Sx()) {
        Gn(Y);
        return
    }
    zrq().write(Y)
}

// READABLE (for understanding):
function debugLog(message, {
    level = "debug"
} = {}) {
    // Check if level meets minimum threshold
    if (LOG_LEVELS[level] < LOG_LEVELS[getCurrentLogLevel()]) {
        return;
    }

    // Check category filter (e.g., "api", "hooks", "!file")
    if (!shouldLogMessage(message)) {
        return;
    }

    // Handle multiline formatting
    if (formatMultiline && message.includes("\n")) {
        message = formatMultilineMessage(message);
    }

    // Format output: [timestamp] [LEVEL] message
    let output = `${new Date().toISOString()} [${level.toUpperCase()}] ${message.trim()}\n`;

    // Write to file or stderr
    if (isDebugToStderr()) {
        writeToFile(output);
        return;
    }

    getDebugOutputStream().write(output);
}

// Mapping: k→debugLog, A→message, q→level, Jm1→LOG_LEVELS, qrq→getCurrentLogLevel,
//          Yrq→shouldLogMessage, nAA→formatMultiline, B6→formatMultilineMessage,
//          Sx→isDebugToStderr, Gn→writeToFile, zrq→getDebugOutputStream
```

### 2.2 Debug Configuration Functions

**Source location:** `chunks.2.mjs:219-246`

```javascript
// ============================================
// debugConfig - Debug configuration initialization
// Location: chunks.2.mjs:219-246
// ============================================

// ORIGINAL (for source lookup):
Jm1 = {
    verbose: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
}, qrq = e1(() => {
    let A = process.env.CLAUDE_CODE_DEBUG_LOG_LEVEL?.toLowerCase().trim();
    if (A && Object.hasOwn(Jm1, A)) return A;
    return "debug"
}), PT = e1(() => {
    return cAA || t6(process.env.DEBUG) || t6(process.env.DEBUG_SDK) || process.argv.includes("--debug") || process.argv.includes("-d") || Sx() || process.argv.some((A) => A.startsWith("--debug=")) || iAA() !== null
});
Krq = e1(() => {
    let A = process.argv.find((K) => K.startsWith("--debug="));
    if (!A) return null;
    let q = A.substring(8);
    return Q6A(q)
}), Sx = e1(() => {
    return process.argv.includes("--debug-to-stderr") || process.argv.includes("-d2e")
}), iAA = e1(() => {
    for (let A = 0; A < process.argv.length; A++) {
        let q = process.argv[A];
        if (q.startsWith("--debug-file=")) return q.substring(13);
        if (q === "--debug-file" && A + 1 < process.argv.length) return process.argv[A + 1]
    }
    return null
});

// READABLE (for understanding):
// Log levels (lower = more verbose)
const LOG_LEVELS = {
    verbose: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};

// Get current log level from environment
const getCurrentLogLevel = memoize(() => {
    let level = process.env.CLAUDE_CODE_DEBUG_LOG_LEVEL?.toLowerCase().trim();
    if (level && Object.hasOwn(LOG_LEVELS, level)) {
        return level;
    }
    return "debug";
});

// Check if debug mode is enabled
const isDebugEnabled = memoize(() => {
    return forcedDebugMode ||
           parseBoolean(process.env.DEBUG) ||
           parseBoolean(process.env.DEBUG_SDK) ||
           process.argv.includes("--debug") ||
           process.argv.includes("-d") ||
           isDebugToStderr() ||
           process.argv.some(arg => arg.startsWith("--debug=")) ||
           getDebugFilePath() !== null;
});

// Get debug category filter from --debug=filter argument
const getDebugFilter = memoize(() => {
    let arg = process.argv.find(a => a.startsWith("--debug="));
    if (!arg) return null;
    let filter = arg.substring(8);
    return parseDebugFilter(filter);
});

// Check if debug output goes to stderr
const isDebugToStderr = memoize(() => {
    return process.argv.includes("--debug-to-stderr") ||
           process.argv.includes("-d2e");
});

// Get debug file path from --debug-file argument
const getDebugFilePath = memoize(() => {
    for (let i = 0; i < process.argv.length; i++) {
        let arg = process.argv[i];
        if (arg.startsWith("--debug-file=")) {
            return arg.substring(13);
        }
        if (arg === "--debug-file" && i + 1 < process.argv.length) {
            return process.argv[i + 1];
        }
    }
    return null;
});

// Mapping: Jm1→LOG_LEVELS, qrq→getCurrentLogLevel, PT→isDebugEnabled, Krq→getDebugFilter,
//          Sx→isDebugToStderr, iAA→getDebugFilePath, e1→memoize, t6→parseBoolean,
//          Q6A→parseDebugFilter, cAA→forcedDebugMode
```

---

## 3. Telemetry Event Tracking

### 3.1 Telemetry Backend

**Source location:** `chunks.2.mjs:263-285`

```javascript
// ============================================
// telemetryBackend - Telemetry backend setup and event tracking
// Location: chunks.2.mjs:263-285
// ============================================

// ORIGINAL (for source lookup):
function oAA(A) {
    if (tw6 !== null) return;
    if (tw6 = A, nt6.length > 0) {
        let q = [...nt6];
        nt6.length = 0, queueMicrotask(() => {
            for (let K of q)
                if (K.async) tw6.logEventAsync(K.eventName, K.metadata);
                else tw6.logEvent(K.eventName, K.metadata)
        })
    }
}
function d(A, q) {
    if (tw6 === null) {
        nt6.push({
            eventName: A,
            metadata: q,
            async: !1
        });
        return
    }
    tw6.logEvent(A, q)
}

// READABLE (for understanding):
function setTelemetryBackend(backend) {
    // Only set once
    if (telemetryBackend !== null) return;

    telemetryBackend = backend;

    // Flush any queued events
    if (pendingEvents.length > 0) {
        let events = [...pendingEvents];
        pendingEvents.length = 0;

        queueMicrotask(() => {
            for (let event of events) {
                if (event.async) {
                    telemetryBackend.logEventAsync(event.eventName, event.metadata);
                } else {
                    telemetryBackend.logEvent(event.eventName, event.metadata);
                }
            }
        });
    }
}

function trackEvent(eventName, metadata) {
    // Queue events if backend not initialized
    if (telemetryBackend === null) {
        pendingEvents.push({
            eventName: eventName,
            metadata: metadata,
            async: false
        });
        return;
    }

    telemetryBackend.logEvent(eventName, metadata);
}

// Mapping: oAA→setTelemetryBackend, d→trackEvent, tw6→telemetryBackend, nt6→pendingEvents
```

### 3.2 Telemetry Event Categories

All telemetry events follow the naming convention `tengu_<category>_<action>`:

| Category | Prefix | Examples |
|----------|--------|----------|
| **Startup** | `tengu_startup_` | `tengu_startup_telemetry`, `tengu_startup_manual_model_config` |
| **Session** | `tengu_session_` | `tengu_session_resumed`, `tengu_session_memory_loaded` |
| **Agent** | `tengu_agent_` | `tengu_agent_created`, `tengu_agent_tool_selected`, `tengu_agent_tool_completed` |
| **Tool** | `tengu_tool_` | `tengu_tool_use_granted`, `tengu_tool_use_cancelled`, `tengu_tool_result_persisted` |
| **Compact** | `tengu_compact_` | `tengu_compact`, `tengu_compact_failed`, `tengu_partial_compact` |
| **MCP** | `tengu_mcp_` | `tengu_mcp_servers`, `tengu_mcp_oauth_flow_start`, `tengu_mcp_list_changed` |
| **Auto Mode** | `tengu_auto_mode_` | `tengu_auto_mode_decision`, `tengu_auto_mode_outcome` |
| **Permission** | `tengu_permission_` | `tengu_permission_request_escape`, `tengu_permission_explainer_generated` |
| **Model** | `tengu_model_` | `tengu_model_command_menu`, `tengu_model_fallback_triggered` |
| **Plan** | `tengu_plan_` | `tengu_plan_enter`, `tengu_plan_exit` |
| **Hook** | `tengu_hook_` | `tengu_hooks_command`, `tengu_post_tool_hooks_cancelled` |
| **Plugin** | `tengu_plugin_` | `tengu_plugin_installed_cli`, `tengu_plugin_updated_cli` |
| **Migration** | `tengu_migrate_` | `tengu_migrate_autoupdates_to_settings`, `tengu_migrate_bypass_permissions_accepted` |
| **Memory** | `tengu_memdir_` | `tengu_memdir_accessed`, `tengu_memdir_file_read` |
| **Team** | `tengu_team_` | `tengu_team_created`, `tengu_team_deleted`, `tengu_team_mem_sync_pull` |

### 3.3 Key Telemetry Events by Feature

#### Startup Events
```javascript
// Fired at CLI startup with session configuration
d("tengu_startup_telemetry", {
    model: "claude-sonnet-4-6",
    mode: "interactive",
    hasSystemPrompt: true,
    mcpServerCount: 3
});

// Fired when manual model config is provided
d("tengu_startup_manual_model_config", {
    modelId: "claude-opus-4"
});
```

#### Agent Events
```javascript
// Agent tool selected by user
d("tengu_agent_tool_selected", {
    toolName: "teammate",
    agentName: "general-purpose"
});

// Agent tool completed
d("tengu_agent_tool_completed", {
    toolName: "teammate",
    success: true,
    durationMs: 5432
});

// Agent memory loaded from file
d("tengu_agent_memory_loaded", {
    agentType: "general-purpose",
    memoryFile: "CLAUDE.md"
});
```

#### Compact Events
```javascript
// Successful compaction
d("tengu_compact", {
    tokensBefore: 180000,
    tokensAfter: 45000,
    messagesCompacted: 25,
    compactionRatio: 0.25
});

// Compaction failed
d("tengu_compact_failed", {
    reason: "context_length_exceeded",
    error: "..."
});

// Partial compact (selective)
d("tengu_partial_compact", {
    messagesProcessed: 10,
    tokensRemoved: 30000
});
```

#### Auto Mode Events
```javascript
// Decision on tool execution mode
d("tengu_auto_mode_decision", {
    toolName: "Bash",
    decision: "allow",  // or "deny", "ask"
    classifierVersion: "v2",
    reason: "safe_allowlist"
});

// Outcome tracking
d("tengu_auto_mode_outcome", {
    toolName: "Edit",
    allowed: true,
    stage: "stage1",
    confidence: 0.95
});
```

---

## 4. Debug Category Filtering

### 4.1 Filter Syntax

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

### 4.2 Common Filter Examples

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

## 5. Debug Output Targets

### 5.1 Stderr Output

**What it does:** By default, debug output goes to stderr. The `--debug-to-stderr` flag explicitly enables this.

```bash
# Debug to stderr (default behavior when debug enabled)
claude --debug --debug-to-stderr "Analyze code"

# Capture debug output separately
claude --debug "Analyze code" 2> debug.log
```

### 5.2 File Output

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

### 5.3 Output Format

```
[2025-01-15T10:30:45.123Z] [DEBUG] Sending request to Claude API
[2025-01-15T10:30:45.456Z] [DEBUG] Received response (latency: 333ms)
[2025-01-15T10:30:45.500Z] [INFO] Executing Bash tool: git status
[2025-01-15T10:30:45.550Z] [WARN] Running PreToolUse hooks
[2025-01-15T10:30:45.600Z] [ERROR] Tool execution failed: permission denied
```

---

## 6. Verbose Mode

### 6.1 Verbose Flag Behavior

**What it does:** Overrides the `verbose` setting from user configuration, enabling more detailed output.

**Source location:** `chunks.197.mjs:1054`

```javascript
// ============================================
// verboseMode - Verbose mode resolution
// Location: chunks.197.mjs:1054
// ============================================

// ORIGINAL (for source lookup):
let g = H.verbose ?? f6().verbose

// READABLE (for understanding):
let verbose = options.verbose ?? getUserSettings().verbose;

// Mapping: g→verbose, H→options, f6→getUserSettings
```

### 6.2 Verbose vs Debug

| Aspect | Verbose | Debug |
|--------|---------|-------|
| Output detail | Medium | High |
| API details | Basic | Full |
| Hook execution | Summary | Full |
| Stack traces | No | Yes |
| Category filter | No | Yes |
| File output | No | Yes |

---

## 7. MCP Debug Mode (Deprecated)

### 7.1 MCP Debug Flag

**What it does:** Legacy flag for MCP-specific debug output. Now deprecated in favor of `--debug mcp`.

**Source location:** `chunks.197.mjs:1019`

```javascript
// ============================================
// mcpDebugFlag - --mcp-debug flag (deprecated)
// Location: chunks.197.mjs:1019
// ============================================

// ORIGINAL (for source lookup):
.option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0)

// READABLE (for understanding):
.option("--mcp-debug",
    "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",
    () => true)
```

### 7.2 Migration Guide

```bash
# Old way (deprecated)
claude --mcp-debug

# New way
claude --debug mcp

# Or with other categories
claude --debug "mcp,tools"
```

---

## 8. Environment Variables

### 8.1 Debug Environment Variables

| Variable | Effect |
|----------|--------|
| `CLAUDE_DEBUG=1` | Enable debug mode |
| `CLAUDE_DEBUG_FILE=/path` | Write debug to file |
| `CLAUDE_CODE_DEBUG_LOG_LEVEL=debug` | Set log level (verbose/debug/info/warn/error) |
| `CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES=1` | Include partial messages |
| `DEBUG=1` | Enable debug mode (standard) |
| `DEBUG_SDK=1` | Enable SDK debug mode |

### 8.2 Verbose Environment Variable

```bash
# Enable verbose mode via environment
CLAUDE_VERBOSE=1 claude "Analyze code"
```

---

## 9. Use Cases

### 9.1 Basic Debugging

```bash
# Enable debug output
claude --debug "What is this code doing?"

# Debug with file logging
claude --debug-file debug.log "Analyze architecture"
```

### 9.2 API Debugging

```bash
# Debug API calls only
claude --debug api "Generate code"

# Debug API and tools
claude --debug "api,tools" "Complex task"
```

### 9.3 Hook Debugging

```bash
# Debug hook execution
claude --debug hooks "Run with hooks"

# Debug hooks and MCP
claude --debug "hooks,mcp" "Integration task"
```

### 9.4 Exclude Noise

```bash
# Exclude file operations from debug
claude --debug "!file" "File-heavy operation"

# Exclude one-line-print noise
claude --debug "!1p" "Analysis task"
```

### 9.5 Verbose Mode

```bash
# Override config verbose setting
claude --verbose "Standard task"

# Verbose with debug
claude --verbose --debug "Detailed analysis"
```

---

## 10. Debug Categories Reference

### 10.1 Available Categories

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

### 10.2 Category Hierarchy

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

## 11. Telemetry Event Reference (Complete List)

### 11.1 Startup Events

| Event | Description |
|-------|-------------|
| `tengu_startup_telemetry` | Main startup event with session config |
| `tengu_startup_manual_model_config` | Manual model configuration provided |
| `tengu_flicker` | Terminal flicker detected |

### 11.2 Session Events

| Event | Description |
|-------|-------------|
| `tengu_session_resumed` | Session resumed from previous |
| `tengu_session_memory_loaded` | Session memory file loaded |
| `tengu_conversation_rewind` | Conversation rewound |
| `tengu_cost_threshold_reached` | Cost threshold reached |
| `tengu_cost_threshold_acknowledged` | User acknowledged cost threshold |

### 11.3 Agent Events

| Event | Description |
|-------|-------------|
| `tengu_agent_created` | New agent spawned |
| `tengu_agent_definition_generated` | Agent definition generated |
| `tengu_agent_name_set` | Agent name configured |
| `tengu_agent_color_set` | Agent color configured |
| `tengu_agent_tool_selected` | User selected agent tool |
| `tengu_agent_tool_completed` | Agent tool execution finished |
| `tengu_agent_tool_terminated` | Agent tool terminated early |
| `tengu_agent_memory_loaded` | Agent memory loaded |
| `tengu_agent_parse_error` | Failed to parse agent config |
| `tengu_agent_flag` | Agent flag provided |

### 11.4 Tool Events

| Event | Description |
|-------|-------------|
| `tengu_tool_use_show_permission_request` | Permission prompt shown |
| `tengu_tool_use_granted_in_config` | Tool allowed by config |
| `tengu_tool_use_granted_by_classifier` | Tool allowed by auto-mode |
| `tengu_tool_use_cancelled` | Tool execution cancelled |
| `tengu_tool_use_diff_computed` | Diff computed for Edit |
| `tengu_tool_result_persisted` | Tool result saved |
| `tengu_tool_result_pairing_repaired` | Tool/result pairing fixed |
| `tengu_tool_empty_result` | Tool returned empty |
| `tengu_tool_search_mode_decision` | Search mode selected |
| `tengu_tool_search_outcome` | Search outcome tracked |

### 11.5 Compact Events

| Event | Description |
|-------|-------------|
| `tengu_compact` | Successful compaction |
| `tengu_compact_failed` | Compaction failed |
| `tengu_partial_compact` | Partial compaction |
| `tengu_partial_compact_failed` | Partial compact failed |
| `tengu_auto_compact_succeeded` | Auto-compact succeeded |
| `tengu_auto_compact_setting_changed` | Auto-compact setting changed |
| `tengu_compact_cache_sharing_success` | Cache sharing worked |
| `tengu_compact_cache_sharing_fallback` | Cache sharing fallback |
| `tengu_compact_streaming_retry` | Streaming retry attempted |

### 11.6 MCP Events

| Event | Description |
|-------|-------------|
| `tengu_mcp_servers` | MCP servers initialized |
| `tengu_mcp_add` | MCP server added |
| `tengu_mcp_oauth_flow_start` | OAuth flow started |
| `tengu_mcp_oauth_flow_success` | OAuth succeeded |
| `tengu_mcp_oauth_flow_error` | OAuth failed |
| `tengu_mcp_list_changed` | Server list changed |
| `tengu_mcp_elicitation_shown` | Elicitation prompt shown |
| `tengu_mcp_elicitation_response` | Elicitation response received |
| `tengu_claudeai_mcp_auth_started` | Claude.ai MCP auth started |
| `tengu_claudeai_mcp_auth_completed` | Claude.ai MCP auth done |

### 11.7 Auto Mode Events

| Event | Description |
|-------|-------------|
| `tengu_auto_mode_decision` | Auto-mode decision made |
| `tengu_auto_mode_outcome` | Auto-mode outcome tracked |
| `tengu_auto_mode_denial_limit_exceeded` | Too many denials |
| `tengu_auto_mode_opt_in_dialog_shown` | Opt-in dialog shown |
| `tengu_auto_mode_opt_in_dialog_accept` | User opted in |
| `tengu_auto_mode_opt_in_dialog_decline` | User declined |
| `tengu_auto_mode_malformed_tool_input` | Malformed input detected |

### 11.8 Permission Events

| Event | Description |
|-------|-------------|
| `tengu_permission_request_escape` | Permission prompt escaped |
| `tengu_permission_request_option_selected` | Permission option selected |
| `tengu_permission_explainer_generated` | Permission explanation generated |
| `tengu_permission_explainer_error` | Permission explainer error |
| `tengu_permission_explainer_shortcut_used` | Explainer shortcut used |

### 11.9 Plan Mode Events

| Event | Description |
|-------|-------------|
| `tengu_plan_enter` | Entered plan mode |
| `tengu_plan_exit` | Exited plan mode |
| `tengu_plan_external_editor_used` | External editor opened |

### 11.10 Team Events

| Event | Description |
|-------|-------------|
| `tengu_team_created` | Team created |
| `tengu_team_deleted` | Team deleted |
| `tengu_team_mem_sync_started` | Team memory sync started |
| `tengu_team_mem_sync_pull` | Team memory pulled |
| `tengu_team_mem_sync_push` | Team memory pushed |
| `tengu_team_mem_entries_capped` | Memory entries capped |
| `tengu_team_mem_secret_skipped` | Secret skipped in sync |

### 11.11 File/Index Events

| Event | Description |
|-------|-------------|
| `tengu_file_suggestions_git_ls_files` | Git ls-files completed |
| `tengu_file_suggestions_ripgrep` | Ripgrep search completed |
| `tengu_file_suggestions_query` | File suggestions query |
| `tengu_attachment_compute_duration` | Attachment compute time |
| `tengu_attachment_file_too_large` | File too large |
| `tengu_pdf_reference_attachment` | PDF reference attachment |

### 11.12 Plugin Events

| Event | Description |
|-------|-------------|
| `tengu_plugin_installed_cli` | Plugin installed |
| `tengu_plugin_uninstalled_cli` | Plugin uninstalled |
| `tengu_plugin_enabled_cli` | Plugin enabled |
| `tengu_plugin_disabled_cli` | Plugin disabled |
| `tengu_plugin_disabled_all_cli` | All plugins disabled |
| `tengu_plugin_updated_cli` | Plugin updated |
| `tengu_skill_loaded` | Skill loaded |
| `tengu_skill_tool_invocation` | Skill tool invoked |

### 11.13 Onboarding Events

| Event | Description |
|-------|-------------|
| `tengu_began_setup` | Setup started |
| `tengu_onboarding_step` | Onboarding step reached |
| `tengu_trust_dialog_shown` | Trust dialog shown |
| `tengu_trust_dialog_accept` | Trust accepted |
| `tengu_bypass_permissions_mode_dialog_shown` | Bypass dialog shown |
| `tengu_bypass_permissions_mode_dialog_accept` | Bypass accepted |
| `tengu_desktop_upsell_shown` | Desktop upsell shown |

### 11.14 Migration Events

| Event | Description |
|-------|-------------|
| `tengu_migrate_autoupdates_to_settings` | Autoupdates migrated |
| `tengu_migrate_autoupdates_error` | Migration error |
| `tengu_migrate_bypass_permissions_accepted` | Bypass migrated |
| `tengu_migrate_mcp_approval_fields_success` | MCP fields migrated |
| `tengu_legacy_opus_migration` | Legacy Opus migrated |
| `tengu_sonnet45_to_46_migration` | Sonnet 4.5 to 4.6 migrated |

### 11.15 Teleport Events

| Event | Description |
|-------|-------------|
| `tengu_teleport_started` | Teleport started |
| `tengu_teleport_cancelled` | Teleport cancelled |
| `tengu_teleport_resume_session` | Teleport resume session |
| `tengu_teleport_error_*` | Various teleport errors |
| `tengu_teleport_errors_detected` | Errors detected |
| `tengu_teleport_errors_resolved` | Errors resolved |

---

## 12. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.197.mjs:1017` | Commander options |
| Flag extraction | `chunks.197.mjs:1032` | Action handler |
| Verbose resolution | `chunks.197.mjs:1054` | Settings override |
| Debug log function | `chunks.2.mjs:165` | Core logging |
| Log level check | `chunks.2.mjs:219` | Level filtering |
| Category filter | `chunks.2.mjs:232` | Filter parsing |
| File output | `chunks.2.mjs:237` | Debug file path |
| Telemetry backend | `chunks.2.mjs:263` | Backend setup |
| Event tracking | `chunks.2.mjs:275` | trackEvent function |