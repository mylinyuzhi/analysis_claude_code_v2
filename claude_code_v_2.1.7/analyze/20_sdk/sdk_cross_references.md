# SDK Cross-References (Claude Code 2.1.7)

> Analysis of SDK integration points with Plan Mode, Tools, System Reminders, and Agent Loop.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK Transport module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop module

---

## 1. SDK ↔ System Prompt Integration

### SDK Identity Selection

The system prompt's identity section changes based on SDK mode:

```javascript
// ============================================
// getAgentIdentity - SDK-aware identity selection
// Location: chunks.58.mjs:3251-3258
// ============================================

// ORIGINAL (for source lookup):
function EB1(A) {
  if (R4() === "vertex") return l10;
  if (A?.isNonInteractive) {
    if (A.hasAppendSystemPrompt) return XCB;
    return ICB
  }
  return l10
}

// READABLE (for understanding):
function getAgentIdentity(context) {
  // Vertex AI always uses standard CLI identity
  if (getActiveProvider() === "vertex") {
    return CLI_IDENTITY;
  }

  // SDK mode (non-interactive)
  if (context?.isNonInteractive) {
    // If SDK provides custom appendSystemPrompt, use Claude Code + SDK identity
    if (context.hasAppendSystemPrompt) {
      return SDK_CLI_IDENTITY;
    }
    // Otherwise, use pure SDK agent identity
    return SDK_AGENT_IDENTITY;
  }

  // Interactive CLI
  return CLI_IDENTITY;
}

// Mapping: EB1→getAgentIdentity, A→context, R4→getActiveProvider
```

### Identity Constants

| Constant | Symbol | Value |
|----------|--------|-------|
| `CLI_IDENTITY` | l10 | "You are Claude Code, Anthropic's official CLI for Claude." |
| `SDK_CLI_IDENTITY` | XCB | "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK." |
| `SDK_AGENT_IDENTITY` | ICB | "You are a Claude agent, built on Anthropic's Claude Agent SDK." |

### Decision Tree

```
┌────────────────────────────────────────────────────────────────┐
│                   Identity Selection Logic                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Is provider "vertex"?                                          │
│       │                                                         │
│       ├── YES ──► l10 (CLI_IDENTITY)                           │
│       │                                                         │
│       └── NO                                                    │
│            │                                                    │
│            ▼                                                    │
│       Is non-interactive mode?                                  │
│            │                                                    │
│            ├── NO ──► l10 (CLI_IDENTITY)                       │
│            │                                                    │
│            └── YES                                              │
│                 │                                               │
│                 ▼                                               │
│            Has appendSystemPrompt?                              │
│                 │                                               │
│                 ├── YES ──► XCB (SDK_CLI_IDENTITY)             │
│                 │          "Claude Code + SDK"                  │
│                 │                                               │
│                 └── NO ──► ICB (SDK_AGENT_IDENTITY)            │
│                           "Pure SDK Agent"                      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. SDK ↔ Agent Loop Integration

### v19 - SDK Agent Loop Generator

The `v19` function is the main agent loop for SDK mode. It wraps `aN` (coreMessageLoop) with SDK-specific handling.

```javascript
// ============================================
// v19 - SDK Agent Loop Generator
// Location: chunks.135.mjs:3-255
// ============================================

// Key SDK-specific parameters:
async function* v19({
  // ... standard params ...
  setSDKStatus: x,          // Callback to update SDK status
  orphanedPermission: b     // Orphaned permission from previous session
}) {
  // Context passed to coreMessageLoop
  let bA = {
    // ...
    isNonInteractiveSession: true,  // Key SDK flag
    setSDKStatus: x                 // Status callback
  };

  // ...
}
```

### setSDKStatus Callback Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      setSDKStatus Callback Flow                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LR7 (SDK Loop)                                                          │
│      │                                                                   │
│      │ Creates callback:                                                 │
│      │ setSDKStatus: (status) => {                                       │
│      │   H.enqueue({                                                     │
│      │     type: "system",                                               │
│      │     subtype: "status",                                            │
│      │     status: status                                                │
│      │   })                                                              │
│      │ }                                                                 │
│      │                                                                   │
│      ▼                                                                   │
│  v19 (Agent Loop)                                                        │
│      │                                                                   │
│      │ Passes to context:                                                │
│      │ bA.setSDKStatus = x                                               │
│      │                                                                   │
│      ▼                                                                   │
│  aN (Core Loop)                                                          │
│      │                                                                   │
│      │ Calls during compaction:                                          │
│      │ setSDKStatus?.("compacting")                                      │
│      │                                                                   │
│      ▼                                                                   │
│  khA (AsyncMessageQueue)                                                 │
│      │                                                                   │
│      │ Enqueues status message                                           │
│      │                                                                   │
│      ▼                                                                   │
│  SDK Client                                                              │
│      │                                                                   │
│      │ Receives:                                                         │
│      │ {"type":"system","subtype":"status","status":"compacting"}        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Status Values

| Status | When Emitted | Source |
|--------|--------------|--------|
| `"compacting"` | During auto-compaction | chunks.132.mjs:501 |
| `null` | After compaction completes | chunks.132.mjs:577 |

---

## 3. SDK ↔ Tool Permission Integration

### Permission Callback Chain

```javascript
// ============================================
// Permission Callback Chain
// Location: chunks.155.mjs:3289, chunks.135.mjs:34-44
// ============================================

