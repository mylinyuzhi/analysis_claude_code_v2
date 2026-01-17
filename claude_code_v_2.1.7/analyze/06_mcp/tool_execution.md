# MCP Tool Execution

## Overview

This document covers the MCP tool calling process including timeout handling, progress monitoring, result processing, and error handling.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Tool Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MCP Tool Execution Flow                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Tool Call Request                                                  │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ zr2 (executeMcpTool)                                        │   │
│  │ - Start 30-second progress timer                            │   │
│  │ - Get timeout from U3A() (default: 100M ms)                 │   │
│  │ - Create timeout promise                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Promise.race([                                              │   │
│  │   client.callTool({name, arguments, _meta}),               │   │
│  │   timeoutPromise                                            │   │
│  │ ])                                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│       │                                                             │
│       ├─── Success ───▶ tB7 (processToolResult)                    │
│       │                      │                                      │
│       │                      ▼                                      │
│       │               sq0 (normalizeResponse)                       │
│       │                      │                                      │
│       │                      ▼                                      │
│       │               Size check & truncation                       │
│       │                                                             │
│       ├─── Error ────▶ Extract error message                       │
│       │                      │                                      │
│       │                      ▼                                      │
│       │               Log and throw                                 │
│       │                                                             │
│       └─── Abort ────▶ Silent return (user cancellation)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Main Tool Execution Function

### zr2 - Execute MCP Tool

**Location:** `chunks.131.mjs:1369-1433`

