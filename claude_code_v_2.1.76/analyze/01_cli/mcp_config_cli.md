# CLI-MCP Configuration Integration

> How CLI flags control MCP server loading and configuration

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools

Key functions in this document:
- `tryParseJson` (j9) - Parse JSON string or return null
- `validateMcpConfig` (Ug1) - Validate MCP configuration object
- `loadMcpConfigFile` (YG1) - Load MCP config from file
- `resolvePath` (UE6) - Resolve file path
- `isReservedMcpName` (KG1) - Check for reserved MCP names
- `hasEnterpriseMcpConfig` (pg1) - Check for enterprise MCP config
- `isEmptyConfig` (hn4) - Check if config is empty

---

## Overview

The CLI provides several flags for MCP (Model Context Protocol) configuration:

1. **`--mcp-config <configs...>`** - Load MCP servers from JSON
2. **`--strict-mcp-config`** - Ignore other MCP configurations
3. **`--permission-prompt-tool <tool>`** - MCP tool for permission prompts

Additionally, MCP subcommands are available:
- `claude mcp serve` - Start MCP server
- `claude mcp add` - Add MCP server interactively
- `claude mcp add-json` - Add MCP server from JSON
- `claude mcp remove` - Remove MCP server
- `claude mcp list` - List configured MCP servers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → MCP CONFIGURATION PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  --mcp-config    │    │  --strict-mcp-    │    │  --permission-   │     │
│  │  <configs...>    │    │  config           │    │  prompt-tool     │     │
│  │  Load servers    │    │  Ignore others    │    │  MCP prompts     │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   MCP Config Resolution       │                       │
│                    │   1. CLI configs              │                       │
│                    │   2. User configs             │                       │
│                    │   3. Project configs          │                       │
│                    │   (unless strict)             │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                    Strict Mode          Normal Mode                        │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────────┐               │
│           │ Use only CLI configs    │   │ Merge all       │               │
│           │ Ignore all others       │   │ configs         │               │
│           └─────────────────────────┘   └─────────────────┘               │
│                                    │                                       │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   Initialize MCP Servers       │                       │
│                    │   Start connections            │                       │
│                    │   Discover tools               │                       │
│                    └───────────────────────────────┘                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 MCP Configuration Flags

**Source location:** `chunks.197.mjs:1019-1023`

```javascript
// ============================================
// MCP configuration CLI flag definitions
// Location: chunks.197.mjs:1019-1023
// ============================================

// ORIGINAL (for source lookup):
.option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)")
.addOption(new J5("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp())
.option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0)

// READABLE (for understanding):
.option("--mcp-config <configs...>",
    "Load MCP servers from JSON files or strings (space-separated)")
.addOption(new Option("--permission-prompt-tool <tool>",
    "MCP tool to use for permission prompts (only works with --print)")
    .argParser(String)
    .hideHelp())
.option("--strict-mcp-config",
    "Only use MCP servers from --mcp-config, ignoring all other MCP configurations",
    () => true)

// Mapping: J5→Option
```

### 1.2 Flag Extraction

**Source location:** `chunks.197.mjs:1039-1040`

```javascript
// ============================================
// MCP flag extraction
// Location: chunks.197.mjs:1039-1040
// ============================================

// ORIGINAL (for source lookup):
let {
    ...
    mcpConfig: M = [],
    ...
} = H
...
let y1 = H.strictMcpConfig || !1;

// READABLE (for understanding):
let {
    mcpConfig: mcpConfigs = [],
    ...
} = options;

let strictMcpConfig = options.strictMcpConfig || false;

// Mapping: M→mcpConfigs, y1→strictMcpConfig, H→options
```

---

## 2. MCP Config Loading

### 2.1 Config Loading Flow

**Source location:** `chunks.197.mjs:1179-1229`

