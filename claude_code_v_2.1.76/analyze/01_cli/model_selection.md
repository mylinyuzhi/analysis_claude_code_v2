# CLI-Model Selection Integration

> How CLI flags control model selection, effort levels, and agent configuration

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Thinking Mode
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Model Module

Key functions in this document:
- `getModelFromSettings` (qPA) - Get effort level from settings
- `modelSupportsThinking` (C59) - Check thinking support
- `getDefaultEffortForModel` (p17) - Get default effort for model
- `parseEffortValue` (uK1) - Parse effort level string

---

## Overview

The CLI provides several flags for controlling model selection and behavior:

1. **`--model <model>`** - Override default model for session
2. **`--fallback-model <model>`** - Auto-fallback when overloaded
3. **`--effort <level>`** - Set effort level (low/medium/high/max)
4. **`--agent <agent>`** - Override agent setting
5. **`--betas <betas...>`** - Beta headers for API

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → MODEL SELECTION PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  --model         │    │  --fallback-model │    │  --effort        │     │
│  │  Session model   │    │  Overload backup  │    │  Thinking budget │     │
│  │  override        │    │                   │    │  low/medium/high │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   Model Resolution            │                       │
│                    │   1. CLI flag override        │                       │
│                    │   2. Agent definition         │                       │
│                    │   3. User settings            │                       │
│                    │   4. Default model            │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                    Specified             Default                          │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────────┐               │
│           │ Use CLI model           │   │ Use default     │               │
│           │ Apply effort level      │   │ sonnet/opus     │               │
│           │ Configure betas         │   │                 │               │
│           └─────────────────────────┘   └─────────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 Model Selection Flags

**Source location:** `chunks.189.mjs:1023-1027`

```javascript
// ============================================
// Model selection CLI flag definitions
// Location: chunks.189.mjs:1023-1027
// ============================================

// ORIGINAL (for source lookup):
.option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').")
.addOption(new J5("--effort <level>", "Effort level for the current session (low, medium, high)").argParser((w) => {
    let H = ["low", "medium", "high", "max"];
    if (!H.includes(w)) throw new kXq(`It must be one of: ${H.join(", ")}`);
    return w
}))
.option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.")
.option("--betas <betas...>", "Beta headers to include in API requests (API key users only)")
.option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)")

// READABLE (for understanding):
.option("--model <model>", "Model for the session (alias like 'sonnet' or full name)")
.addOption(new Option("--effort <level>", "Effort level (low, medium, high, max)")
    .argParser((value) => {
        let validLevels = ["low", "medium", "high", "max"];
        if (!validLevels.includes(value)) {
            throw new InvalidArgumentError(`It must be one of: ${validLevels.join(", ")}`);
        }
        return value;
    }))
.option("--agent <agent>", "Agent for the session (overrides 'agent' setting)")
.option("--betas <betas...>", "Beta headers for API requests (API key users only)")
.option("--fallback-model <model>", "Fallback when overloaded (print mode only)")

// Mapping: J5→Option, kXq→InvalidArgumentError, w→value, H→validLevels
```

### 1.2 Flag Extraction

**Source location:** `chunks.189.mjs:1042-1049`

```javascript
// ============================================
// Model flag extraction - Action handler
// Location: chunks.189.mjs:1042-1049
// ============================================

// ORIGINAL (for source lookup):
let {
    ...
    fallbackModel: G,
    betas: f = [],
    ...
} = H
...
let S = H.agent;
...
let P1 = H.model === "default" ? ML() : H.model,
    k1 = G === "default" ? ML() : G

// READABLE (for understanding):
let {
    fallbackModel,
    betas = [],
    ...
} = options;

let agentOverride = options.agent;

// Resolve model names
let sessionModel = options.model === "default" ? getDefaultModel() : options.model;
let fallbackModelResolved = fallbackModel === "default" ? getDefaultModel() : fallbackModel;

// Mapping: G→fallbackModel, f→betas, S→agentOverride, P1→sessionModel, k1→fallbackModelResolved
```

---

## 2. Model Resolution

### 2.1 Model Alias Support

**What it does:** The `--model` flag accepts both aliases and full model names.

| Alias | Full Model Name |
|-------|-----------------|
| `sonnet` | `claude-sonnet-4-6-20250514` (latest) |
| `opus` | `claude-opus-4-6-20250514` (latest) |
| `haiku` | `claude-haiku-4-5-20251001` (latest) |
| `default` | Uses configured default |

### 2.2 Model Resolution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MODEL RESOLUTION DECISION FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  resolveModel(modelInput)                                                    │
│  │                                                                          │
│  ├─► modelInput === "default"?                                              │
│  │   └─► YES → return getDefaultModel()                                     │
│  │                                                                          │
│  ├─► modelInput is alias? (sonnet, opus, haiku)                             │
│  │   └─► YES → return getLatestModelForAlias(modelInput)                   │
│  │                                                                          │
│  ├─► modelInput is valid model name?                                        │
│  │   └─► YES → return modelInput                                           │
│  │                                                                          │
│  └─► Invalid model → error                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Model Validation