```javascript
// ============================================
// zr2 - executeMcpTool
// Location: chunks.131.mjs:1369-1433
// ============================================

// ORIGINAL (for source lookup):
async function zr2({
  client: { client: A, name: Q },
  tool: B,
  args: G,
  meta: Z,
  signal: Y
}) {
  let J = Date.now(), X, I;
  try {
    if (i0(Q, `Calling MCP tool: ${B}`), X = setInterval(() => {
        let z = Date.now() - J, O = `${Math.floor(z/1000)}s`;
        i0(Q, `Tool '${B}' still running (${O} elapsed)`)
      }, 30000), E42()) I = setInterval(() => { H42() }, 50000);
    let D = U3A(),
      W, K = new Promise((z, $) => {
        W = setTimeout(() => {
          $(Error(`MCP tool call '${B}' timed out after ${Math.floor(D/1000)}s`))
        }, D)
      }),
      V = await Promise.race([A.callTool({
        name: B, arguments: G, _meta: Z
      }, iC, { signal: Y, timeout: D }), K]).finally(() => {
        if (W) clearTimeout(W)
      });
    if ("isError" in V && V.isError) {
      let z = "Unknown error";
      if ("content" in V && Array.isArray(V.content) && V.content.length > 0) {
        let $ = V.content[0];
        if ($ && typeof $ === "object" && "text" in $) z = $.text
      } else if ("error" in V) z = String(V.error);
      throw NZ(Q, z), Error(z)
    }
    let F = Date.now() - J,
      H = F < 1000 ? `${F}ms` : F < 60000 ? `${Math.floor(F/1000)}s` : `${Math.floor(F/60000)}m ${Math.floor(F%60000/1000)}s`;
    i0(Q, `Tool '${B}' completed successfully in ${H}`);
    let E = w42(Q);
    if (E) l("tengu_code_indexing_tool_used", { tool: E, source: "mcp", success: !0 });
    return await tB7(V, B, Q)
  } catch (D) {
    if (X !== void 0) clearInterval(X);
    if (I !== void 0) clearInterval(I);
    let W = Date.now() - J;
    if (D instanceof Error && D.name !== "AbortError")
      i0(Q, `Tool '${B}' failed after ${Math.floor(W/1000)}s: ${D.message}`);
    if (!(D instanceof Error) || D.name !== "AbortError") throw D
  } finally {
    if (X !== void 0) clearInterval(X);
    if (I !== void 0) clearInterval(I)
  }
}

// READABLE (for understanding):
async function executeMcpTool({
  client: { client: mcpClient, name: serverName },
  tool: toolName,
  args: toolArguments,
  meta: metadata,
  signal: abortSignal
}) {
  let startTime = Date.now();
  let progressInterval, keepAliveInterval;

  try {
    // Step 1: Log tool call initiation
    logMcpDebug(serverName, `Calling MCP tool: ${toolName}`);

    // Step 2: Setup 30-second progress monitoring
    progressInterval = setInterval(() => {
      let elapsedMs = Date.now() - startTime;
      let elapsedStr = `${Math.floor(elapsedMs / 1000)}s`;
      logMcpDebug(serverName, `Tool '${toolName}' still running (${elapsedStr} elapsed)`);
    }, 30000);

    // Step 3: Setup keep-alive if enabled (50s interval)
    if (isKeepAliveEnabled()) {
      keepAliveInterval = setInterval(() => {
        sendKeepAlive();
      }, 50000);
    }

    // Step 4: Get timeout (default: 100M ms ~ 27 hours)
    let toolTimeout = getMCPToolTimeout();

    // Step 5: Create timeout promise
    let timeoutHandle;
    let timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(Error(`MCP tool call '${toolName}' timed out after ${Math.floor(toolTimeout/1000)}s`));
      }, toolTimeout);
    });

    // Step 6: Execute tool call with race against timeout
    let toolResult = await Promise.race([
      mcpClient.callTool({
        name: toolName,
        arguments: toolArguments,
        _meta: metadata
      }, toolResultSchema, {
        signal: abortSignal,
        timeout: toolTimeout
      }),
      timeoutPromise
    ]).finally(() => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    });

    // Step 7: Check for error response
    if ("isError" in toolResult && toolResult.isError) {
      let errorMessage = "Unknown error";

      // Extract error from content or error property
      if ("content" in toolResult && Array.isArray(toolResult.content) && toolResult.content.length > 0) {
        let firstContent = toolResult.content[0];
        if (firstContent && typeof firstContent === "object" && "text" in firstContent) {
          errorMessage = firstContent.text;
        }
      } else if ("error" in toolResult) {
        errorMessage = String(toolResult.error);
      }

      throw logMcpError(serverName, errorMessage), Error(errorMessage);
    }

    // Step 8: Format duration for logging
    let totalTime = Date.now() - startTime;
    let durationStr = totalTime < 1000 ? `${totalTime}ms` :
                      totalTime < 60000 ? `${Math.floor(totalTime / 1000)}s` :
                      `${Math.floor(totalTime / 60000)}m ${Math.floor(totalTime % 60000 / 1000)}s`;

    logMcpDebug(serverName, `Tool '${toolName}' completed successfully in ${durationStr}`);

    // Step 9: Emit telemetry if applicable
    let indexingTool = mapToIndexingTool(serverName);
    if (indexingTool) {
      trackEvent("tengu_code_indexing_tool_used", {
        tool: indexingTool,
        source: "mcp",
        success: true
      });
    }

    // Step 10: Process and return result
    return await processToolResult(toolResult, toolName, serverName);

  } catch (error) {
    // Clean up intervals
    if (progressInterval !== undefined) clearInterval(progressInterval);
    if (keepAliveInterval !== undefined) clearInterval(keepAliveInterval);

    let totalTime = Date.now() - startTime;

    // Log errors (except AbortError which is expected during cancellation)
    if (error instanceof Error && error.name !== "AbortError") {
      logMcpDebug(serverName, `Tool '${toolName}' failed after ${Math.floor(totalTime / 1000)}s: ${error.message}`);
    }

    // Re-throw unless it was an abort
    if (!(error instanceof Error) || error.name !== "AbortError") {
      throw error;
    }

  } finally {
    // Always clean up intervals
    if (progressInterval !== undefined) clearInterval(progressInterval);
    if (keepAliveInterval !== undefined) clearInterval(keepAliveInterval);
  }
}

// Mapping: zr2→executeMcpTool, A→mcpClient, Q→serverName, B→toolName
// G→toolArguments, Z→metadata, Y→abortSignal
// U3A→getMCPToolTimeout, iC→toolResultSchema, i0→logMcpDebug, NZ→logMcpError
// E42→isKeepAliveEnabled, H42→sendKeepAlive, w42→mapToIndexingTool, l→trackEvent
// tB7→processToolResult
```

**Key Decision: 30-Second Progress Logging**

**How it works:**
1. Start a 30-second interval timer at tool call start
2. Each interval logs elapsed time
3. Timer is cleared on completion, error, or abort
4. `finally` block ensures cleanup even on exceptions

**Why this approach:**
- Prevents "silent hangs" - users see progress
- 30-second interval balances feedback with log volume
- Helps identify slow or stuck tools
- Non-blocking - doesn't affect tool execution

---

## Timeout Configuration

### U3A - Get MCP Tool Timeout

**Location:** `chunks.148.mjs:3508-3510`

```javascript
// ============================================
// U3A - getMCPToolTimeout
// Location: chunks.148.mjs:3508-3510
// ============================================

// Constants
$C7 = 100000000  // 100 million milliseconds (~27 hours)

// ORIGINAL:
function U3A() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || $C7
}

// READABLE:
function getMCPToolTimeout() {
  // Default: 100,000,000 ms (approximately 27 hours - effectively unlimited)
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 100000000;
}

// Mapping: U3A→getMCPToolTimeout, $C7→DEFAULT_MCP_TOOL_TIMEOUT
```

**Why effectively unlimited timeout:**
- MCP tools can be long-running (data processing, complex queries)
- User has control via Ctrl+C to abort
- Prevents premature termination of legitimate operations
- Can be overridden via `MCP_TOOL_TIMEOUT` environment variable