```javascript
// ============================================
// MCP config loading and parsing
// Location: chunks.197.mjs:1179-1229
// ============================================

// ORIGINAL (for source lookup):
let x1 = {};
if (M && M.length > 0) {
    let TA = M.map((oq) => oq.trim()).filter((oq) => oq.length > 0),
        F7 = {},
        f8 = [];
    for (let oq of TA) {
        let j5 = null,
            N4 = [],
            E9 = j9(oq);
        if (E9) {
            let W4 = Ug1({
                configObject: E9,
                filePath: "command line",
                expandVars: !0,
                scope: "dynamic"
            });
            if (W4.config) j5 = W4.config.mcpServers;
            else N4 = W4.errors
        } else {
            let W4 = UE6(oq),
                F1 = YG1({
                    filePath: W4,
                    expandVars: !0,
                    scope: "dynamic"
                });
            if (F1.config) j5 = F1.config.mcpServers;
            else N4 = F1.errors
        }
        if (N4.length > 0) f8.push(...N4);
        else if (j5) F7 = {
            ...F7,
            ...j5
        }
    }
    if (f8.length > 0) {
        let oq = f8.map((j5) => `${j5.path?j5.path+": ":""}${j5.message}`).join(`\n`);
        throw Error(`Invalid MCP configuration:\n${oq}`)
    }
    if (Object.keys(F7).length > 0) {
        if (Object.keys(F7).some(KG1)) throw Error(`Invalid MCP configuration: "${qy}" is a reserved MCP name.`);
        let oq = G61(F7, (j5) => ({
            ...j5,
            scope: "dynamic"
        }));
        x1 = {
            ...x1,
            ...oq
        }
    }
}

// READABLE (for understanding):
let dynamicMcpConfig = {};

if (mcpConfigs && mcpConfigs.length > 0) {
    // Clean up input (trim and filter empty)
    let cleanedConfigs = mcpConfigs.map(c => c.trim()).filter(c => c.length > 0);

    let mergedServers = {};
    let errors = [];

    for (let configInput of cleanedConfigs) {
        let servers = null;
        let configErrors = [];

        // Try to parse as JSON string first
        let parsedJson = tryParseJson(configInput);
        if (parsedJson) {
            let result = validateMcpConfig({
                configObject: parsedJson,
                filePath: "command line",
                expandVars: true,
                scope: "dynamic"
            });
            if (result.config) {
                servers = result.config.mcpServers;
            } else {
                configErrors = result.errors;
            }
        } else {
            // Treat as file path
            let resolvedPath = resolvePath(configInput);
            let fileResult = loadMcpConfigFile({
                filePath: resolvedPath,
                expandVars: true,
                scope: "dynamic"
            });
            if (fileResult.config) {
                servers = fileResult.config.mcpServers;
            } else {
                configErrors = fileResult.errors;
            }
        }

        if (configErrors.length > 0) {
            errors.push(...configErrors);
        } else if (servers) {
            mergedServers = { ...mergedServers, ...servers };
        }
    }

    // Report errors
    if (errors.length > 0) {
        let errorMessage = errors.map(e =>
            `${e.path ? e.path + ": " : ""}${e.message}`
        ).join("\n");
        throw new Error(`Invalid MCP configuration:\n${errorMessage}`);
    }

    // Merge into dynamic config
    if (Object.keys(mergedServers).length > 0) {
        // Check for reserved names
        if (Object.keys(mergedServers).some(isReservedMcpName)) {
            throw new Error(`Invalid MCP configuration: "${RESERVED_NAME}" is a reserved MCP name.`);
        }

        // Add scope to all servers
        let scopedServers = mapValues(mergedServers, server => ({
            ...server,
            scope: "dynamic"
        }));

        dynamicMcpConfig = { ...dynamicMcpConfig, ...scopedServers };
    }
}

// Mapping: M→mcpConfigs, x1→dynamicMcpConfig, j9→tryParseJson, Ug1→validateMcpConfig,
//          UE6→resolvePath, YG1→loadMcpConfigFile, KG1→isReservedMcpName, G61→mapValues
```

---

## 3. Strict MCP Config Mode

### 3.1 Strict Mode Behavior

**What it does:** When `--strict-mcp-config` is set, only MCP servers from `--mcp-config` are used, ignoring all other configuration sources.

**Source location:** `chunks.197.mjs:1268-1272`

```javascript
// ============================================
// Strict MCP config validation
// Location: chunks.197.mjs:1268-1272
// ============================================

// ORIGINAL (for source lookup):
let y1 = H.strictMcpConfig || !1;
if (pg1()) {
    if (y1) process.stderr.write(H6.red("You cannot use --strict-mcp-config when an enterprise MCP config is present")), process.exit(1);
    if (x1 && !hn4(x1)) process.stderr.write(H6.red("You cannot dynamically configure MCP servers when an enterprise MCP config is present")), process.exit(1)
}

// READABLE (for understanding):
let strictMcpConfig = options.strictMcpConfig || false;

// Enterprise config checks
if (hasEnterpriseMcpConfig()) {
    if (strictMcpConfig) {
        console.error("You cannot use --strict-mcp-config when an enterprise MCP config is present");
        process.exit(1);
    }
    if (dynamicMcpConfig && !isEmptyConfig(dynamicMcpConfig)) {
        console.error("You cannot dynamically configure MCP servers when an enterprise MCP config is present");
        process.exit(1);
    }
}

// Mapping: y1→strictMcpConfig, pg1→hasEnterpriseMcpConfig, hn4→isEmptyConfig
```

### 3.2 Strict Mode vs Normal Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                STRICT VS NORMAL MCP CONFIG MODES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Normal Mode (--mcp-config only)                                             │
│  ───────────────────────────────                                             │
│  1. Load user MCP config (~/.claude/settings.json)                          │
│  2. Load project MCP config (.claude/settings.json)                         │
│  3. Load CLI MCP config (--mcp-config)                                      │
│  4. Merge all (CLI takes precedence)                                        │
│                                                                              │
│  Strict Mode (--mcp-config --strict-mcp-config)                              │
│  ────────────────────────────────────────────                                │
│  1. Load ONLY CLI MCP config (--mcp-config)                                 │
│  2. Ignore all other sources                                                │
│  3. No merging with user/project configs                                    │
│                                                                              │
│  Enterprise Mode (enterprise MCP config present)                             │
│  ─────────────────────────────────────────────                               │
│  1. --strict-mcp-config is NOT allowed                                       │
│  2. Dynamic MCP config is NOT allowed                                        │
│  3. Only enterprise config is used                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Permission Prompt Tool