// 1. LR7 creates canUseTool from transport
canUseTool: Y,  // From MR7 or transport.createCanUseTool()

// 2. v19 wraps it with permission denial tracking
let AA = async (tool, input, context, globals, toolUseId, querySource) => {
  const result = await canUseTool(tool, input, context, globals, toolUseId, querySource);

  if (result.behavior !== "allow") {
    // Track permission denial for result message
    const denial = {
      tool_name: tool.name,
      tool_use_id: toolUseId,
      tool_input: input
    };
    permissionDenials.push(denial);
  }

  return result;
};

// 3. AA is passed to aN (coreMessageLoop) as canUseTool
for await (let message of aN({
  // ...
  canUseTool: AA,
  // ...
})) {
  // ...
}
```

### Permission Denial Tracking

Permission denials are collected and included in the final result message:

```json
{
  "type": "result",
  "subtype": "success",
  "permission_denials": [
    {
      "tool_name": "Bash",
      "tool_use_id": "tool-uuid",
      "tool_input": {"command": "rm -rf /"}
    }
  ]
}
```

---

## 4. SDK ↔ Plan Mode Integration

### Plan Mode Exclusion in SDK

The `claude-code-guide` agent is excluded in SDK mode:

```javascript
// ============================================
// Agent Exclusion for SDK Mode
// Location: chunks.93.mjs:460
// ============================================

// ORIGINAL:
if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
  A.push(z52);  // Add claude-code-guide agent
}

// READABLE:
// claude-code-guide agent is only added for non-SDK modes
// because SDK clients typically don't need help with Claude Code usage
if (!isSdkMode()) {
  builtInAgents.push(claudeCodeGuideAgent);
}
```

### Plan Mode in SDK

Plan mode is fully supported in SDK mode but with some differences:

1. **EnterPlanMode tool** - Available in SDK mode
2. **ExitPlanMode tool** - Available in SDK mode
3. **Plan attachments** - Generated normally
4. **Plan file** - Created in working directory

The key difference is that plan approval happens via SDK protocol instead of interactive prompts.

---

## 5. SDK ↔ Session Management Integration

### Session Loading (jR7)

```javascript
// ============================================
// loadInitialMessages - Session loading for SDK
// Location: chunks.156.mjs:3-62
// ============================================

// READABLE (for understanding):
async function loadInitialMessages(setAppState, options) {
  const isPersistenceEnabled = !isSessionPersistenceDisabled();

  // Option 1: --continue (resume last session)
  if (options.continue) {
    try {
      telemetry("tengu_continue_print", {});
      const session = await loadConversation(undefined, undefined);
      if (session) {
        if (!options.forkSession && session.sessionId) {
          setSessionId(getSessionKey(session.sessionId));
          if (isPersistenceEnabled) await initializeSessionStorage();
        }
        restoreFileHistory(session.fileHistorySnapshots, setAppState);
        return session.messages;
      }
    } catch (error) {
      logError(error);
      exit(1);
      return [];
    }
  }

  // Option 2: --teleport (resume from remote session)
  if (options.teleport) {
    try {
      telemetry("tengu_teleport_print", {});
      if (typeof options.teleport !== "string") {
        throw Error("No session ID provided for teleport");
      }
      await initializeTeleportSession();
      const session = await fetchTeleportedSession(options.teleport);
      const { branchError } = await applyBranch(session.branch);
      return reconstructMessages(session.log, branchError);
    } catch (error) {
      logError(error);
      exit(1);
      return [];
    }
  }

  // Option 3: --resume (resume specific session)
  if (options.resume) {
    try {
      telemetry("tengu_resume_print", {});
      const parsed = parseResumeTarget(typeof options.resume === "string" ? options.resume : "");

      if (!parsed) {
        process.stderr.write("Error: --resume requires a valid session ID\n");
        exit(1);
        return [];
      }

      // Handle URL-based resume (WebSocket reconnect)
      if (parsed.isUrl && parsed.ingressUrl) {
        await setupWebSocketSession(parsed.sessionId, parsed.ingressUrl);
      }

      const session = await loadConversation(parsed.sessionId, parsed.jsonlFile);

      if (!session) {
        if (parsed.isUrl) {
          return await waitForInitialMessages("startup");
        }
        process.stderr.write(`No conversation found: ${parsed.sessionId}\n`);
        exit(1);
        return [];
      }

      // Handle --resume-session-at (resume from specific message)
      if (options.resumeSessionAt) {
        const messageIndex = session.messages.findIndex(
          (msg) => msg.uuid === options.resumeSessionAt
        );
        if (messageIndex < 0) {
          process.stderr.write(`No message found: ${options.resumeSessionAt}\n`);
          exit(1);
          return [];
        }
        session.messages = session.messages.slice(0, messageIndex + 1);
      }

      if (!options.forkSession && session.sessionId) {
        setSessionId(getSessionKey(session.sessionId));
        if (isPersistenceEnabled) await initializeSessionStorage();
      }

      restoreFileHistory(session.fileHistorySnapshots, setAppState);
      return session.messages;
    } catch (error) {
      logError(error);
      process.stderr.write("Failed to resume session\n");
      exit(1);
      return [];
    }
  }

  // Default: Wait for initial messages from SDK
  return await waitForInitialMessages("startup");
}