**Source location:** `chunks.189.mjs:1128-1129`

```javascript
// ============================================
// Fallback model validation
// Location: chunks.189.mjs:1128-1129
// ============================================

// ORIGINAL (for source lookup):
if (G && H.model && G === H.model) process.stderr.write(H6.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`)), process.exit(1);

// READABLE (for understanding):
if (fallbackModel && options.model && fallbackModel === options.model) {
    console.error("Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.");
    process.exit(1);
}

// Mapping: G→fallbackModel, H→options, H6→chalk
```

---

## 3. Effort Level System

### 3.1 Effort Level Definition

**What it does:** The effort level controls thinking token budget and model behavior.

| Level | Thinking Budget | Use Case |
|-------|-----------------|----------|
| `low` | Minimal (4K) | Quick tasks, simple queries |
| `medium` | Standard (16K) | Balanced performance |
| `high` | Extended (32K) | Complex reasoning |
| `max` | Maximum (64K+) | Print mode only, deepest analysis |

### 3.2 Effort Level Validation

**Source location:** `chunks.189.mjs:1130-1134`

```javascript
// ============================================
// Effort level "max" validation
// Location: chunks.189.mjs:1130-1134
// ============================================

// ORIGINAL (for source lookup):
if (H.effort === "max" && (!z1 || i8())) {
    let TA = !z1 ? 'Effort level "max" is not available in interactive mode.' : 'Effort level "max" is not available for Claude.ai subscribers.';
    process.stderr.write(H6.red(`Error: ${TA} Please use "low", "medium", or "high".
`)), process.exit(1)
}

// READABLE (for understanding):
if (options.effort === "max" && (!isPrintMode || isClaudeAiSubscriber())) {
    let errorMessage = !isPrintMode
        ? 'Effort level "max" is not available in interactive mode.'
        : 'Effort level "max" is not available for Claude.ai subscribers.';
    console.error(`Error: ${errorMessage} Please use "low", "medium", or "high".`);
    process.exit(1);
}

// Mapping: z1→isPrintMode, i8→isClaudeAiSubscriber, H→options
```

### 3.3 Effort Level Constants

**Source location:** `chunks.90.mjs:3070`

```javascript
// ============================================
// EFFORT_LEVELS - Valid effort values
// Location: chunks.90.mjs:3070
// ============================================

// ORIGINAL (for source lookup):
WJ6 = ["low", "medium", "high", "max"]

// READABLE (for understanding):
const EFFORT_LEVELS = ["low", "medium", "high", "max"];

// Mapping: WJ6→EFFORT_LEVELS
```

---

## 4. Agent Override

### 4.1 Agent Flag Behavior

**What it does:** The `--agent` flag overrides the agent setting from configuration, allowing users to switch between agent types for the session.

**Source location:** `chunks.189.mjs:1350-1361`

```javascript
// ============================================
// Agent override resolution
// Location: chunks.189.mjs:1350-1361
// ============================================

// ORIGINAL (for source lookup):
let OA = S ?? l4().agent,
    bA;
if (OA) {
    if (bA = L6.activeAgents.find((TA) => TA.agentType === OA), !bA)
        h(`Warning: agent "${OA}" not found. Available agents: ${L6.activeAgents.map((TA)=>TA.agentType).join(", ")}. Using default behavior.`)
}
if (AC(bA?.agentType), bA) c("tengu_agent_flag", {
    agentType: iD(bA) ? bA.agentType : "custom",
    ...S && {
        source: "cli"
    }
});

// READABLE (for understanding):
// Resolve agent: CLI flag > user settings
let agentName = agentOverride ?? getUserSettings().agent;
let agentDefinition;

if (agentName) {
    // Find agent in active agents list
    agentDefinition = agents.activeAgents.find(a => a.agentType === agentName);

    if (!agentDefinition) {
        debug(`Warning: agent "${agentName}" not found. Available agents: ${agents.activeAgents.map(a => a.agentType).join(", ")}. Using default behavior.`);
    }
}

// Track agent usage
if (agentDefinition) {
    trackEvent("tengu_agent_flag", {
        agentType: isBuiltInAgent(agentDefinition) ? agentDefinition.agentType : "custom",
        source: agentOverride ? "cli" : "settings"
    });
}

// Mapping: OA→agentName, bA→agentDefinition, S→agentOverride, L6→agents, l4→getUserSettings
```

### 4.2 Built-in Agents

| Agent Type | Description |
|------------|-------------|
| `general-purpose` | Default, handles all tasks |
| `explore` | Fast codebase exploration |
| `plan` | Architecture planning |
| `bash` | Shell command execution |

---

## 5. Beta Headers

### 5.1 Beta Flag Behavior

**What it does:** Allows API key users to opt into beta features by passing beta headers.

**Source location:** `chunks.189.mjs:1023`

```javascript
// ============================================
// --betas flag definition
// Location: chunks.189.mjs:1023
// ============================================

