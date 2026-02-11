# Steering and Real-time Correction Analysis

## Module Overview

"Steering" in Claude Code v2.1.38 refers to the mechanism by which users can provide real-time guidance or corrections to the agent while it is in the middle of a multi-turn task. This is critical for preventing the agent from pursuing a "wrong path" for too long.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key concepts:
- `enter-to-steer-in-realtime`: UI hint for local steering.
- `Interrupt Signal`: The technical mechanism for stopping the model's current generation to accept user input.

## Local Steering Mechanism

In the local CLI, steering is implemented by monitoring the keyboard during the model's response phase.

1. **Active Listen**: While the model is streaming its thought or tool calls, the CLI remains responsive to the `Enter` key.
2. **Interrupt**: When `Enter` is pressed, the CLI sends an `abort()` signal to the active LLM request.
3. **Prompt**: The agent stops work and presents a new prompt: "Enter a message to steer Claude:".
4. **Resumption**: The user's input is added to the conversation history, and the agent restarts its thought process with the new information.

## Remote Steering (Web UI)

For remote sessions, steering is handled via the **WebSocket** control channel.

```javascript
// ============================================
// RemoteSessionManager - Steering Interrupt
// Location: chunks.176.mjs:3061-3065
// ============================================

// READABLE (for understanding):
function sendInterruptToAgent() {
    logDebug("[RemoteSessionManager] Sending interrupt signal");
    this.websocket?.sendControlRequest({
        type: "interrupt",
        timestamp: new Date().toISOString()
    });
}
```

## "Implicit" Steering (Skill Discovery)

The system also uses conversation history to "steer" future behavior via Skills (Module 10). It analyzes where the user corrected the agent to suggest permanent improvements to its instructions.

**Key insight:** Steering is the solution to the "black box" agent problem. Instead of waiting for a final (possibly wrong) answer, the user can act as a supervisor, providing "negative feedback" mid-process to prune the search space.