// Mapping: jR7→loadInitialMessages
```

### Resume Target Parsing

```javascript
// ============================================
// parseResumeTarget - Parse --resume argument
// Location: chunks.155.mjs:3061-3088
// ============================================

// READABLE:
function parseResumeTarget(resumeArg) {
  try {
    // Try as URL (WebSocket reconnect)
    const url = new URL(resumeArg);
    return {
      sessionId: generateSessionId(),
      ingressUrl: url.href,
      isUrl: true,
      jsonlFile: null,
      isJsonlFile: false
    };
  } catch {
    // Check if valid UUID (session ID)
    if (isValidUUID(resumeArg)) {
      return {
        sessionId: resumeArg,
        ingressUrl: null,
        isUrl: false,
        jsonlFile: null,
        isJsonlFile: false
      };
    }

    // Check if .jsonl file path
    if (resumeArg.endsWith(".jsonl")) {
      return {
        sessionId: generateSessionId(),
        ingressUrl: null,
        isUrl: false,
        jsonlFile: resumeArg,
        isJsonlFile: true
      };
    }
  }
  return null;
}

// Mapping: vw9→parseResumeTarget
```

---

## 6. SDK ↔ Message Deduplication

### Deduplication Flow

```javascript
// ============================================
// Message Deduplication
// Location: chunks.148.mjs:1393-1395, chunks.155.mjs:3442-3453
// ============================================

// isDuplicateMessage - Check persistent storage
async function isDuplicateMessage(sessionId, messageUuid) {
  const processedUuids = await getProcessedMessageUuids(sessionId);
  return processedUuids.has(messageUuid);
}

// bw9 - In-memory dedup set (session-scoped)
const processedUuidsInMemory = new Set();

// LR7 deduplication logic:
if (input.uuid) {
  const sessionId = getSessionId();

  // Check both persistent and in-memory
  if (await isDuplicateMessage(sessionId, input.uuid) ||
      processedUuidsInMemory.has(input.uuid)) {

    log(`Skipping duplicate: ${input.uuid}`);

    // Echo replay if enabled
    if (options.replayUserMessages) {
      outputQueue.enqueue({
        type: "user",
        message: input.message,
        session_id: sessionId,
        uuid: input.uuid,
        isReplay: true
      });
    }
    continue;  // Skip processing
  }

  // Mark as processed
  processedUuidsInMemory.add(input.uuid);
}

// Mapping: pJ9→isDuplicateMessage, bw9→processedUuidsInMemory
```

### Deduplication Purpose

| Scenario | Why Needed |
|----------|------------|
| WebSocket reconnect | Replayed messages after disconnect |
| Session resume | Messages already in history |
| Network retry | SDK retrying after timeout |

---

## 7. SDK ↔ Compact Integration

### Compact Status Notification

During auto-compaction, SDK clients receive status updates:

```javascript
// ============================================
// Compact Status Updates
// Location: chunks.132.mjs:501, 577
// ============================================

// Before compaction:
setSpinnerMessage?.("Running PreCompact hooks...");
setSDKStatus?.("compacting");

// After compaction:
setStreamMode?.("requesting");
setResponseLength?.(() => 0);
setSpinnerMessage?.(null);
setSDKStatus?.(null);
```

---

## 8. SDK ↔ Hook Integration

### Hook Callback Registration

```javascript
// ============================================
// SDK Hook Registration
// Location: chunks.155.mjs:3554-3566
// ============================================

