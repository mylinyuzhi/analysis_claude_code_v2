# Claude Code v2.0.59 - Model Selection and Configuration

## Overview

This document provides a comprehensive analysis of how Claude Code v2.0.59 selects, configures, and manages different Claude models. The system supports multiple model tiers (Opus, Sonnet, Haiku) across different providers (Anthropic API, AWS Bedrock, Google Vertex AI, Azure Foundry) with sophisticated fallback mechanisms.

## Table of Contents

1. [Model Taxonomy](#model-taxonomy)
2. [Model Selection Logic](#model-selection-logic)
3. [Provider-Specific Model Names](#provider-specific-model-names)
4. [Fallback Model Logic](#fallback-model-logic)
5. [Model Configuration Parameters](#model-configuration-parameters)
6. [Model-Specific Settings](#model-specific-settings)
7. [Flow Diagrams](#flow-diagrams)

---

## Model Taxonomy

### Available Model Tiers

Claude Code supports three primary model tiers, each with multiple versions:

#### 1. Haiku (Fast, Cost-Effective)

| Version | Model ID | Release Date | Description |
|---------|----------|--------------|-------------|
| Haiku 3.5 | claude-3-5-haiku-20241022 | 2024-10-22 | Legacy Haiku |
| Haiku 4.5 | claude-haiku-4-5-20251001 | 2025-10-01 | Latest Haiku |

**Use Cases**: Quick answers, simple tasks, cost-sensitive operations

**Default Max Tokens**: 4,096 (3.x), 64,000 (4.x)

#### 2. Sonnet (Balanced, Everyday Use)

| Version | Model ID | Release Date | Description |
|---------|----------|--------------|-------------|
| Sonnet 3.5 | claude-3-5-sonnet-20241022 | 2024-10-22 | Legacy Sonnet |
| Sonnet 3.7 | claude-3-7-sonnet-20250219 | 2025-02-19 | Experimental |
| Sonnet 4.0 | claude-sonnet-4-20250514 | 2025-05-14 | Sonnet 4 |
| Sonnet 4.5 | claude-sonnet-4-5-20250929 | 2025-09-29 | Latest Sonnet |

**Use Cases**: Everyday coding tasks, most recommended for general use

**Default Max Tokens**: 8,192 (3.5), 64,000 (4.x)

**Special Variant**: `sonnet[1m]` - Sonnet 4.5 with 1M context window for long sessions

#### 3. Opus (Powerful, Complex Tasks)

| Version | Model ID | Release Date | Description |
|---------|----------|--------------|-------------|
| Opus 4.0 | claude-opus-4-20250514 | 2025-05-14 | Opus 4 |
| Opus 4.1 | claude-opus-4-1-20250805 | 2025-08-05 | Opus 4.1 |
| Opus 4.5 | claude-opus-4-5-20251101 | 2025-11-01 | Latest Opus |

**Use Cases**: Complex work, challenging problems, high-quality outputs

**Default Max Tokens**: 4,096 (3.x Opus), 32,000 (4.0), 64,000 (4.5)

**Special Modes**:
- `opus` - Standard Opus usage
- `opusplan` - Uses Opus 4.5 in plan mode, Sonnet 4.5 otherwise

### Model Selector Aliases

Claude Code supports convenient model aliases:

```javascript
const MODEL_ALIASES = [
  "sonnet",        // → claude-sonnet-4-5-20250929
  "opus",          // → claude-opus-4-5-20251101 (first-party) or claude-opus-4-1-20250805 (others)
  "haiku",         // → claude-haiku-4-5-20251001 (first-party) or claude-3-5-haiku-20241022 (others)
  "sonnet[1m]",    // → claude-sonnet-4-5-20250929 with 1M context
  "opusplan",      // → Dynamic: Opus in plan mode, Sonnet otherwise
  "inherit"        // → Use parent agent's model
];
```

---

## Model Selection Logic

### Selection Priority Order

Claude Code determines the active model through a cascading priority system:

```
1. Session Override (yE0())
   ↓ (if not set)
2. Environment Variable (ANTHROPIC_MODEL)
   ↓ (if not set)
3. Configuration File (~/.claude/config.json → model)
   ↓ (if not set)
4. Default Model (based on plan and experiment flags)
   ↓
5. Final Fallback (Sonnet 4.5)
```

### Code Implementation

```javascript
// Main model resolution function
function getActiveModel(options = {}) {
  let model, sessionModel = getSessionOverrideModel();

  // Priority 1: Session override
  if (sessionModel !== undefined) {
    model = sessionModel;
  } else {
    // Priority 2 & 3: Environment or config file
    let config = readConfigFile() || {};
    model = process.env.ANTHROPIC_MODEL || config.model || undefined;
  }

  // Check if Opus is allowed on current plan
  if (isClaudePro() && !hasPaidExtras() && model && isOpusModel(model)) {
    // Opus not available on Pro plan - reset
    return undefined;
  }

  if (model !== null && model !== undefined) {
    return model;
  }

  // Priority 4 & 5: Default model
  let { forDisplay = false } = options;
  return getDefaultModel(forDisplay);
}

// Default model selection
function getDefaultModel(forDisplay = false) {
  let experimentOverride = getExperimentModelOverride();

  if (experimentOverride !== null && experimentOverride.name) {
    return forDisplay ?
           (experimentOverride.displayName ?? experimentOverride.name) :
           experimentOverride.name;
  }

  // Check for 1M context experiment
  if (isSonnet1MExperimentEnabled()) {
    return "sonnet[1m]";
  }

  // Return undefined (will use DEFAULT_MODEL constant)
  return undefined;
}

// Finalize model with fallback
function getFinalModel(options = {}) {
  let model = getActiveModel(options);

  if (model !== undefined && model !== null) {
    return normalizeModelName(model);
  }

  return getFallbackModel();
}

// Fallback model selection
function getFallbackModel() {
  // Check if Haiku is default for Pro plan
  if (isClaudePro() && !hasPaidExtras() && isHaikuDefaultForPro()) {
    return getDefaultHaikuModel();
  }

  // Default to Sonnet
  return getDefaultSonnetModel();
}
```

### Model Alias Resolution

```javascript
function resolveModelAlias(alias) {
  switch(alias) {
    case "sonnet":
      return getDefaultSonnetModel();  // claude-sonnet-4-5-20250929

    case "sonnet[1m]":
      return getDefaultSonnetModel();  // Same ID, context window managed elsewhere

    case "opus":
      return getDefaultOpusModel();    // claude-opus-4-5-20251101 (first-party)
                                       // claude-opus-4-1-20250805 (Bedrock/Vertex)

    case "haiku":
      return getDefaultHaikuModel();   // claude-haiku-4-5-20251001 (first-party)
                                       // claude-3-5-haiku-20241022 (Bedrock/Vertex)

    case "opusplan":
      // Dynamic selection based on permission mode
      return "opusplan";  // Special handling in query logic

    default:
      return alias;  // Direct model ID
  }
}
```

### Default Model Functions

```javascript
// Default Sonnet (environment override or latest)
function getDefaultSonnetModel() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  }
  return getModelIds().sonnet45;  // claude-sonnet-4-5-20250929
}

// Default Opus (environment override or version based on provider)
function getDefaultOpusModel() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  }

  if (getProvider() === "firstParty") {
    return getModelIds().opus45;  // claude-opus-4-5-20251101
  }

  return getModelIds().opus41;  // claude-opus-4-1-20250805
}

// Default Haiku (environment override or version based on provider)
function getDefaultHaikuModel() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  }

  if (getProvider() === "firstParty" || getProvider() === "foundry") {
    return getModelIds().haiku45;  // claude-haiku-4-5-20251001
  }

  return getModelIds().haiku35;  // claude-3-5-haiku-20241022
}

// Small/fast model for internal operations
function getSmallFastModel() {
  return process.env.ANTHROPIC_SMALL_FAST_MODEL || getDefaultHaikuModel();
}
```

---

## Provider-Specific Model Names

### Model Name Mappings

Different providers use different model naming conventions. Claude Code maintains a mapping table:

```javascript
const MODEL_IDS = {
  // Haiku 3.5
  haiku35: {
    firstParty: "claude-3-5-haiku-20241022",
    bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    vertex: "claude-3-5-haiku@20241022",
    foundry: "claude-3-5-haiku"
  },

  // Haiku 4.5
  haiku45: {
    firstParty: "claude-haiku-4-5-20251001",
    bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    vertex: "claude-haiku-4-5@20251001",
    foundry: "claude-haiku-4-5"
  },

  // Sonnet 3.5
  sonnet35: {
    firstParty: "claude-3-5-sonnet-20241022",
    bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    vertex: "claude-3-5-sonnet-v2@20241022",
    foundry: "claude-3-5-sonnet"
  },

  // Sonnet 3.7
  sonnet37: {
    firstParty: "claude-3-7-sonnet-20250219",
    bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    vertex: "claude-3-7-sonnet@20250219",
    foundry: "claude-3-7-sonnet"
  },

  // Sonnet 4.0
  sonnet40: {
    firstParty: "claude-sonnet-4-20250514",
    bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
    vertex: "claude-sonnet-4@20250514",
    foundry: "claude-sonnet-4"
  },

  // Sonnet 4.5
  sonnet45: {
    firstParty: "claude-sonnet-4-5-20250929",
    bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    vertex: "claude-sonnet-4-5@20250929",
    foundry: "claude-sonnet-4-5"
  },

  // Opus 4.0
  opus40: {
    firstParty: "claude-opus-4-20250514",
    bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
    vertex: "claude-opus-4@20250514",
    foundry: "claude-opus-4"
  },

  // Opus 4.1
  opus41: {
    firstParty: "claude-opus-4-1-20250805",
    bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
    vertex: "claude-opus-4-1@20250805",
    foundry: "claude-opus-4-1"
  },

  // Opus 4.5
  opus45: {
    firstParty: "claude-opus-4-5-20251101",
    bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
    vertex: "claude-opus-4-5@20251101",
    foundry: "claude-opus-4-5"
  }
};
```

### Model ID Resolution

```javascript
// Get model IDs for current provider
function getModelIds() {
  let cachedIds = getCachedModelIds();

  if (cachedIds === null) {
    initializeModelIds();
    return getProviderModelIds(getProvider());
  }

  return cachedIds;
}

// Get IDs for specific provider
function getProviderModelIds(provider) {
  return {
    haiku35: MODEL_IDS.haiku35[provider],
    haiku45: MODEL_IDS.haiku45[provider],
    sonnet35: MODEL_IDS.sonnet35[provider],
    sonnet37: MODEL_IDS.sonnet37[provider],
    sonnet40: MODEL_IDS.sonnet40[provider],
    sonnet45: MODEL_IDS.sonnet45[provider],
    opus40: MODEL_IDS.opus40[provider],
    opus41: MODEL_IDS.opus41[provider],
    opus45: MODEL_IDS.opus45[provider]
  };
}

// For Bedrock: Fetch available models dynamically
async function fetchBedrockModelIds() {
  try {
    let availableModels = await listBedrockModels();

    if (!availableModels?.length) {
      return getProviderModelIds("bedrock");
    }

    // Map model names to IDs
    return {
      haiku35: findModel(availableModels, "claude-3-5-haiku-20241022") ||
               MODEL_IDS.haiku35.bedrock,
      haiku45: findModel(availableModels, "claude-haiku-4-5-20251001") ||
               MODEL_IDS.haiku45.bedrock,
      sonnet35: findModel(availableModels, "claude-3-5-sonnet-20241022") ||
                MODEL_IDS.sonnet35.bedrock,
      sonnet37: findModel(availableModels, "claude-3-7-sonnet-20250219") ||
                MODEL_IDS.sonnet37.bedrock,
      sonnet40: findModel(availableModels, "claude-sonnet-4-20250514") ||
                MODEL_IDS.sonnet40.bedrock,
      sonnet45: findModel(availableModels, "claude-sonnet-4-5-20250929") ||
                MODEL_IDS.sonnet45.bedrock,
      opus40: findModel(availableModels, "claude-opus-4-20250514") ||
              MODEL_IDS.opus40.bedrock,
      opus41: findModel(availableModels, "claude-opus-4-1-20250805") ||
              MODEL_IDS.opus41.bedrock,
      opus45: findModel(availableModels, "claude-opus-4-5-20251101") ||
              MODEL_IDS.opus45.bedrock
    };
  } catch (error) {
    logError(error);
    return getProviderModelIds("bedrock");
  }
}
```

### Model Name Normalization

```javascript
// Remove special suffixes before API call
function normalizeModelName(model) {
  // Remove [1m] suffix (1M context indicator)
  return model.replace(/\[1m\]/gi, "");
}

// Examples:
normalizeModelName("sonnet[1m]");  // → "sonnet"
normalizeModelName("claude-sonnet-4-5-20250929[1m]");  // → "claude-sonnet-4-5-20250929"
```

---

## Fallback Model Logic

### Overload Fallback Mechanism

When Opus models are overloaded (HTTP 529 errors), Claude Code automatically falls back to a different model:

```javascript
// In retry logic (t61 function)
async function* withRetry(clientFactory, executeRequest, options) {
  let overloadCount = 0;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      // Execute request
      return await executeRequest(client, attempt, retryContext);
    } catch (error) {
      // Check for overload error (529)
      if (isOverloadError(error) &&
          (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS ||
           !isSandbox() && isOpusModel(options.model))) {

        overloadCount++;

        // Trigger fallback after 3 overload errors
        if (overloadCount >= 3) {
          if (options.fallbackModel) {
            logAnalytics("tengu_api_opus_fallback_triggered", {
              original_model: options.model,
              fallback_model: options.fallbackModel,
              provider: getProvider()
            });

            throw new FallbackTriggeredError(
              options.model,
              options.fallbackModel
            );
          }

          // No fallback configured - show error
          if (!isSandbox()) {
            logAnalytics("tengu_api_custom_529_overloaded_error", {});
            throw new RetryError(
              Error("Opus is experiencing high load, please use /model to switch to Sonnet"),
              retryContext
            );
          }
        }
      }

      // Continue retry logic...
    }
  }
}

// Check if error is overload
function isOverloadError(error) {
  if (!(error instanceof APIError)) {
    return false;
  }

  return error.status === 529 ||
         (error.message?.includes('"type":"overloaded_error"') ?? false);
}

// Check if model is Opus
function isOpusModel(model) {
  let ids = getModelIds();
  return model === ids.opus40 ||
         model === ids.opus41 ||
         model === ids.opus45;
}
```

### Fallback Model Configuration

Users can configure a fallback model via command-line or environment:

```bash
# Command-line option
claude --fallback-model sonnet

# Environment variable
export CLAUDE_CODE_FALLBACK_MODEL=claude-sonnet-4-5-20250929
```

### Fallback Error Messages

```javascript
// Error message for Claude Pro users (Opus not available)
if (isClaudePro() && error instanceof APIError &&
    error.status === 400 &&
    error.message.toLowerCase().includes("invalid model name") &&
    (isOpusModel(model) || model === "opus")) {

  return createSystemMessage({
    content: "Claude Opus is not available with the Claude Pro plan. " +
             "If you have updated your subscription plan recently, " +
             "run /logout and /login for the plan to take effect."
  });
}

// Error message for overload without fallback
if (isOverloadError(error) && !fallbackModel) {
  return createSystemMessage({
    content: "Opus is experiencing high load, please use /model to switch to Sonnet"
  });
}

// Suggestion to switch models on repeated refusals
if (isRefusalError(error)) {
  let suggestion = model !== "claude-sonnet-4-20250514" ?
    " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." :
    "";

  return createSystemMessage({
    content: errorMessage + suggestion
  });
}
```

---

## Model Configuration Parameters

### Max Output Tokens by Model

```javascript
function getDefaultMaxOutputTokens(model) {
  let modelLower = model.toLowerCase();
  let defaultMax;

  // Determine base max tokens
  if (modelLower.includes("3-5")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-opus")) {
    defaultMax = 4096;
  } else if (modelLower.includes("claude-3-sonnet")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-haiku")) {
    defaultMax = 4096;
  } else if (modelLower.includes("opus-4-5")) {
    defaultMax = 64000;
  } else if (modelLower.includes("opus-4")) {
    defaultMax = 32000;
  } else if (modelLower.includes("sonnet-4") || modelLower.includes("haiku-4")) {
    defaultMax = 64000;
  } else {
    defaultMax = 32000;  // Generic fallback
  }

  // Check environment variable override
  let envValidator = IntegerValidator.validate(
    process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS
  );

  if (envValidator.status === "capped") {
    log(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${envValidator.message}`);
  } else if (envValidator.status === "invalid") {
    log(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${envValidator.message}`);
  }

  return Math.min(envValidator.effective, defaultMax);
}

// Environment variable validation
const IntegerValidator = {
  validate: (value) => {
    if (!value) {
      return { status: "valid", effective: Infinity };
    }

    let parsed = parseInt(value, 10);

    if (isNaN(parsed)) {
      return {
        status: "invalid",
        message: "must be a valid integer",
        effective: Infinity
      };
    }

    if (parsed < 0) {
      return {
        status: "invalid",
        message: "must be non-negative",
        effective: Infinity
      };
    }

    return { status: "valid", effective: parsed };
  }
};
```

### Prompt Caching Configuration

```javascript
function isPromptCachingEnabled(model) {
  // Prompt caching is available on all Claude 3+ models
  // Enable by default unless explicitly disabled

  if (process.env.CLAUDE_CODE_DISABLE_PROMPT_CACHING === "true") {
    return false;
  }

  // Model-specific logic (all modern models support caching)
  return true;
}

// Apply cache breakpoints to system prompts
function applySystemCacheBreakpoints(systemPrompts, cachingEnabled) {
  return systemPrompts.map((prompt) => ({
    type: "text",
    text: prompt,
    ...(cachingEnabled ? { cache_control: { type: "ephemeral" } } : {})
  }));
}

// Apply cache breakpoints to messages (exclude last 3)
function applyMessageCacheBreakpoints(messages, cachingEnabled) {
  logAnalytics("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: cachingEnabled
  });

  return messages.map((message, index) => {
    let shouldCache = index <= messages.length - 3 && cachingEnabled;

    if (message.role === "user") {
      return applyUserCacheControl(message, shouldCache, cachingEnabled);
    }

    return applyAssistantCacheControl(message, shouldCache, cachingEnabled);
  });
}
```

### SDK Beta Features

```javascript
function getSdkBetas(model, explicitBetas) {
  // Build list of beta features to enable
  let betas = [];

  // Prompt caching (all models)
  if (isPromptCachingEnabled(model)) {
    betas.push("prompt-caching-2024-07-31");
  }

  // PDF support (all models)
  betas.push("pdfs-2024-09-25");

  // Extended thinking (available on Opus and Sonnet 4+)
  if (supportsExtendedThinking(model)) {
    betas.push("extended-thinking-2025-01-24");
  }

  // Context management (available on models with large context)
  if (supportsContextManagement(model)) {
    betas.push("context-management-2025-01-24");
  }

  // Add explicit betas from caller
  if (explicitBetas) {
    betas.push(...explicitBetas);
  }

  return [...new Set(betas)];  // Remove duplicates
}

function supportsExtendedThinking(model) {
  // Extended thinking available on Claude 4+ models
  let modelLower = model.toLowerCase();
  return modelLower.includes("sonnet-4") ||
         modelLower.includes("opus-4") ||
         modelLower.includes("haiku-4");
}

function supportsContextManagement(model) {
  // Context management for large context windows
  let modelLower = model.toLowerCase();
  return modelLower.includes("-4-") ||
         modelLower.includes("-4.5-") ||
         model.includes("[1m]");
}
```

---

## Model-Specific Settings

### Temperature Configuration

```javascript
// Temperature is typically set to 1.0 for deterministic behavior
function getTemperature(options) {
  // Check explicit override
  if (options.temperatureOverride !== undefined) {
    return options.temperatureOverride;
  }

  // Default temperature
  return 1.0;
}
```

### Context Management

```javascript
function getContextManagementConfig(taskIntensity, model, betas) {
  // Only enable if beta is active
  if (!betas.includes("context-management-2025-01-24")) {
    return undefined;
  }

  // Get base configuration
  let baseConfig = getBaseContextConfig(model);

  // Apply task intensity override
  applyTaskIntensity(taskIntensity, baseConfig, betas);

  return baseConfig ? {
    type: "enabled",
    max_context_tokens: baseConfig.max_context_tokens
  } : undefined;
}

function getBaseContextConfig(model) {
  let modelLower = model.toLowerCase();

  // 1M context models
  if (model.includes("[1m]") || modelLower.includes("sonnet-4-5")) {
    return { max_context_tokens: 800000 };  // 800K tokens (~1M with buffer)
  }

  // Standard large context models
  if (modelLower.includes("-4-") || modelLower.includes("-4.5-")) {
    return { max_context_tokens: 180000 };  // 180K tokens (~200K with buffer)
  }

  return undefined;  // Disable for other models
}
```

### Extended Thinking Budget

```javascript
function getThinkingBudget(maxThinkingTokens, maxOutputTokens) {
  if (maxThinkingTokens <= 0) {
    return undefined;  // Thinking disabled
  }

  // Reserve 1 token for response
  let budgetTokens = Math.min(
    maxThinkingTokens,
    maxOutputTokens - 1
  );

  return {
    type: "enabled",
    budget_tokens: budgetTokens
  };
}

// Default thinking budgets by task type
const THINKING_BUDGETS = {
  simple_query: 0,           // No thinking
  code_review: 5000,         // 5K tokens
  complex_refactor: 10000,   // 10K tokens
  architecture: 15000,       // 15K tokens
  deep_analysis: 20000       // 20K tokens
};
```

### Plan Mode Model Selection

```javascript
function resolvePlanModeModel(options) {
  let { permissionMode, mainLoopModel, exceeds200kTokens = false } = options;

  // "opusplan" special handling
  if (getActiveModel() === "opusplan" &&
      permissionMode === "plan" &&
      !exceeds200kTokens) {
    return getDefaultOpusModel();  // Use Opus for plan mode
  }

  // "haiku" alias with plan mode
  if (getActiveModel() === "haiku" && permissionMode === "plan") {
    return getDefaultSonnetModel();  // Upgrade to Sonnet
  }

  // Default: use main loop model
  return mainLoopModel;
}
```

### Model Display Names

```javascript
const MODEL_DISPLAY_CONFIG = {
  sonnet: {
    value: "sonnet",
    label: "Sonnet",
    description: "Sonnet 4.5 · Best for everyday tasks · $3/MTok in, $15/MTok out",
    descriptionForModel: "Sonnet 4.5 - best for everyday tasks. Generally recommended for most coding tasks"
  },

  "sonnet[1m]": {
    value: "sonnet[1m]",
    label: "Sonnet (1M context)",
    description: "Sonnet 4.5 for long sessions · $3/MTok in, $15/MTok out",
    descriptionForModel: "Sonnet 4.5 with 1M context window - for long sessions with large codebases"
  },

  opus: {
    value: "opus",
    label: (provider === "firstParty") ? "Opus" : "Opus 4.1",
    description: (provider === "firstParty")
      ? "Opus 4.5 · Most capable for complex work · $15/MTok in, $75/MTok out"
      : "Opus 4.1 · Legacy · $15/MTok in, $75/MTok out",
    descriptionForModel: (provider === "firstParty")
      ? "Opus 4.5 - most capable for complex work"
      : "Opus 4.1 - legacy version"
  },

  haiku: {
    value: "haiku",
    label: "Haiku",
    description: "Haiku 4.5 · Fastest for quick answers · $0.80/MTok in, $4/MTok out",
    descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.5."
  },

  opusplan: {
    value: "opusplan",
    label: "Opus Plan Mode",
    description: "Use Opus 4.5 in plan mode, Sonnet 4.5 otherwise"
  }
};
```

---

## Flow Diagrams

### Model Selection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Model Selection Entry                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Check Session Override   │
              │ (yE0() - runtime /model) │
              └──────────────────────────┘
                    ↓ Set?        ↓ Not Set
              ┌─────────┐          │
              │ USE IT  │          │
              └─────────┘          │
                    ↓              ↓
                    │     ┌─────────────────────────┐
                    │     │ Check ANTHROPIC_MODEL   │
                    │     │ environment variable    │
                    │     └─────────────────────────┘
                    │          ↓ Set?      ↓ Not Set
                    │     ┌─────────┐       │
                    │     │ USE IT  │       │
                    │     └─────────┘       │
                    │          ↓            ↓
                    │          │   ┌──────────────────────┐
                    │          │   │ Check config.json    │
                    │          │   │ ~/.claude/config.json│
                    │          │   └──────────────────────┘
                    │          │        ↓ Set?   ↓ Not Set
                    │          │   ┌─────────┐    │
                    │          │   │ USE IT  │    │
                    │          │   └─────────┘    │
                    │          │        ↓         ↓
                    └──────────┴────────┴─────────┘
                                  ↓
                    ┌──────────────────────────────┐
                    │ Is Claude Pro without extras?│
                    │ AND model is Opus?           │
                    └──────────────────────────────┘
                         ↓ Yes          ↓ No
                    ┌─────────┐         │
                    │ RESET   │         │
                    │ model   │         │
                    └─────────┘         │
                         ↓ ←────────────┘
                    ┌──────────────────────────────┐
                    │ Has valid model?             │
                    └──────────────────────────────┘
                         ↓ Yes          ↓ No
                    ┌─────────┐    ┌────────────────┐
                    │ RETURN  │    │ Get Default    │
                    │ model   │    │ Model          │
                    └─────────┘    └────────────────┘
                                        ↓
                              ┌──────────────────────┐
                              │ Check Experiment     │
                              │ Override             │
                              └──────────────────────┘
                                   ↓ Set?   ↓ Not Set
                              ┌─────────┐    │
                              │ USE IT  │    │
                              └─────────┘    │
                                   ↓         ↓
                                   │   ┌──────────────────┐
                                   │   │ Is Sonnet 1M     │
                                   │   │ experiment on?   │
                                   │   └──────────────────┘
                                   │      ↓ Yes    ↓ No
                                   │  ┌──────┐     │
                                   │  │sonnet│     │
                                   │  │[1m]  │     │
                                   │  └──────┘     │
                                   │      ↓        ↓
                                   └──────┴────────┘
                                          ↓
                              ┌──────────────────────┐
                              │ Get Fallback Model   │
                              └──────────────────────┘
                                          ↓
                              ┌──────────────────────┐
                              │ Is Pro + Haiku       │
                              │ default enabled?     │
                              └──────────────────────┘
                                   ↓ Yes      ↓ No
                              ┌──────────┐ ┌──────────┐
                              │  Haiku   │ │  Sonnet  │
                              │  4.5     │ │  4.5     │
                              └──────────┘ └──────────┘
                                   ↓            ↓
                                   └─────┬──────┘
                                         ↓
                              ┌──────────────────────┐
                              │ Resolve to Provider  │
                              │ Specific Model ID    │
                              └──────────────────────┘
                                         ↓
                              ┌──────────────────────┐
                              │ RETURN model ID      │
                              └──────────────────────┘
```

### Fallback Model Trigger Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  API Request Execution                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Execute API Request      │
              │ (attempt N)              │
              └──────────────────────────┘
                    ↓ Success    ↓ Error
              ┌─────────┐        │
              │ RETURN  │        │
              │ response│        │
              └─────────┘        │
                                 ↓
                    ┌──────────────────────────┐
                    │ Is Overload Error (529)? │
                    └──────────────────────────┘
                         ↓ No          ↓ Yes
                    ┌─────────┐        │
                    │ Handle  │        │
                    │ other   │        │
                    │ errors  │        │
                    └─────────┘        │
                                       ↓
                          ┌──────────────────────────────┐
                          │ Is Opus model OR             │
                          │ FALLBACK_FOR_ALL_PRIMARY     │
                          │ _MODELS env var set?         │
                          └──────────────────────────────┘
                               ↓ No          ↓ Yes
                          ┌─────────┐        │
                          │ Regular │        │
                          │ retry   │        │
                          └─────────┘        │
                                             ↓
                                ┌──────────────────────────┐
                                │ overloadCount++          │
                                └──────────────────────────┘
                                             ↓
                                ┌──────────────────────────┐
                                │ overloadCount >= 3?      │
                                └──────────────────────────┘
                                   ↓ No          ↓ Yes
                              ┌─────────┐        │
                              │ Regular │        │
                              │ retry   │        │
                              └─────────┘        │
                                                 ↓
                                    ┌──────────────────────────┐
                                    │ Has fallbackModel?       │
                                    └──────────────────────────┘
                                       ↓ Yes          ↓ No
                          ┌────────────────────────┐  │
                          │ Log analytics:         │  │
                          │ tengu_api_opus_        │  │
                          │   fallback_triggered   │  │
                          └────────────────────────┘  │
                                       ↓              ↓
                          ┌────────────────────────┐  │
                          │ Throw                  │  │
                          │ FallbackTriggeredError │  │
                          │ (original → fallback)  │  │
                          └────────────────────────┘  │
                                       ↓              │
                          ┌────────────────────────┐  │
                          │ Catch in caller,       │  │
                          │ retry with fallback    │  │
                          │ model                  │  │
                          └────────────────────────┘  │
                                                      ↓
                                         ┌──────────────────────┐
                                         │ Is Sandbox?          │
                                         └──────────────────────┘
                                            ↓ Yes      ↓ No
                                       ┌─────────┐     │
                                       │ Throw   │     │
                                       │ generic │     │
                                       │ error   │     │
                                       └─────────┘     │
                                                       ↓
                                          ┌──────────────────────┐
                                          │ Log analytics:       │
                                          │ tengu_api_custom_    │
                                          │   529_overloaded_    │
                                          │   error              │
                                          └──────────────────────┘
                                                       ↓
                                          ┌──────────────────────┐
                                          │ Throw RetryError     │
                                          │ with message:        │
                                          │ "Opus experiencing   │
                                          │  high load, use      │
                                          │  /model to switch"   │
                                          └──────────────────────┘
```

### Provider-Specific Model Resolution

```
┌─────────────────────────────────────────────────────────────┐
│               Get Provider-Specific Model ID                │
│               Input: alias (e.g., "opus")                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Resolve alias to         │
              │ model family             │
              │ (opus → opus45)          │
              └──────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Determine active provider│
              └──────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                   ↓                   ↓
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│  First Party  │  │    Bedrock     │  │  Vertex AI    │
│  (claude.ai)  │  │    (AWS)       │  │  (Google)     │
└───────────────┘  └────────────────┘  └───────────────┘
        ↓                   ↓                   ↓
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│ Get cached or │  │ Fetch available│  │ Use standard  │
│ default IDs   │  │ models from    │  │ mapping       │
│               │  │ Bedrock API    │  │               │
└───────────────┘  └────────────────┘  └───────────────┘
        ↓                   ↓                   ↓
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│ MODEL_IDS     │  │ Match model    │  │ MODEL_IDS     │
│ [opus45]      │  │ names to ARNs  │  │ [opus45]      │
│ [firstParty]  │  │ or use default │  │ [vertex]      │
└───────────────┘  └────────────────┘  └───────────────┘
        ↓                   ↓                   ↓
        └───────────────────┴───────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Return provider-specific │
              │ model ID                 │
              └──────────────────────────┘
                            ↓
Examples:
• First Party: "claude-opus-4-5-20251101"
• Bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0"
• Vertex: "claude-opus-4-5@20251101"
• Foundry: "claude-opus-4-5"
```

---

## Summary

The Claude Code v2.0.59 model selection system provides:

1. **Flexible Model Selection**:
   - Session overrides (`/model` command)
   - Environment variables
   - Configuration files
   - Intelligent defaults

2. **Multi-Provider Support**:
   - Anthropic API (first-party)
   - AWS Bedrock
   - Google Vertex AI
   - Azure Foundry
   - Automatic model ID translation

3. **Robust Fallback Mechanisms**:
   - Overload detection (529 errors)
   - Automatic fallback after 3 attempts
   - Configurable fallback models
   - Plan-aware model selection

4. **Smart Configuration**:
   - Model-specific token limits
   - Prompt caching (all models)
   - Extended thinking (Claude 4+)
   - Context management (large context models)
   - Beta feature activation

5. **User-Friendly Aliases**:
   - Simple aliases (sonnet, opus, haiku)
   - Special modes (sonnet[1m], opusplan)
   - Environment overrides
   - Display-friendly names

This architecture ensures users always get the right model for their task, with graceful degradation and clear error messages when models are unavailable.
