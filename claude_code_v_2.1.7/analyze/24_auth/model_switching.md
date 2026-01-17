# Model Switching and Streaming Support (Claude Code 2.1.7)

## Table of Contents

1. [Model Selection Architecture](#model-selection-architecture)
2. [Model ID Resolution](#model-id-resolution)
3. [Model-Specific Configuration](#model-specific-configuration)
4. [Streaming Implementation](#streaming-implementation)
5. [Model Switching in Context](#model-switching-in-context)
6. [Provider-Specific Model Handling](#provider-specific-model-handling)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Infrastructure platform modules

Key functions in this document:
- `Lu` (getModelId) - Get normalized model ID for API
- `SD` (getSmallFastModel) - Get configured small/fast model
- `SdA` (getVertexRegion) - Get Vertex AI region for model
- `v51` (createStreamingClient) - Create streaming API client
- `BJ9` (queryWithStreaming) - Main streaming query function

---

## Model Selection Architecture

### Model Selection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Model Selection Flow                                   │
└─────────────────────────────────────────────────────────────────────────────┘

User Request / Agent Invocation
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. Determine Model Source                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Priority:                                                             │ │
│  │    1. --model CLI argument                                             │ │
│  │    2. ANTHROPIC_MODEL environment variable                             │ │
│  │    3. Session context model (from subagent/plan mode)                  │ │
│  │    4. ANTHROPIC_DEFAULT_*_MODEL env vars (sonnet/haiku/opus)           │ │
│  │    5. Default model for current context                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. Normalize Model ID                                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  - Resolve aliases (sonnet → claude-sonnet-4-20250514)                 │ │
│  │  - Handle provider-specific model IDs (Bedrock, Vertex)                │ │
│  │  - Resolve inference profiles (Bedrock)                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. Provider-Specific Configuration                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Bedrock: AWS region, inference profile resolution                     │ │
│  │  Vertex: Region-specific endpoints per model                           │ │
│  │  Foundry: Azure endpoint configuration                                 │ │
│  │  First-Party: Direct model ID                                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. Create Streaming Client                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  client.beta.messages.stream(params, { signal })                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Model ID Resolution

### Get Normalized Model ID

```javascript
// ============================================
// getModelId - Normalize model ID for API request
// Location: chunks (model utilities)
// ============================================

// READABLE (for understanding):
function getModelId(modelName) {
  // Model aliases map to full model IDs
  const MODEL_ALIASES = {
    "sonnet": "claude-sonnet-4-20250514",
    "opus": "claude-opus-4-20250514",
    "haiku": "claude-haiku-4-20250514",
    // ... more aliases
  };

  // If it's an alias, resolve it
  if (MODEL_ALIASES[modelName]) {
    return MODEL_ALIASES[modelName];
  }

  // Already a full model ID
  return modelName;
}

// Mapping: Lu→getModelId
```

### Model Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `ANTHROPIC_MODEL` | Override default model | `claude-sonnet-4-20250514` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Default Sonnet variant | `claude-sonnet-4-20250514` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Default Haiku variant | `claude-haiku-4-20250514` |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Default Opus variant | `claude-opus-4-20250514` |
| `ANTHROPIC_SMALL_FAST_MODEL` | Small/fast model for subagents | `claude-haiku-4-20250514` |

### Get Small/Fast Model

```javascript
// ============================================
// getSmallFastModel - Get configured small/fast model
// Location: chunks (model selection)
// ============================================

// READABLE (for understanding):
function getSmallFastModel() {
  // Check environment override
  if (process.env.ANTHROPIC_SMALL_FAST_MODEL) {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL;
  }

  // Check default Haiku model
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  }

  // Fall back to built-in default
  return "claude-haiku-4-20250514";
}

// Mapping: SD→getSmallFastModel
```

---

## Model-Specific Configuration

### Vertex Region Selection

```javascript
// ============================================
// getVertexRegion - Get Vertex AI region for model
// Location: chunks.82.mjs (vertex region selection)
// ============================================

// READABLE (for understanding):
function getVertexRegion(model) {
  // Model-specific region environment variables
  const regionMap = {
    "claude-3-5-haiku": process.env.VERTEX_REGION_CLAUDE_3_5_HAIKU,
    "claude-3-5-sonnet": process.env.VERTEX_REGION_CLAUDE_3_5_SONNET,
    "claude-3-7-sonnet": process.env.VERTEX_REGION_CLAUDE_3_7_SONNET,
    "claude-4-0-opus": process.env.VERTEX_REGION_CLAUDE_4_0_OPUS,
    "claude-4-0-sonnet": process.env.VERTEX_REGION_CLAUDE_4_0_SONNET,
    "claude-4-1-opus": process.env.VERTEX_REGION_CLAUDE_4_1_OPUS,
    "claude-haiku-4-5": process.env.VERTEX_REGION_CLAUDE_HAIKU_4_5
  };

  // Check for model-specific region
  for (const [modelPrefix, region] of Object.entries(regionMap)) {
    if (region && model.includes(modelPrefix)) {
      return region;
    }
  }

  // Fall back to default Vertex region
  return process.env.VERTEX_REGION || "us-central1";
}

// Mapping: SdA→getVertexRegion
```

### Bedrock Region Selection

```javascript
// ============================================
// Bedrock region selection in createApiClient
// Location: chunks.82.mjs:2667
// ============================================

// ORIGINAL (for source lookup):
let K = B === SD() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
  ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
  : lAA()

// READABLE (for understanding):
// If using small/fast model AND specific region is configured, use it
// Otherwise use default AWS region
let awsRegion = model === getSmallFastModel() &&
                process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
  ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
  : getDefaultAWSRegion();
```

### Bedrock Inference Profile Resolution

```javascript
// ============================================
// Bedrock inference profile resolution
// Location: chunks.147.mjs:10
// ============================================

// ORIGINAL (for source lookup):
let J = R4() === "bedrock" && Y.model.includes("application-inference-profile")
  ? await ieA(Y.model) ?? Y.model
  : Y.model;

// READABLE (for understanding):
// For Bedrock with inference profiles, resolve to actual model ID
let effectiveModel = getProviderType() === "bedrock" &&
                     requestedModel.includes("application-inference-profile")
  ? await resolveInferenceProfile(requestedModel) ?? requestedModel
  : requestedModel;

// Mapping: ieA→resolveInferenceProfile
```

---

## Streaming Implementation

### Streaming Query Function

```javascript
// ============================================
// queryWithStreaming - Main streaming query function
// Location: chunks.147.mjs:3-300
// ============================================

// ORIGINAL (for source lookup):
async function* BJ9(A, Q, B, G, Z, Y) {
  // ... setup code ...
  h6("query_client_creation_start");
  let jA = v51(() => XS({
      maxRetries: 0,
      model: Y.model,
      fetchOverride: Y.fetchOverride
    }), async (IA, HA, ZA) => {
      x = HA, j = Date.now();
      let zA = S(ZA);
      return vq1(zA, Y.querySource), MA = zA.max_tokens, IA.beta.messages.stream(zA, {
        signal: Z
      })
    }, {
      model: Y.model,
      fallbackModel: Y.fallbackModel,
      maxThinkingTokens: B,
      signal: Z
    })
  // ... stream processing ...
}

// READABLE (for understanding):
async function* queryWithStreaming(messages, systemPrompts, thinkingBudget, tools, abortSignal, options) {
  // Setup: Build tool schemas, normalize messages, etc.
  // ...

  // Create streaming client with retry support
  let streamIterator = createStreamingClientWithRetry(
    // Client factory
    () => createApiClient({
      maxRetries: 0,
      model: options.model,
      fetchOverride: options.fetchOverride
    }),
    // Stream factory
    async (client, retryCount, retryOptions) => {
      lastRetryCount = retryCount;
      lastAttemptTime = Date.now();

      let requestParams = buildRequestParams(retryOptions);
      logApiRequest(requestParams, options.querySource);
      maxOutputTokens = requestParams.max_tokens;

      return client.beta.messages.stream(requestParams, {
        signal: abortSignal
      });
    },
    // Retry options
    {
      model: options.model,
      fallbackModel: options.fallbackModel,
      maxThinkingTokens: thinkingBudget,
      signal: abortSignal
    }
  );

  // Process stream events
  // ...
}

// Mapping: BJ9→queryWithStreaming, v51→createStreamingClientWithRetry,
//          XS→createApiClient
```

### Stream Event Processing

```javascript
// ============================================
// Stream event types and handling
// Location: chunks.147.mjs:156-250
// ============================================

// READABLE (for understanding):
for await (let event of stream) {
  switch (event.type) {
    case "message_start":
      // Initial message metadata, usage stats
      messageMetadata = event.message;
      usage = updateUsage(usage, event.message.usage);
      break;

    case "content_block_start":
      // Start of text, tool_use, or server_tool_use block
      switch (event.content_block.type) {
        case "tool_use":
          contentBlocks[event.index] = {
            ...event.content_block,
            input: ""  // Will be filled by deltas
          };
          break;
        case "text":
          contentBlocks[event.index] = {
            type: "text",
            text: ""
          };
          break;
        case "thinking":
          contentBlocks[event.index] = {
            type: "thinking",
            thinking: ""
          };
          break;
      }
      break;

    case "content_block_delta":
      // Incremental content updates
      switch (event.delta.type) {
        case "text_delta":
          contentBlocks[event.index].text += event.delta.text;
          yield { type: "text", text: event.delta.text };
          break;
        case "input_json_delta":
          contentBlocks[event.index].input += event.delta.partial_json;
          break;
        case "thinking_delta":
          contentBlocks[event.index].thinking += event.delta.thinking;
          yield { type: "thinking", thinking: event.delta.thinking };
          break;
      }
      break;

    case "content_block_stop":
      // Content block complete
      break;

    case "message_delta":
      // Final message updates (stop_reason, usage)
      usage = updateUsage(usage, event.usage);
      break;

    case "message_stop":
      // Stream complete
      break;
  }
}
```

### Streaming Stall Detection

```javascript
// ============================================
// Streaming stall detection
// Location: chunks.147.mjs:162-175
// ============================================

// ORIGINAL (for source lookup):
let IA = !0,
  HA = null,
  ZA = 30000,  // 30 second threshold
  zA = 0,
  wA = 0;
for await (let s of b) {
  let t = Date.now();
  if (HA !== null) {
    let BA = t - HA;
    if (BA > ZA) wA++, zA += BA, k(`Streaming stall detected: ${(BA/1000).toFixed(1)}s gap between events (stall #${wA})`, {
      level: "warn"
    }), l("tengu_streaming_stall", {
      stall_duration_ms: BA,
      stall_count: wA,
      total_stall_time_ms: zA,
      event_type: s.type,
      model: Y.model,
      request_id: b.request_id ?? "unknown"
    })
  }
  HA = t;
  // ...
}

// READABLE (for understanding):
let isFirstChunk = true;
let lastEventTime = null;
let stallThreshold = 30000;  // 30 seconds
let totalStallTime = 0;
let stallCount = 0;

for await (let event of stream) {
  let now = Date.now();

  if (lastEventTime !== null) {
    let gap = now - lastEventTime;

    // Detect streaming stall (>30s between events)
    if (gap > stallThreshold) {
      stallCount++;
      totalStallTime += gap;

      logWarning(`Streaming stall detected: ${(gap/1000).toFixed(1)}s gap (stall #${stallCount})`);

      analyticsEvent("tengu_streaming_stall", {
        stall_duration_ms: gap,
        stall_count: stallCount,
        total_stall_time_ms: totalStallTime,
        event_type: event.type,
        model: options.model,
        request_id: stream.request_id ?? "unknown"
      });
    }
  }

  lastEventTime = now;

  // Track first chunk for TTFB
  if (isFirstChunk) {
    logInfo("Stream started - received first chunk");
    recordTiming("query_first_chunk_received");
    if (!options.agentId) recordFirstChunkTiming();
    notifyFirstChunk();
    isFirstChunk = false;
  }

  // Process event...
}
```

---

## Model Switching in Context

### Subagent Model Selection

```javascript
// ============================================
// Subagent model selection
// Location: subagent creation
// ============================================

// READABLE (for understanding):
function getSubagentModel(agentType, parentModel) {
  // Check for explicit subagent model override
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) {
    return process.env.CLAUDE_CODE_SUBAGENT_MODEL;
  }

  // Agent type specific model selection
  switch (agentType) {
    case "Explore":
    case "Bash":
      // Use small/fast model for quick tasks
      return getSmallFastModel();

    case "Plan":
    case "code-simplifier":
      // Use main model for complex reasoning
      return parentModel;

    default:
      // Default to small/fast model
      return getSmallFastModel();
  }
}
```

### Model Switching During Session

Model can be switched during a session via:

1. **CLI flag**: `--model` argument
2. **Environment variable**: `ANTHROPIC_MODEL`
3. **Subagent specification**: Agent-specific model in Task tool
4. **Plan mode**: May use different model for planning

```javascript
// ============================================
// Model selection in Task tool
// Location: Task tool definition
// ============================================

// Task tool allows specifying model
{
  name: "Task",
  parameters: {
    model: {
      description: "Optional model to use for this agent",
      enum: ["sonnet", "opus", "haiku"],
      type: "string"
    }
    // ...
  }
}
```

---

## Provider-Specific Model Handling

### First-Party Anthropic

```javascript
// Model ID is used directly
client.beta.messages.stream({
  model: "claude-sonnet-4-20250514",
  // ...
});
```

### AWS Bedrock

```javascript
// Model ID may need transformation for Bedrock
// Inference profiles require resolution
let bedrockModel = model.includes("application-inference-profile")
  ? await resolveInferenceProfile(model)
  : convertToBedrockModelId(model);

client.beta.messages.stream({
  model: bedrockModel,
  // ...
});
```

### Google Vertex

```javascript
// Model ID + region configuration
let vertexRegion = getVertexRegion(model);
// Region is passed to Vertex client, not in request
client.beta.messages.stream({
  model: model,  // Vertex handles model ID conversion
  // ...
});
```

### Azure Foundry

```javascript
// Model ID used with Foundry endpoint
client.beta.messages.stream({
  model: model,  // Foundry-specific model ID if needed
  // ...
});
```

---

## Beta Features and Streaming

### Beta Flags for Models

```javascript
// ============================================
// getBetasForModel - Get beta features for model
// Location: chunks.147.mjs:12
// ============================================

// READABLE (for understanding):
function getBetasForModel(model) {
  let betas = [];

  // Model-specific beta features
  if (supportsComputerUse(model)) {
    betas.push("computer-use-2024-10-22");
  }

  if (supportsContextManagement(model)) {
    betas.push("context-management-2025-01-01");
  }

  // ... more beta checks

  return betas;
}

// Mapping: KA1→getBetasForModel
```

### Streaming Tool Execution

```javascript
// ============================================
// Streaming tool execution feature flag
// Location: chunks.134.mjs:173
// ============================================

// ORIGINAL (for source lookup):
let x = f8("tengu_streaming_tool_execution2")
  ? new _H1(Y.options.tools, Z, Y)
  : null

// READABLE (for understanding):
// When streaming tool execution is enabled, create streaming executor
let streamingToolExecutor = isFeatureEnabled("tengu_streaming_tool_execution2")
  ? new StreamingToolExecutor(options.tools, context, options)
  : null;
```

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [provider_modes.md](./provider_modes.md) - Provider-specific authentication
- [token_refresh.md](./token_refresh.md) - Token refresh mechanism
