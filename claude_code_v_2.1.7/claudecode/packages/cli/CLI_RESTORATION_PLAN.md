# CLI Package Restoration Plan

## Goal

Make `packages/cli` a fully functional implementation that matches the behavior of the obfuscated source (`cli.chunks.mjs` + `chunks.157.mjs`).

---

## Current State Analysis

### Implemented (Working)
| File | Status | Notes |
|------|--------|-------|
| `types.ts` | ✅ Complete | All type definitions |
| `options.ts` | ✅ Complete | Option parsing |
| `ripgrep-handler.ts` | ✅ Functional | Executes embedded ripgrep |

### Partially Implemented (Stubs)
| File | Status | Missing Functionality |
|------|--------|----------------------|
| `entry.ts` | ⚠️ Stubs | `enableConfigs()`, `runMigrations()`, `loadRemoteSettings()`, `populateOAuth()`, `initializeEventLogging()` |
| `mcp-cli.ts` | ⚠️ Stubs | `initializeMcp()`, `getMcpState()`, `callMcpTool()`, `readMcpResource()`, `isRunningInEndpoint()` |
| `chrome-handlers.ts` | ⚠️ Stubs | `executeChromeTool()` - returns stub response |

---

## Key Missing Functions

### 1. MCP State Management (`me()` → `getMcpState`)

**Source Location:** Defined in cli.chunks.mjs, initialized by multiple functions

**What it returns:**
```typescript
interface McpState {
  clients: Map<string, McpClient>;      // Connected MCP servers
  tools: ToolInfo[];                     // All available tools
  resources: ResourceInfo[];             // All available resources
  normalizedNames: Map<string, string>;  // Server name normalization map
}
```

**Implementation Required:**
- Load MCP configuration from settings files
- Connect to configured MCP servers
- Aggregate tools/resources from all servers
- Handle connection failures gracefully

### 2. MCP Initialization Pipeline

**Source:** Lines 4927-5022 in cli.chunks.mjs show initialization sequence:
```javascript
A0();    // Initialize telemetry
aAA();   // Initialize config
T1();    // Setup env vars
$F();    // Initialize MCP state holder
uP0();   // Load settings
E$A();   // Initialize clients
Z3();    // Connect to servers
jN();    // Load tools
GQ();    // Load resources
...
```

**Implementation Required:**
- Settings loading (`~/.claude/settings.json`, `.claude/settings.json`)
- MCP server configuration parsing
- MCP client connection management
- Tool/resource discovery

### 3. Tool Execution (`qU7` → `callMcpTool`)

**Source Location:** cli.chunks.mjs:~5174

**Implementation Required:**
```typescript
async function callMcpTool(
  toolName: string,
  serverName: string,
  args: Record<string, unknown>,
  options: { debug?: boolean; timeout?: number }
): Promise<unknown>
```

- Find MCP client by server name
- Call `tools/call` MCP method
- Handle timeouts
- Return tool result

### 4. Resource Reading (`NU7` → `readMcpResource`)

**Source Location:** cli.chunks.mjs:~5807

**Implementation Required:**
```typescript
async function readMcpResource(
  serverName: string,
  uri: string,
  options: { debug?: boolean; timeout?: number }
): Promise<{ contents: Array<{ text?: string; blob?: string; mimeType?: string }> }>
```

### 5. Endpoint Detection (`P$` → `isRunningInEndpoint`)

**Purpose:** Check if Claude Code is already running (to forward commands via socket)

**Implementation Required:**
- Check for Claude Code state file
- Check for socket connection availability
- Return `true` if running in endpoint mode

### 6. Socket Communication (`w8A` → `sendCommand`)

**Purpose:** Forward commands to running Claude Code instance

**Implementation Required:**
- Connect to Claude Code socket
- Send command with params
- Wait for response
- Handle timeout

---

## Dependencies Required