---

## Result Processing

### tB7 - Process Tool Result

**Location:** `chunks.131.mjs:1349-1367`

```javascript
// ============================================
// tB7 - processToolResult
// Location: chunks.131.mjs:1349-1367
// ============================================

// ORIGINAL:
async function tB7(A, Q, B) {
  let {
    content: G,
    type: Z,
    schema: Y
  } = await sq0(A, Q, B);
  if (B === "ide") return G;
  if (!await ixA(G)) return G;
  if (iX(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) return await hX0(G);
  if (!G) return G;
  if (sB7(G)) return await hX0(G);
  let J = Date.now(),
    X = `mcp-${e3(B)}-${e3(Q)}-${J}`,
    I = typeof G === "string" ? G : eA(G, null, 2),
    D = await Z4A(I, X);
  if (Y4A(D)) return `Error: result (${I.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${D.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  let W = QZ1(Z, Y);
  return BZ1(D.filepath, D.originalSize, W)
}

// READABLE:
async function processToolResult(toolResponse, toolName, serverName) {
  // Step 1: Normalize response format
  let {
    content: processedContent,
    type: contentType,
    schema: schemaInfo
  } = await normalizeToolResponse(toolResponse, toolName, serverName);

  // Step 2: IDE clients get full content (no truncation)
  if (serverName === "ide") {
    return processedContent;
  }

  // Step 3: Check if content exceeds size limit
  if (!await exceedsOutputLimit(processedContent)) {
    return processedContent;
  }

  // Step 4: If large output files disabled, save to file directly
  if (parseBooleanFalse(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) {
    return await saveToLargeOutputFile(processedContent);
  }

  // Step 5: Empty content passes through
  if (!processedContent) {
    return processedContent;
  }

  // Step 6: Content with images goes to file storage
  if (containsImages(processedContent)) {
    return await saveToLargeOutputFile(processedContent);
  }

  // Step 7: Save large text content to file
  let timestamp = Date.now();
  let fileName = `mcp-${normalizeToolName(serverName)}-${normalizeToolName(toolName)}-${timestamp}`;
  let contentString = typeof processedContent === "string"
    ? processedContent
    : JSON.stringify(processedContent, null, 2);

  let saveResult = await saveContentToFile(contentString, fileName);

  // Step 8: Handle save failure
  if (isSaveError(saveResult)) {
    return `Error: result (${contentString.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${saveResult.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  }

  // Step 9: Return file reference with metadata
  let schemaHint = formatSchemaHint(contentType, schemaInfo);
  return formatFileReference(saveResult.filepath, saveResult.originalSize, schemaHint);
}

// Mapping: tB7→processToolResult, sq0→normalizeToolResponse, ixA→exceedsOutputLimit
// iX→parseBooleanFalse, hX0→saveToLargeOutputFile, sB7→containsImages
// e3→normalizeToolName, Z4A→saveContentToFile, Y4A→isSaveError
// QZ1→formatSchemaHint, BZ1→formatFileReference
```

**Key Decision: Large Output Handling**

**How it works:**
1. Normalize response to standard format
2. IDE clients bypass size limits
3. Check if content exceeds output token limit
4. Content with images always saved to files
5. Large text content saved with metadata reference
6. Error message includes guidance on pagination

**Why this approach:**
- Prevents context overflow from large tool outputs
- Preserves full data in files for reference
- Guides LLM to use pagination when available

---

### sq0 - Normalize Tool Response

**Location:** `chunks.131.mjs:1320-1342`

```javascript
// ============================================
// sq0 - normalizeToolResponse
// Location: chunks.131.mjs:1320-1342
// ============================================

// ORIGINAL:
async function sq0(A, Q, B) {
  if (A && typeof A === "object") {
    if ("toolResult" in A) return {
      content: String(A.toolResult),
      type: "toolResult"
    };
    if ("structuredContent" in A && A.structuredContent !== void 0) return {
      content: eA(A.structuredContent),
      type: "structuredContent",
      schema: TF1(A.structuredContent)
    };
    if ("content" in A && Array.isArray(A.content)) {
      let Z = (await Promise.all(A.content.map((Y) => Er2(Y, B)))).flat();
      return {
        content: Z,
        type: "contentArray",
        schema: TF1(Z)
      }
    }
  }
  let G = `Unexpected response format from tool ${Q}`;
  throw NZ(B, G), Error(G)
}

// READABLE:
async function normalizeToolResponse(response, toolName, serverName) {
  if (response && typeof response === "object") {
    // Format 1: Simple toolResult string
    if ("toolResult" in response) {
      return {
        content: String(response.toolResult),
        type: "toolResult"
      };
    }

    // Format 2: Structured content (JSON object)
    if ("structuredContent" in response && response.structuredContent !== undefined) {
      return {
        content: JSON.stringify(response.structuredContent),
        type: "structuredContent",
        schema: summarizeSchema(response.structuredContent)
      };
    }

    // Format 3: Content array (MCP standard format)
    if ("content" in response && Array.isArray(response.content)) {
      let convertedContent = (await Promise.all(
        response.content.map((item) => convertMcpContent(item, serverName))
      )).flat();
      return {
        content: convertedContent,
        type: "contentArray",
        schema: summarizeSchema(convertedContent)
      };
    }
  }

  // Unknown format - throw error
  let errorMsg = `Unexpected response format from tool ${toolName}`;
  throw logMcpError(serverName, errorMsg), Error(errorMsg);
}

// Mapping: sq0→normalizeToolResponse, eA→JSON.stringify, TF1→summarizeSchema
// Er2→convertMcpContent
```

---

## Content Type Conversion

### Er2 - Convert MCP Content

**Location:** `chunks.131.mjs:1242-1303`

```javascript
// ============================================
// Er2 - convertMcpContent
// Location: chunks.131.mjs:1242-1303
// ============================================

// READABLE:
async function convertMcpContent(contentItem, serverName) {
  // Text content
  if (contentItem.type === "text") {
    return [{ type: "text", text: contentItem.text }];
  }

  // Image content
  if (contentItem.type === "image") {
    // Validate MIME type
    if (!SUPPORTED_IMAGE_TYPES.has(contentItem.mimeType)) {
      return [{
        type: "text",
        text: `[Unsupported image type: ${contentItem.mimeType}]`
      }];
    }

    return [{
      type: "image",
      source: {
        type: "base64",
        media_type: contentItem.mimeType,
        data: contentItem.data
      }
    }];
  }

  // Text resource
  if (contentItem.type === "resource" && contentItem.resource?.text) {
    let resourceText = `Resource: ${contentItem.resource.uri}\n${contentItem.resource.text}`;
    return [{ type: "text", text: resourceText }];
  }

  // Binary resource
  if (contentItem.type === "resource" && contentItem.resource?.blob) {
    let mimeType = contentItem.resource.mimeType || "application/octet-stream";

    if (SUPPORTED_IMAGE_TYPES.has(mimeType)) {
      return [{
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType,
          data: contentItem.resource.blob
        }
      }];
    }

    return [{
      type: "text",
      text: `[Binary resource: ${contentItem.resource.uri} (${mimeType})]`
    }];
  }

  // Resource link (URI reference)
  if (contentItem.type === "resource_link") {
    return [{
      type: "text",
      text: `Resource link: ${contentItem.uri}`
    }];
  }

  // Unknown type - pass through as text
  return [{
    type: "text",
    text: JSON.stringify(contentItem)
  }];
}

// Mapping: Er2→convertMcpContent
// nB7→SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"])
```

**Supported Content Types:**

| MCP Type | Claude Format | Notes |
|----------|---------------|-------|
| `text` | `text` block | Direct pass-through |
| `image` | `image` block | Base64 with MIME type |
| `resource` (text) | `text` block | URI + content |
| `resource` (blob) | `image` or `text` | Depends on MIME type |
| `resource_link` | `text` block | URI reference |

---

## Error Handling

### Error Detection Flow

```
Tool Result → Check isError flag → Extract message → Log & Throw
                  ↓
          [Error Sources]
          1. content[0].text (preferred)
          2. error property (fallback)
          3. "Unknown error" (default)
```

### AbortError Handling

```javascript
// AbortError is silently suppressed (expected during user cancellation)
if (!(error instanceof Error) || error.name !== "AbortError") {
  throw error;
}
```

**Why silently suppress AbortError:**
- User-initiated cancellation shouldn't show as error
- Tool was stopped intentionally, not due to failure
- Clean user experience when pressing Ctrl+C

---

## Telemetry

Tool execution emits telemetry events:

```javascript
// On successful tool execution (if applicable)
trackEvent("tengu_code_indexing_tool_used", {
  tool: indexingToolName,
  source: "mcp",
  success: true
});
```

---

## Related Symbols

Key functions in this document:
- `executeMcpTool` (zr2) - Main tool execution with timeout/progress
- `processToolResult` (tB7) - Result processing and size handling
- `normalizeToolResponse` (sq0) - Response format normalization
- `convertMcpContent` (Er2) - MCP to Claude content conversion
- `getMCPToolTimeout` (U3A) - Timeout configuration
- `DEFAULT_MCP_TOOL_TIMEOUT` ($C7) - 100M ms constant

---

## See Also

- [protocol_overview.md](./protocol_overview.md) - Architecture overview
- [server_management.md](./server_management.md) - Server configuration
- [mcp_autosearch.md](./mcp_autosearch.md) - Auto-search mode