### 4.1 Permission Prompt Tool Flag

**What it does:** Specifies an MCP tool to use for permission prompts, enabling external permission handling in SDK mode.

**Source location:** `chunks.197.mjs:1019`

```javascript
// ============================================
// --permission-prompt-tool flag
// Location: chunks.197.mjs:1019
// ============================================

// ORIGINAL (for source lookup):
.addOption(new J5("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp())

// READABLE (for understanding):
.addOption(new Option("--permission-prompt-tool <tool>",
    "MCP tool to use for permission prompts (only works with --print)")
    .argParser(String)
    .hideHelp())
```

### 4.2 Permission Prompt Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               PERMISSION PROMPT TOOL EXECUTION FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool Permission Check                                                       │
│  │                                                                          │
│  ├─► Permission required?                                                   │
│  │   │                                                                      │
│  │   ├─► NO → Allow tool execution                                         │
│  │   │                                                                      │
│  │   └─► YES → permission-prompt-tool set?                                 │
│  │       │                                                                  │
│  │       ├─► YES → Call MCP tool with permission request                   │
│  │       │       │                                                          │
│  │       │       ├─► Tool returns "allow" → Execute tool                   │
│  │       │       ├─► Tool returns "deny" → Block tool                      │
│  │       │       └─► Tool error → Fall back to default prompt              │
│  │       │                                                                  │
│  │       └─► NO → Use default permission prompt (interactive/plan mode)    │
│  │                                                                          │
│  └─► Continue execution                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. MCP Subcommands

### 5.1 MCP Subcommand Structure

The CLI provides MCP-specific subcommands under `claude mcp`:

**Source location:** `chunks.197.mjs:1957-1990` (approximate)

| Subcommand | Description |
|------------|-------------|
| `claude mcp serve` | Start Claude Code as an MCP server |
| `claude mcp add` | Add MCP server interactively |
| `claude mcp add-json` | Add MCP server from JSON string |
| `claude mcp remove` | Remove an MCP server |
| `claude mcp list` | List configured MCP servers |

### 5.2 MCP Add Example

```bash
# Add MCP server interactively
claude mcp add

# Add from JSON string
claude mcp add-json '{"name": "my-server", "command": "node", "args": ["server.js"]}'

# List servers
claude mcp list

# Remove server
claude mcp remove my-server
```

### 5.3 MCP Serve Mode

```bash
# Start Claude Code as MCP server
claude mcp serve

# Exposes Claude Code tools as MCP tools
# - Read, Write, Edit, Bash, etc.
# - For use by other MCP clients
```

---

## 6. MCP Configuration Format

### 6.1 Server Definition

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      },
      "cwd": "/path/to/server",
      "disabled": false
    }
  }
}
```

### 6.2 Config Sources Priority

| Priority | Source | Scope |
|----------|--------|-------|
| 1 | Enterprise policy | `enterprise` |
| 2 | CLI `--mcp-config` | `dynamic` |
| 3 | Project `.claude/settings.json` | `project` |
| 4 | User `~/.claude/settings.json` | `user` |

---

## 7. Use Cases

### 7.1 Load Single MCP Server

```bash
# Load from file
claude --mcp-config /path/to/mcp-config.json "Use the custom tools"

# Load from JSON string
claude --mcp-config '{"mcpServers":{"my-server":{"command":"node","args":["server.js"]}}}' "Use custom tools"
```

### 7.2 Load Multiple MCP Servers

```bash
# Load multiple config files
claude --mcp-config config1.json config2.json "Use all tools"

# Mix file and JSON string
claude --mcp-config '{"mcpServers":{"quick":"node quick.js"}}' /path/to/config.json
```

### 7.3 Strict Mode for Isolation

```bash
# Use only specified MCP servers
claude --mcp-config my-tools.json --strict-mcp-config "Isolated environment"
```

### 7.4 Permission Prompt via MCP

```bash
# Use MCP tool for permission prompts in SDK mode
claude -p --permission-prompt-tool "my-mcp/permission-prompt" "Automated task"
```

### 7.5 MCP Server Management

```bash
# Add server interactively
claude mcp add

# List all configured servers
claude mcp list

# Remove a server
claude mcp remove my-server
```

---

## 8. Error Handling

### 8.1 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid MCP configuration` | Malformed JSON | Validate JSON syntax |
| `"claude-code" is a reserved MCP name` | Using reserved name | Use different server name |
| `Cannot use --strict-mcp-config with enterprise config` | Enterprise policy conflict | Remove strict flag |
| `Cannot dynamically configure MCP with enterprise config` | Enterprise restriction | Use only enterprise servers |

---

## 9. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.197.mjs:1019` | Commander options |
| Config parsing | `chunks.197.mjs:1179` | JSON/file loading |
| Strict mode | `chunks.197.mjs:1268` | Enterprise checks |
| Permission tool | `chunks.197.mjs:1019` | MCP permission handling |
| MCP subcommands | `chunks.197.mjs:1957` | MCP management commands |