// Initialize request with hooks
if (request.hooks) {
  const hookConfigs = {};

  for (const [eventName, hookDefs] of Object.entries(request.hooks)) {
    hookConfigs[eventName] = hookDefs.map((def) => {
      // Convert SDK hook callback IDs to actual callbacks
      const callbacks = def.hookCallbackIds.map((callbackId) => {
        return transport.createHookCallback(callbackId, def.timeout);
      });

      return {
        matcher: def.matcher,
        hooks: callbacks
      };
    });
  }

  registerHooks(hookConfigs);
}
```

### Hook Types Supported via SDK

| Hook Event | SDK Support | Notes |
|------------|-------------|-------|
| `SessionStart` | ✅ | Via initialize request |
| `PreToolUse` | ✅ | Via hook_callback control |
| `PostToolUse` | ✅ | Via hook_callback control |
| `PreCompact` | ✅ | Via hook_callback control |
| `PostCompact` | ✅ | Via hook_callback control |
| `Stop` | ✅ | Via hook_callback control |

---

## 9. SDK ↔ MCP Integration

### SDK MCP Server Type

```javascript
// ============================================
// SDK MCP Server Configuration
// Location: chunks.155.mjs:3385-3389
// ============================================

// Initialize request with SDK MCP servers
if (request.sdkMcpServers && request.sdkMcpServers.length > 0) {
  for (const serverName of request.sdkMcpServers) {
    mcpConfigs[serverName] = {
      type: "sdk",
      name: serverName
    };
  }
}

// SDK server messages are routed via sendMcpMessage
```

### MCP Message Routing

```
┌────────────────────────────────────────────────────────────────┐
│                    SDK MCP Message Routing                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SDK Client                Transport              MCP Server    │
│      │                         │                      │         │
│      │ control_request         │                      │         │
│      │ {mcp_message}           │                      │         │
│      │───────────────────────► │                      │         │
│      │                         │                      │         │
│      │                         │ sendMcpMessage()     │         │
│      │                         │─────────────────────►│         │
│      │                         │                      │         │
│      │                         │ mcp_response         │         │
│      │                         │◄─────────────────────│         │
│      │                         │                      │         │
│      │ control_response        │                      │         │
│      │ {mcp_response}          │                      │         │
│      │◄─────────────────────── │                      │         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 10. Telemetry Integration

### SDK Telemetry Fields

```javascript
// ============================================
// SDK Telemetry Metadata
// Location: chunks.46.mjs:2727-2731, chunks.133.mjs:2857
// ============================================

// Session metadata includes SDK info
const telemetryMetadata = {
  // ...
  ...(process.env.CLAUDE_CODE_ENTRYPOINT && {
    entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT
  }),
  ...(process.env.CLAUDE_AGENT_SDK_VERSION && {
    agentSdkVersion: process.env.CLAUDE_AGENT_SDK_VERSION
  })
};

// Compact telemetry includes entrypoint
if (process.env.CLAUDE_CODE_ENTRYPOINT) {
  compactEvent.entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
}
```

### User-Agent String

```javascript
// ============================================
// User-Agent with SDK Version
// Location: chunks.46.mjs:2011-2012
// ============================================

function buildUserAgent() {
  const sdkVersion = process.env.CLAUDE_AGENT_SDK_VERSION
    ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}`
    : "";

  return `claude-cli/${VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${sdkVersion})`;
}

// Example: "claude-cli/2.1.7 (external, sdk-py, agent-sdk/0.1.0)"
```

---

## Summary Table

| Integration Point | SDK Symbol | Cross-Reference |
|-------------------|------------|-----------------|
| System Prompt | EB1, XCB, ICB | [04_system_reminder/](../04_system_reminder/) |
| Agent Loop | v19 | [03_llm_core/agent_loop.md](../03_llm_core/) |
| Core Loop | aN | [03_llm_core/agent_loop.md](../03_llm_core/) |
| Tool Permissions | createCanUseTool | [18_sandbox/](../18_sandbox/) |
| Plan Mode | z52 exclusion | [12_plan_mode/](../12_plan_mode/) |
| Session Loading | jR7 | [15_state_management/](../15_state_management/) |
| Deduplication | pJ9, bw9 | [15_state_management/](../15_state_management/) |
| Compact Status | setSDKStatus | [07_compact/](../07_compact/) |
| Hooks | createHookCallback | [11_hook/](../11_hook/) |
| MCP Routing | sendMcpMessage | [06_mcp/](../06_mcp/) |
| Telemetry | entrypoint, agentSdkVersion | [17_telemetry/](../17_telemetry/) |

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Transport implementation
- [message_protocol.md](./message_protocol.md) - Message types
- [control_protocol.md](./control_protocol.md) - Control protocol
- [output_pipeline.md](./output_pipeline.md) - Output pipeline
