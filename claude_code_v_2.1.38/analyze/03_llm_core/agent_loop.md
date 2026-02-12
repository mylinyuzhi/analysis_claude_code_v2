# Agent Loop and LLM Request Analysis

The core agent loop and LLM interaction logic are implemented in `chunks.169.mjs`. This module handles prompt construction, API request execution, streaming response processing, and fallback mechanisms.

## Core Functions

### `llmRequestGenerator` (`lOq`)
- **Location:** `chunks.169.mjs:436986`
- **Functionality:**
  - The main generator function that orchestrates the LLM request.
  - **Off-switch Check:** Checks for a "tengu-off-switch" to disable functionality if needed.
  - **Tool Schema Build:**
    - Builds the tool definitions (`G`) for the API request using `nZ6`.
    - Handles "deferred tools" (dynamic loading) if enabled.
    - Manages prompt caching markers (`P`) for tools.
  - **Message Normalization:**
    - Normalizes user and assistant messages using `WJ`, `sBA`, `iOq`, and `nOq`.
  - **Prompt Construction:**
    - Combines system prompts, including attribution headers (`lq6`), user settings (`cq6`), and MCP instructions (`FOq`).
    - Applies prompt caching to system prompts if enabled (`F9z`).
  - **Client Creation & Request:**
    - Creates the Anthropic API client (`US`).
    - Prepares the request payload (`O1` function), including:
      - Model selection.
      - Max tokens (handling thinking mode logic).
      - Tool definitions.
      - Betas (e.g., `computer-use-2024-10-22`, `prompt-caching-2024-07-31`).
    - Sends the streaming request (`stream: true`).
  - **Stream Processing:**
    - Iterates over the event stream (`l`).
    - Detects stalls (`G1 = 30000`ms timeout) and logs warnings.
    - Reconstructs the full message from `content_block_start`, `content_block_delta`, and `content_block_stop` events.
    - Handles special delta types: `input_json_delta` (for tools), `text_delta`, `thinking_delta`, `signature_delta`.
    - Enforces token limits and context window checks.
  - **Fallback:**
    - Catches streaming errors (`_1`).
    - Falls back to non-streaming mode (`dOq`) if streaming fails.

### `nonStreamingFallback` (`dOq`)
- **Location:** `chunks.169.mjs:436958`
- **Functionality:**
  - Executes a standard (non-streaming) API request as a fallback mechanism.
  - Uses `withApiRetry` (`V26`) for robustness.

### `buildSystemPrompt` (`G9z` & others)
- **Location:** `chunks.169.mjs:436267`
- **Functionality:**
  - Defines the core persona ("You are an interactive CLI tool...").
  - `Z9z`: Defines "Tone and style" instructions.
  - `f9z`: Adds instructions for `TodoWrite` tool if available.
  - `V9z`: Adds instructions for `AskUserQuestion` tool if available.
  - `N9z`: Defines "Doing tasks" guidelines (security, over-engineering avoidance).

## Key Logic Flows

1.  **Thinking Mode Handling:**
    - Checks `ok7(w.model)` to determine if the model supports adaptive thinking.
    - Adjusts `max_tokens` and adds `thinking` parameter to the API request (`x1`).
    - Manages `maxThinkingTokens`.

2.  **Prompt Caching:**
    - Uses `F9z` to build cached system prompts.
    - Can use a "stable tool" (like `Bash` or `Read`) as a cache marker to optimize cache hits (`M` logic in `lOq`).

3.  **Tool Execution:**
    - The loop processes `tool_use` blocks from the LLM response.
    - It validates tool inputs and permissions (via `getToolPermissionContext`).
    - Actual execution happens in the broader agent loop (likely invoking `call` on the tool object), and results are fed back into the context.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions identified:
- `lOq`: `llmRequestGenerator`
- `dOq`: `nonStreamingFallback`
- `US`: `createLlmClient`
- `V26`: `withApiRetry`
- `G9z`: System prompt builder (base).
