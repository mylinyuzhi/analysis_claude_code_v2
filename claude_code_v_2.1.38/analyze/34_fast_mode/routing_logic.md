# Fast Mode Routing Logic Analysis

## Module Overview

Fast Mode is a toggleable setting (`/fast`) in Claude Code that optimizes for low-latency interactions. Contrary to common assumptions, it does not necessarily switch to a smaller model by default, but rather optimizes the existing model's output configuration or routes to high-priority endpoints.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols in this document:
- `fast_mode_state`: Boolean in AppState tracking the toggle.
- `FAST_MODEL_NAME` ($S): The model targeted for fast mode (typically a Haiku variant).
- `isFastModeAvailable` (i4): Checks if the current environment and model support fast mode.
- `ANTHROPIC_SMALL_FAST_MODEL`: Environment variable for manual model override.

## Fast Mode Toggling

The `/fast` command toggles a state variable in the main application loop. When active, this state affects how prompt requests are constructed.

```javascript
// ============================================
// handleFastModeToggle - Slash command logic
// Location: chunks.110.mjs (Approximate)
// ============================================

// READABLE (for understanding):
async function handleFastModeCommand(args, context) {
    const currentState = context.appState.fast_mode_state;
    const newState = !currentState;
    
    context.setAppState({ fast_mode_state: newState });
    
    if (newState) {
        logInfo("Fast mode enabled. Using optimized routing for lower latency.");
    } else {
        logInfo("Fast mode disabled. Returning to standard model configuration.");
    }
}
```

## Model Selection and Routing (Algorithm)

**What it does:** Determines which model identifier and which API configuration to use based on the `fast_mode_state`.

**How it works:**
1. Checks the `fast_mode_state` in the request context.
2. If `true`:
   - Checks for the `ANTHROPIC_SMALL_FAST_MODEL` environment variable.
   - If not set, it defaults to a predefined high-speed model identifier ($S).
   - Adjusts parameters like `max_thinking_tokens` (often disabled in fast mode to reduce latency).
3. If `false`:
   - Uses the default model configured in the user's settings.

```javascript
// ============================================
// getModelForRequest - Logic for model selection
// Location: chunks.149.mjs:2201-2210
// ============================================

// ORIGINAL (for source lookup):
let model = ...;
if (context.fast_mode_state) {
    model = process.env.ANTHROPIC_SMALL_FAST_MODEL || getDefaultFastModel();
}

// READABLE (for understanding):
function getModelForRequest(context) {
    let targetModel = context.config.mainModel;
    
    if (context.fast_mode_state) {
        // Preference: Env override > Predefined Fast Model
        targetModel = process.env.ANTHROPIC_SMALL_FAST_MODEL || "claude-3-5-haiku-latest";
        
        // Disable heavy features in fast mode
        context.options.maxThinkingTokens = 0; 
    }
    
    return targetModel;
}
```

## Latency vs. Quality Trade-offs

Fast mode prioritizes speed over "deep reasoning":
- **Pros**: Significantly faster "Time to First Token", quicker tool execution, smoother UI feedback.
- **Cons**: May be slightly less capable for complex architectural tasks compared to the default model (if the default is Sonnet).
- **Fallback**: The system monitors performance. If the fast model encounters high error rates or "overage" (quota limits), it may temporarily fall back to the standard routing with a "cooldown" notification.

**Key insight:** Fast mode is primarily a **routing optimization**. It ensures that simple tasks (file reads, grep, small edits) are handled by a model and endpoint optimized for speed, preserving the "higher-tier" model for complex decision-making.
