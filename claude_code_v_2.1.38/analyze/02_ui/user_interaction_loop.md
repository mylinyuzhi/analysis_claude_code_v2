# User Interaction Loop

> Related Symbols:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - UI & Interaction

## Overview

The User Interaction Loop in Claude Code v2.1.38 is managed by the `REPL` component (obfuscated as `TUA`). This React-based component (likely using `ink` for terminal rendering) orchestrates the entire session lifecycle, from input handling to agent execution and rendering.

## 1. Setup & Onboarding

Before the REPL starts, `showSetupScreens` (`gRq`) ensures the environment is ready.

### `showSetupScreens` (gRq)

**What it does:**
Runs a series of interactive checks and wizards before the main session.

**Sequence:**
1.  **Onboarding**: Checks `hasCompletedOnboarding`. If false, runs the onboarding wizard.
2.  **Trust Dialog**: Verifies workspace trust (unless bypassed).
3.  **System Checks**: Checks for network issues (`Wp7`) and configuration errors.
4.  **Policy Updates**: Checks for new organization policies (`RN6`).
5.  **API Key**: prompts for API key if missing.

```javascript
// ============================================
// showSetupScreens - Initial setup flow
// Location: chunks.190.mjs:758
// ============================================

// ORIGINAL:
async function gRq(A, q, K, Y, z) {
    // ...
    if (!w.hasCompletedOnboarding) {
        // ...
        await LF(A, (O) => wO.default.createElement($, { ... }));
    }
    if (q !== "bypassPermissions" && !J6(process.env.CLAUBBIT)) {
        let { TrustDialog: $ } = await ...;
        await LF(A, (_) => wO.default.createElement($, { ... }));
    }
    // ...
}

// READABLE:
async function showSetupScreens(root, permissionMode, force, commands, chrome) {
    if (isDemo) return false;
    const settings = getSettings();
    
    if (!settings.hasCompletedOnboarding) {
        const { Onboarding } = await import("./onboarding");
        await renderComponent(root, <Onboarding onDone={...} />);
    }
    
    if (permissionMode !== "bypassPermissions") {
        const { TrustDialog } = await import("./trust");
        await renderComponent(root, <TrustDialog commands={commands} />);
    }
    
    // ... Policy checks, API Key checks
}
```

---

## 2. The REPL Component (`TUA`)

**What it does:**
The main container for the interactive session. It maintains the state of the conversation, tools, and UI.

**Key State Variables:**
- `messages`: The conversation history.
- `isLoading`: Whether the agent is currently thinking/executing.
- `input`: The current user input in the text box.
- `toolPermissionContext`: Tracks approved/rejected tools.

### Core Event Handlers

#### `onSubmit` (Z$)
Handles user input from the text box.
1.  **Slash Commands**: Intercepts commands like `/help` or `/clear`.
2.  **Remote Execution**: If in remote mode, forwards input to the remote session.
3.  **Prompt Execution**: Calls `executePrompt` (`PE6`) to process the input.

#### `handleQuery` (oc)
The core bridge between the UI and the Agent Loop.
1.  **Context Building**: Calls `getToolUseContext` (`J0`) to prepare the environment for the agent.
2.  **Agent Execution**: Calls `AgentLoop` (`ZR`) to generate a response.
3.  **Streaming**: Updates the UI with partial message chunks via `handleToolUseStream` (`T11`).

```javascript
// ============================================
// handleQuery - Orchestrates agent execution
// Location: chunks.188.mjs:550
// ============================================

// ORIGINAL:
oc = dA.useCallback(async (k6, q8, FA, Yq, k7, X4, p7) => {
    // ...
    let sq = J0(k6, q8, FA, k7, p7, X4);
    // ...
    let iJ = ot({ ... }); // System Prompt
    for await (let f$ of ZR({
        messages: k6,
        systemPrompt: iJ,
        toolUseContext: sq,
        // ...
    })) T11(f$); // Handle Stream
    // ...
}, [...])

// READABLE:
const handleQuery = useCallback(async (messages, history, abortController, ..., model) => {
    // 1. Prepare Context
    const toolContext = getToolUseContext(messages, history, abortController, ...);
    
    // 2. Build System Prompt
    const systemPrompt = buildSystemPrompt({ ... });
    
    // 3. Run Agent Loop
    const agentStream = AgentLoop({
        messages,
        systemPrompt,
        toolUseContext: toolContext,
        // ...
    });
    
    // 4. Consume Stream
    for await (const chunk of agentStream) {
        handleStreamChunk(chunk);
    }
}, []);
```

---

## 3. Rendering Logic

The REPL renders a stack of components (likely using `ink`):

1.  **`Header` (`lgA`)**: Shows status, current directory, or "Transcript" toggle.
2.  **`Input` (`igA`)**: The user input field (hidden when agent is running, unless configured otherwise).
3.  **`Dialogs` (`ngA`)**: Overlays for "Tool Permission", "Message Selector", "Diff View", etc.
4.  **`MessageList` (`g91`)**: The scrollable list of conversation messages.
    *   Renders user messages, assistant thinking, tool use, and results.
    *   Supports "Thinking" output (`streamingThinking`).

**Key Insight:**
The UI logic is highly reactive. The `Agent Loop` runs effectively in a background process (via async generators), pushing updates to the `messages` state, which triggers React re-renders to update the terminal output. This separation allows for a responsive TUI even during heavy agent processing.