// ORIGINAL (for source lookup):
.option("--betas <betas...>", "Beta headers to include in API requests (API key users only)")

// READABLE (for understanding):
.option("--betas <betas...>", "Beta headers to include in API requests (API key users only)")

// Usage:
// claude --betas "interleaved-thinking-2025-05-14" "effort-2025-11-24"
```

### 5.2 Known Beta Headers

| Beta Header | Feature |
|-------------|---------|
| `claude-code-20250219` | Claude Code integration |
| `interleaved-thinking-2025-05-14` | Interleaved thinking |
| `adaptive-thinking-2026-01-28` | Adaptive thinking |
| `effort-2025-11-24` | Effort level support |

### 5.3 Beta Constants

**Source location:** `chunks.1.mjs:2245-2270`

```javascript
// ============================================
// Beta header constants
// Location: chunks.1.mjs:2245-2270
// ============================================

// ORIGINAL (for source lookup):
xcA = "claude-code-20250219"
Hn1 = "interleaved-thinking-2025-05-14"
$L6 = "adaptive-thinking-2026-01-28"
HL6 = "effort-2025-11-24"

// READABLE (for understanding):
const CLAUDE_CODE_BETA = "claude-code-20250219";
const INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
const ADAPTIVE_THINKING_BETA = "adaptive-thinking-2026-01-28";
const EFFORT_BETA = "effort-2025-11-24";

// Mapping: xcA→CLAUDE_CODE_BETA, Hn1→INTERLEAVED_THINKING_BETA,
//          $L6→ADAPTIVE_THINKING_BETA, HL6→EFFORT_BETA
```

---

## 6. Fallback Model Behavior

### 6.1 Fallback Triggering

**What it does:** When the primary model returns an overload error, automatically switch to the fallback model.

**Conditions:**
- Only works in print mode (`--print`)
- Fallback model must be different from primary
- Triggered by API overload errors (529)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FALLBACK MODEL EXECUTION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM API Request                                                             │
│  │                                                                          │
│  ├─► Send request with primary model                                        │
│  │                                                                          │
│  ├─► Response received?                                                     │
│  │   ├─► SUCCESS → Return response                                         │
│  │   │                                                                      │
│  │   └─► ERROR (overload/529)?                                             │
│  │       │                                                                  │
│  │       ├─► fallback-model set?                                           │
│  │       │   ├─► YES → Retry with fallback model                           │
│  │       │   │       └─► Return fallback response                          │
│  │       │   │                                                              │
│  │       │   └─► NO → Return error to user                                 │
│  │       │                                                                  │
│  │       └─► Other error → Return error to user                            │
│  │                                                                          │
│  └─► Done                                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Model-Agent Integration

### 7.1 Agent Model Inheritance

When an agent is specified, it may have a default model:

```javascript
// ============================================
// Agent model inheritance
// Location: chunks.189.mjs:1366-1367
// ============================================

// ORIGINAL (for source lookup):
let lA = P1;
if (!lA && bA?.model && bA.model !== "inherit") lA = t9(bA.model);

// READABLE (for understanding):
let resolvedModel = sessionModel;

// If no CLI model and agent has non-inherit model, use agent's model
if (!resolvedModel && agentDefinition?.model && agentDefinition.model !== "inherit") {
    resolvedModel = resolveModelName(agentDefinition.model);
}

// Mapping: lA→resolvedModel, P1→sessionModel, bA→agentDefinition, t9→resolveModelName
```

---

## 8. Use Cases

### 8.1 Quick Analysis (Low Effort)

```bash
# Quick analysis with minimal thinking
claude -p --effort low "Summarize this file"
```

### 8.2 Deep Analysis (High/Max Effort)

```bash
# Deep analysis in print mode
claude -p --effort max "Analyze architecture and suggest improvements"

# High effort in interactive mode
claude --effort high
```

### 8.3 Model Switching

```bash
# Use Opus for complex tasks
claude --model opus "Complex reasoning task"

# Use Sonnet for speed
claude --model sonnet "Quick task"

# Use specific model version
claude --model claude-sonnet-4-5-20250929 "Specific version"
```

### 8.4 Fallback Configuration

```bash
# Primary with fallback for print mode
claude -p --model opus --fallback-model sonnet "Complex analysis"
```

### 8.5 Agent Selection

```bash
# Use explore agent
claude --agent explore "Find authentication code"

# Use plan agent
claude --agent plan "Design API architecture"
```

### 8.6 Beta Features

```bash
# Enable beta features
claude --betas "interleaved-thinking-2025-05-14" "effort-2025-11-24"
```

---

## 9. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.189.mjs:1023` | Commander options |
| Effort validation | `chunks.189.mjs:1130` | Max effort check |
| Model validation | `chunks.189.mjs:1128` | Fallback != primary |
| Agent resolution | `chunks.189.mjs:1350` | Agent override |
| Beta constants | `chunks.1.mjs:2245` | Beta header strings |
| Effort constants | `chunks.90.mjs:3070` | Valid effort levels |