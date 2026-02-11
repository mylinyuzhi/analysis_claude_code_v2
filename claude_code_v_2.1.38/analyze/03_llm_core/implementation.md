# Module: LLM Core & Prompt Building (03/04)

## Overview

The LLM Core is the "brain" of Claude Code, responsible for orchestrating the conversation loop, managing tool schemas, building complex system prompts, and handling API requests with adaptive features like thinking and effort levels.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `llmRequestGenerator` (lOq) - Main async generator for LLM API requests and stream handling.
- `getSystemPrompt` (cq6) - Returns the appropriate base system prompt based on environment.
- `getAttributionHeader` (lq6) - Generates the versioned billing/attribution header.
- `buildSystemPromptWithCache` (F9z) - Assembles system prompts and injects cache control markers.
- `withApiRetry` (V26) - Wrapper for API calls with automatic retry and model fallback logic.

---

## Core Algorithms

### LLM Request Generation & Adaptive Configuration

**What it does:**
`llmRequestGenerator` (lOq) prepares the entire payload for the Anthropic Messages API, including message normalization, tool schema construction, prompt caching markers, and beta header selection. It then manages the streaming response.

**How it works:**
1.  **Tool Context Evaluation**: It checks if "Dynamic Tool Loading" (Deferred Tools) should be used based on the model and current state.
2.  **Global Cache Selection**:
    - If enabled, it determines if caching should be `tool_based` or `system_prompt` based.
    - For `tool_based` caching, it identifies a "stable" tool (the last non-MCP tool) to attach the `cache_control: { type: "ephemeral" }` marker.
3.  **Prompt Assembly**:
    - Combines the attribution header, base system prompt, and any extra prompts.
    - Injects available deferred tools into the message history if applicable.
4.  **Beta Header & Adaptive Feature Selection**:
    - **Adaptive Thinking**: If the model supports it, sets `thinking: { type: "adaptive" }` and adds the `adaptive-thinking-2026-01-28` beta.
    - **Effort Levels**: Injects `output_config: { effort: value }` and the `effort-2025-11-24` beta.
    - **Adaptive Fast Mode**: If eligible, adds the `research-preview-2026-02` beta.
5.  **Streaming & Stall Detection**:
    - Initiates the API call via `withApiRetry`.
    - Monitors the stream for "stalls" (gaps > 30s) and reports them to telemetry.
    - Yields events (text deltas, thinking blocks, tool uses) back to the main agent loop.

**Why this approach:**
- **Context Optimization**: By only loading relevant tools and using ephemeral caching, it minimizes token usage and latency.
- **Resilience**: The stall detection and retry logic ensure the agent remains responsive even under network instability.
- **Future-Proofing**: The adaptive thinking and effort systems allow the agent to leverage advanced model capabilities dynamically.

**Key insight:** The use of "Tool-Based Global Cache Markers" is a clever way to ensure that the bulk of the system prompt and tool definitions remain cached even when MCP tools (which might be dynamic) are present.

---

## Code Implementation (Deobfuscated)

### llmRequestGenerator - Main API Request orchestrator
// Location: chunks.169.mjs:739-1038 (partial)

// ORIGINAL (for source lookup):
```javascript
async function* lOq(A, q, K, Y, z, w) {
    // ... logic for tool schema building, message normalization, system prompt assembly ...
    let O1 = (z1) => {
        let Y1 = [...$], $1 = vw6(_1), G1 = { ...$1.output_config ?? {} };
        let L1 = Sn7() ?? w.effortValue ?? p17(w.model);
        if (x9z(L1, G1, $1, Y1, w.model), w.outputFormat && !("format" in G1)) {
            if (G1.format = w.outputFormat, !Y1.includes(hl)) Y1.push(hl)
        }
        if (K !== 0)
            if (ok7(w.model)) {
                if ($1.thinking = { type: "adaptive" }, !Y1.includes($L6)) Y1.push($L6);
            } else {
                x1 = { budget_tokens: A6, type: "enabled" }
            }
        // ... build return object ...
    };
    // ... stream handling ...
}
```