### New Package Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.30.0",        // For MCP client
  "@modelcontextprotocol/sdk": "^1.0.0", // MCP protocol
  "chalk": "^5.0.0"                       // Terminal colors
}
```

### Internal Dependencies
```
@claudecode/core       → Settings loading, telemetry
@claudecode/mcp        → MCP client management
@claudecode/settings   → Configuration files
```

---

## Implementation Phases

### Phase 1: MCP State Foundation
**Files to modify:** `mcp-cli.ts`

1. Create `McpStateManager` class
2. Implement settings loading
3. Implement MCP client creation
4. Implement state aggregation

### Phase 2: MCP Client Connection
**Files to create:** `src/mcp/client.ts`, `src/mcp/state.ts`

1. MCP server configuration parsing
2. MCP client initialization
3. Connection management
4. Error handling

### Phase 3: Tool Execution
**Files to modify:** `mcp-cli.ts`

1. Implement `callMcpTool()`
2. Implement `readMcpResource()`
3. Add timeout handling
4. Add telemetry

### Phase 4: Endpoint Mode
**Files to create:** `src/endpoint/detection.ts`, `src/endpoint/socket.ts`

1. Implement endpoint detection
2. Implement socket communication
3. Command forwarding

### Phase 5: Configuration & Initialization
**Files to modify:** `entry.ts`

1. Implement `enableConfigs()`
2. Implement `runMigrations()`
3. Implement `loadRemoteSettings()`
4. Implement telemetry integration

---

## Source Code Mapping

### cli.chunks.mjs Key Symbols
| Symbol | Readable Name | Location | Purpose |
|--------|--------------|----------|---------|
| `de` | mcpProgram | ~5055 | Commander.js program |
| `me` | getMcpState | (imported) | Return MCP state |
| `P$` | isRunningInEndpoint | (imported) | Check endpoint mode |
| `w8A` | sendCommand | (imported) | Socket communication |
| `vuA` | executeWithTelemetry | ~5056 | Telemetry wrapper |
| `qU7` | callMcpTool | ~5174 | Execute MCP tool |
| `NU7` | readMcpResource | ~5807 | Read MCP resource |
| `M$1` | formatServerList | ~5059 | Format server list |
| `R$1` | filterTools | ~5091 | Filter tools by server |
| `j$1` | searchTools | ~5223 | Search tools by pattern |
| `T$1` | filterResources | (imported) | Filter resources |
| `rP0` | parseToolIdentifier | ~5108 | Parse server/tool |
| `_$1` | findTool | ~5120 | Find tool by name |
| `xuA` | findClient | ~5122 | Find MCP client |
| `N8A` | getServerError | ~5123 | Get server error message |
| `UU7` | getServerResources | ~5280 | Get resources for server |
| `U3A` | getDefaultTimeout | (imported) | Get MCP timeout |
| `kl` | trackTelemetry | (imported) | Send telemetry |
| `k9` | hashToolName | (imported) | Hash tool name |
| `e3` | normalizeServerName | (imported) | Normalize server name |

### chunks.157.mjs Key Symbols
| Symbol | Readable Name | Location | Purpose |
|--------|--------------|----------|---------|
| `D_7` | mainEntry | 1860-1891 | Main entry point |
| `J_7` | commandHandler | ~16-20 | Command handler |
| `nX9` | mcpCliHandler | 1582-1593 | MCP CLI handler |
| `oX9` | chromeMcpHandler | 1599-1616 | Chrome MCP handler |
| `AI9` | chromeNativeHandler | 1666-1677 | Chrome native handler |

---

## Testing Strategy

### Unit Tests
- Settings loading
- Option parsing
- Tool identifier parsing
- Server list formatting

### Integration Tests
- MCP server connection
- Tool execution
- Resource reading
- Endpoint detection

### E2E Tests
- Full CLI workflow
- `claude --mcp-cli servers`
- `claude --mcp-cli tools`
- `claude --mcp-cli call`

---

## Estimated Effort

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: MCP State | 3-4 days | P0 |
| Phase 2: MCP Client | 2-3 days | P0 |
| Phase 3: Tool Execution | 2 days | P0 |
| Phase 4: Endpoint Mode | 1-2 days | P1 |
| Phase 5: Config/Init | 2-3 days | P1 |
| Testing | 2-3 days | P0 |

**Total:** ~15-20 days of focused work

---

## Next Steps

1. **Immediate:** Set up package structure with proper exports
2. **Week 1:** Implement MCP state management (Phase 1-2)
3. **Week 2:** Implement tool execution (Phase 3)
4. **Week 3:** Implement endpoint mode and configuration (Phase 4-5)
5. **Week 4:** Testing and refinement