// READABLE (for understanding):
```javascript
/**
 * Main generator for LLM requests
 * @param {Array} history - Message history
 * @param {Array} systemPrompts - Initial system prompts
 * @param {number} maxThinkingTokens - Thinking budget
 * @param {Array} toolset - Available tools
 * @param {AbortSignal} signal - Abort signal
 * @param {Object} options - Model and execution options
 */
async function* llmRequestGenerator(history, systemPrompts, maxThinkingTokens, toolset, signal, options) {
    // 1. Prepare Beta Headers
    let betas = getBetaHeaders(options.model);
    
    // 2. Dynamic Tool Filtering
    let useDynamicLoading = await shouldUseDynamicToolLoading(options.model, toolset);
    let filteredTools = filterToolsForContext(toolset, useDynamicLoading);
    
    // 3. Prompt Caching Logic
    let useGlobalCache = isPromptCachingEnabled() && (hasMcpTools || hasSearchTool);
    if (useGlobalCache) betas.push(BETA_GLOBAL_CACHE);
    
    // 4. Build System Prompt
    let fullSystemPrompt = [
        getAttributionHeader(calculatePromptHash(history)),
        getSystemPrompt(options),
        ...systemPrompts
    ].filter(Boolean);
    
    // 5. Payload Builder (Internal)
    const buildPayload = (requestOptions) => {
        let currentBetas = [...betas];
        let outputConfig = {};
        
        // Effort Level Configuration
        let effort = getEffortLevel() || options.effortValue;
        configureEffort(effort, outputConfig, currentBetas, options.model);
        
        // Adaptive Thinking Configuration
        if (maxThinkingTokens !== 0) {
            if (isAdaptiveThinkingSupported(options.model)) {
                outputConfig.thinking = { type: "adaptive" };
                currentBetas.push(BETA_ADAPTIVE_THINKING);
            } else {
                outputConfig.thinking = { 
                    type: "enabled", 
                    budget_tokens: maxThinkingTokens 
                };
            }
        }
        
        return {
            model: options.model,
            messages: normalizeMessages(history),
            system: buildSystemPromptWithCache(fullSystemPrompt),
            tools: filteredTools.map(t => getToolSchema(t)),
            betas: currentBetas,
            max_tokens: options.maxTokens || 4096,
            ...outputConfig
        };
    };
    
    // 6. Execute Request & Handle Stream
    let client = createLlmClient(options);
    let stream = await withApiRetry(async () => {
        return client.beta.messages.create({ ...buildPayload(options), stream: true });
    });
    
    for await (const event of stream) {
        // ... Yield deltas and handle stalls ...
        yield event;
    }
}
```

// Mapping: lOq→llmRequestGenerator, A→history, q→systemPrompts, K→maxThinkingTokens, Y→toolset, z→signal, w→options, $L6→BETA_ADAPTIVE_THINKING, hl→BETA_STRUCTURED_OUTPUTS

---

### getSystemPrompt - Contextual Base Prompt
// Location: chunks.47.mjs:2470-2477

// ORIGINAL (for source lookup):
```javascript
function cq6(A) {
    if (E4() === "vertex") return B7A;
    if (A?.isNonInteractive) {
        if (A.hasAppendSystemPrompt) return t17;
        return e17
    }
    return B7A
}
```

// READABLE (for understanding):
```javascript
function getSystemPrompt(options) {
    const PROMPT_STANDARD = "You are Claude Code, Anthropic's official CLI for Claude.";
    const PROMPT_SDK_APPEND = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.";
    const PROMPT_SDK_BASE = "You are a Claude agent, built on Anthropic's Claude Agent SDK.";

    if (getPlatform() === "vertex") return PROMPT_STANDARD;
    
    if (options?.isNonInteractive) {
        if (options.hasAppendSystemPrompt) {
            return PROMPT_SDK_APPEND;
        }
        return PROMPT_SDK_BASE;
    }
    
    return PROMPT_STANDARD;
}
```

// Mapping: cq6→getSystemPrompt, A→options, B7A→PROMPT_STANDARD, t17→PROMPT_SDK_APPEND, e17→PROMPT_SDK_BASE
