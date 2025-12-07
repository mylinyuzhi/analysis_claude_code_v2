# Hook Types Documentation

## Overview

Claude Code v2.0.59 supports 5 types of hooks that can be executed at various points during tool usage and session lifecycle. Hooks allow customization of behavior through external commands, LLM evaluation, agents, callbacks, and JavaScript functions.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `executeCallbackHook` (Qy3) - Callback hook executor
- `executeFunctionHook` (Ay3) - Function hook executor
- `executeShellHook` (SV0) - Command hook executor
- `executePromptHook` (eP2) - Prompt hook executor
- `executeAgentHook` (aX9) - Agent hook executor

---

## Hook Output Schema

### Overview

Hook outputs are validated using Zod schemas. The system supports two primary response types: synchronous and asynchronous.

### Async Response Schema (`yK5`)

```javascript
// ============================================
// asyncResponseSchema - Async hook response validation
// Location: chunks.106.mjs:1675-1678
// ============================================

// ORIGINAL (for source lookup):
yK5 = j.object({
  async: j.literal(!0),
  asyncTimeout: j.number().optional()
})

// READABLE (for understanding):
asyncResponseSchema = z.object({
  async: z.literal(true),           // Must be exactly `true`
  asyncTimeout: z.number().optional() // Optional timeout for background task
})

// Mapping: yK5→asyncResponseSchema, j→z (Zod)
```

**When to use:** Return `{"async": true}` when hook will complete in background.

### Synchronous Response Schema (`xK5`)

```javascript
// ============================================
// syncResponseSchema - Synchronous hook response validation
// Location: chunks.106.mjs:1680-1720
// ============================================

// ORIGINAL (for source lookup):
xK5 = j.object({
  continue: j.boolean().optional(),
  suppressOutput: j.boolean().optional(),
  stopReason: j.string().optional(),
  decision: j.enum(["approve", "block"]).optional(),
  reason: j.string().optional(),
  systemMessage: j.string().optional(),
  hookSpecificOutput: j.union([...]).optional()
})

// READABLE (for understanding):
syncResponseSchema = z.object({
  // Flow control
  continue: z.boolean().optional(),        // false = stop execution
  suppressOutput: z.boolean().optional(),  // true = hide output from user
  stopReason: z.string().optional(),       // Reason for stopping

  // Permission decision (deprecated, use hookSpecificOutput)
  decision: z.enum(["approve", "block"]).optional(),
  reason: z.string().optional(),

  // Context injection
  systemMessage: z.string().optional(),    // Add message to conversation

  // Event-specific output
  hookSpecificOutput: z.union([
    preToolUseOutput,
    userPromptSubmitOutput,
    sessionStartOutput,
    subagentStartOutput,
    postToolUseOutput,
    postToolUseFailureOutput,
    permissionRequestOutput
  ]).optional()
})

// Mapping: xK5→syncResponseSchema
```

### Event-Specific Output Schemas

#### PreToolUse Output

```javascript
z.object({
  hookEventName: z.literal("PreToolUse"),
  permissionDecision: z.enum(["allow", "deny", "ask"]).optional(),
  permissionDecisionReason: z.string().optional(),
  updatedInput: z.record(z.unknown()).optional()  // Modify tool input
})
```

**Use case:** Override permission checks or modify tool inputs before execution.

#### PermissionRequest Output

```javascript
z.object({
  hookEventName: z.literal("PermissionRequest"),
  decision: z.union([
    z.object({
      behavior: z.literal("allow"),
      updatedInput: z.record(z.unknown()).optional(),
      updatedPermissions: z.array(permissionSchema).optional()
    }),
    z.object({
      behavior: z.literal("deny"),
      message: z.string().optional(),
      interrupt: z.boolean().optional()
    })
  ])
})
```

**Use case:** Auto-approve or auto-deny permission requests programmatically.

#### PostToolUse Output

```javascript
z.object({
  hookEventName: z.literal("PostToolUse"),
  additionalContext: z.string().optional(),      // Inject context
  updatedMCPToolOutput: z.unknown().optional()   // Modify MCP tool output
})
```

**Use case:** Add context to conversation or transform MCP tool outputs.

---

## Hook Type Definitions

### 1. Command Hook

Executes a bash command when triggered.

**Schema:**
```typescript
{
  type: "command",
  command: string,           // Shell command to execute
  timeout?: number,          // Timeout in seconds (default: 60)
  statusMessage?: string     // Custom status message for spinner
}
```

**Example:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Write",
      "hooks": [
        {
          "type": "command",
          "command": "echo 'File written successfully'",
          "timeout": 10,
          "statusMessage": "Running post-write validation..."
        }
      ]
    }
  ]
}
```

**Exit Code Behavior:**

| Exit Code | Outcome | Behavior |
|-----------|---------|----------|
| `0` | Success | Hook succeeds, stdout included in output |
| `2` | **Blocking Error** | Stops execution, shows error with stderr |
| Others (`1`, `3+`) | Non-blocking Error | Logs warning with stderr, continues execution |

### Command Hook Executor Implementation

```javascript
// ============================================
// executeShellHook - Shell command hook executor
// Location: chunks.146.mjs:3337-3430
// ============================================

// ORIGINAL (for source lookup):
async function SV0(A, Q, B, G, Z, I) {
  let Y = uQ(),
    J = process.env.CLAUDE_CODE_SHELL_PREFIX ? NsA(process.env.CLAUDE_CODE_SHELL_PREFIX, A.command) : A.command,
    W = A.timeout ? A.timeout * 1000 : 60000,
    X = { ...process.env, CLAUDE_PROJECT_DIR: Y };
  if (Q === "SessionStart" && I !== void 0) X.CLAUDE_ENV_FILE = LsA(I);
  let V = ok3(J, [], { env: X, cwd: W0(), shell: !0 }),
    F = qsA(V, Z, W),
    K = "", D = "";
  V.stdout.setEncoding("utf8");
  V.stderr.setEncoding("utf8");
  // ... async detection and output handling ...
}

// READABLE (for understanding):
async function executeShellHook(hook, hookEvent, hookName, hookInputJSON, signal, hookIndex) {
  let projectDir = getProjectDirectory(),
    command = process.env.CLAUDE_CODE_SHELL_PREFIX
      ? prependShellPrefix(process.env.CLAUDE_CODE_SHELL_PREFIX, hook.command)
      : hook.command,
    timeout = hook.timeout ? hook.timeout * 1000 : 60000,  // Default 60s
    env = { ...process.env, CLAUDE_PROJECT_DIR: projectDir };

  // Special env for SessionStart
  if (hookEvent === "SessionStart" && hookIndex !== undefined) {
    env.CLAUDE_ENV_FILE = getEnvFilePath(hookIndex);
  }

  // Spawn child process
  let childProcess = spawn(command, [], { env, cwd: getCwd(), shell: true }),
    shellWrapper = createShellCommandWrapper(childProcess, signal, timeout),
    stdoutBuffer = "",
    stderrBuffer = "";

  childProcess.stdout.setEncoding("utf8");
  childProcess.stderr.setEncoding("utf8");

  // Collect output and detect async hooks
  // ...
}

// Mapping: SV0→executeShellHook, A→hook, Q→hookEvent, B→hookName, G→hookInputJSON, Z→signal, I→hookIndex
```

**Key Algorithm: Async Hook Detection**

```javascript
// ============================================
// Async hook detection in command execution
// Location: chunks.146.mjs:3370-3395
// ============================================

// READABLE (for understanding):
let isAsync = false,
  asyncResolver = null,
  asyncPromise = new Promise((resolve) => { asyncResolver = resolve });

childProcess.stdout.on("data", (chunk) => {
  stdoutBuffer += chunk;

  // Check for early JSON completion (async detection)
  if (!isAsync && stdoutBuffer.trim().includes("}")) {
    isAsync = true;
    log(`Hooks: Checking initial response for async: ${stdoutBuffer.trim()}`);

    try {
      let json = JSON.parse(stdoutBuffer.trim());
      if (isAsyncHookResponse(json)) {  // {"async": true}
        let taskId = `async_hook_${childProcess.pid}`;
        log(`Hooks: Detected async hook, backgrounding process ${taskId}`);

        let backgrounded = shellWrapper.background(taskId);
        if (backgrounded) {
          // Register async task for tracking
          registerAsyncHook({
            processId: taskId,
            asyncResponse: json,
            hookEvent: hookEvent,
            // ...
          });

          // Stream remaining output
          backgrounded.stdoutStream.on("data", (data) => appendAsyncStdout(taskId, data.toString()));
          backgrounded.stderrStream.on("data", (data) => appendAsyncStderr(taskId, data.toString()));

          asyncResolver?.({ stdout: stdoutBuffer, stderr: stderrBuffer, status: 0 });
        }
      }
    } catch (e) {
      log(`Hooks: Failed to parse initial response as JSON: ${e}`);
    }
  }
});
```

---

### 2. Prompt Hook

Evaluates a prompt using an LLM to make decisions.

**Schema:**
```typescript
{
  type: "prompt",
  prompt: string,            // Prompt to evaluate
  timeout?: number,          // Timeout in seconds (default: 30)
  model?: string,            // Model to use (default: small fast model)
  statusMessage?: string     // Custom status message for spinner
}
```

**Example:**
```json
{
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Analyze this command for security risks: $ARGUMENTS. Return JSON with {ok: true} or {ok: false, reason: string}",
          "timeout": 30,
          "model": "claude-sonnet-4-5-20250929",
          "statusMessage": "Checking command safety..."
        }
      ]
    }
  ]
}
```

### Prompt Hook Executor Implementation

```javascript
// ============================================
// executePromptHook - LLM-based prompt hook executor
// Location: chunks.121.mjs:1754-1920
// ============================================

// ORIGINAL (for source lookup):
async function eP2(A, Q, B, G, Z, I, Y, J) {
  let W = J || `hook-${Vh5()}`;
  try {
    let X = r61(A.prompt, G);
    let V = { ...I, /* stripped context */ };
    let F = await TP({ input: X, mode: "prompt", context: V, ... });

    if (!F.shouldQuery) {
      // Extract text content from messages
      return { hook: A, outcome: "success", message: "hook_success", content: extractText(F.messages) }
    }

    let K = Y && Y.length > 0 ? [...Y, ...F.messages] : F.messages;
    let D = A.timeout ? A.timeout * 1000 : 30000,
      H = o9(),  // AbortController
      C = setTimeout(() => H.abort(), D),
      { signal: E, cleanup: U } = ck(Z, H.signal);

    // Force JSON by prefilling "{"
    let q = [...K, createAssistantMessage({ content: "{" })];

    try {
      let w = await wy({
        messages: q,
        systemPrompt: [`You are evaluating a hook in Claude Code.
CRITICAL: You MUST return ONLY valid JSON with no other text...
Your response must be: {"ok": true} or {"ok": false, "reason": "..."}`],
        maxThinkingTokens: 0,
        tools: I.options.tools,
        signal: E,
        options: { model: A.model ?? getSmallFastModel(), isNonInteractiveSession: true, ... }
      });
      // ... parse and validate JSON response ...
    } catch (w) {
      clearTimeout(C), U();
      if (E.aborted) return { outcome: "cancelled", hook: A };
      throw w
    }
  } catch (X) {
    return { hook: A, outcome: "non_blocking_error", message: "Error executing prompt hook" }
  }
}

// READABLE (for understanding):
async function executePromptHook(hook, hookName, hookEvent, hookInputJSON, signal, toolUseContext, messages, toolUseID) {
  let hookId = toolUseID || `hook-${generateUUID()}`;

  try {
    // Replace $ARGUMENTS placeholder
    let prompt = replaceArgumentsPlaceholder(hook.prompt, hookInputJSON);

    // Parse prompt into messages
    let parsed = await parseInput({ input: prompt, mode: "prompt", context: toolUseContext, ... });

    if (!parsed.shouldQuery) {
      // Return text content directly
      return { hook, outcome: "success", message: "hook_success", content: extractText(parsed.messages) };
    }

    let combinedMessages = messages && messages.length > 0 ? [...messages, ...parsed.messages] : parsed.messages;

    // Setup timeout
    let timeout = hook.timeout ? hook.timeout * 1000 : 30000,
      timeoutController = new AbortController(),
      timeoutHandle = setTimeout(() => timeoutController.abort(), timeout),
      { signal: combinedSignal, cleanup } = createCombinedAbortSignal(signal, timeoutController.signal);

    // Prefill "{" to force JSON response
    let messagesWithPrefill = [...combinedMessages, createAssistantMessage({ content: "{" })];

    try {
      let response = await nonStreamingApiCall({
        messages: messagesWithPrefill,
        systemPrompt: [PROMPT_HOOK_SYSTEM_PROMPT],
        maxThinkingTokens: 0,
        tools: toolUseContext.options.tools,
        signal: combinedSignal,
        options: {
          model: hook.model ?? getSmallFastModel(),
          isNonInteractiveSession: true
        }
      });

      clearTimeout(timeoutHandle);
      cleanup();

      // Extract and validate JSON
      let textContent = response.message.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");

      let jsonResponse = ("{" + textContent).trim();
      let parsed = parseJSON(jsonResponse);

      if (!parsed) {
        return { hook, outcome: "non_blocking_error", message: "JSON validation failed" };
      }

      // Validate against {ok: boolean, reason?: string} schema
      let validated = hookResultSchema.safeParse(parsed);
      if (!validated.success) {
        return { hook, outcome: "non_blocking_error", message: "Schema validation failed" };
      }

      // Check condition
      if (!validated.data.ok) {
        return {
          hook,
          outcome: "blocking",
          blockingError: {
            blockingError: `Prompt hook condition was not met: ${validated.data.reason}`,
            command: "prompt"
          },
          preventContinuation: true,
          stopReason: validated.data.reason
        };
      }

      return { hook, outcome: "success", message: "Condition met" };

    } catch (error) {
      clearTimeout(timeoutHandle);
      cleanup();
      if (combinedSignal.aborted) return { hook, outcome: "cancelled" };
      throw error;
    }
  } catch (error) {
    return { hook, outcome: "non_blocking_error", message: "Error executing prompt hook" };
  }
}

// Mapping: eP2→executePromptHook, A→hook, Q→hookName, B→hookEvent, G→hookInputJSON,
//          Z→signal, I→toolUseContext, Y→messages, J→toolUseID, ck→createCombinedAbortSignal
```

**Key Design Decision: JSON Prefilling**

The prompt hook prefills `{` as assistant content to force the LLM to return valid JSON. The response is then prepended with `{` to form complete JSON.

---

### 3. Agent Hook

Runs an agentic verifier with full tool access.

**Schema:**
```typescript
{
  type: "agent",
  prompt: string | ((messages: Message[]) => string),  // Verification task
  timeout?: number,          // Timeout in seconds (default: 60)
  model?: string,            // Model to use (default: Haiku)
  statusMessage?: string     // Custom status message for spinner
}
```

**Example:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "agent",
          "prompt": "Verify that unit tests ran and passed. Use $ARGUMENTS for command details.",
          "timeout": 120,
          "model": "claude-sonnet-4-5-20250929",
          "statusMessage": "Verifying test results..."
        }
      ]
    }
  ]
}
```

### Agent Hook Executor Implementation

```javascript
// ============================================
// executeAgentHook - Sub-agent hook executor
// Location: chunks.146.mjs:2937-3134
// ============================================

// READABLE (for understanding):
async function executeAgentHook(hook, hookName, hookEvent, hookInputJSON, signal, toolUseContext, toolUseID, messages) {
  let hookId = toolUseID || `hook-${generateUUID()}`,
    transcriptPath = toolUseContext.agentId !== getSessionId()
      ? getAgentTranscriptPath(toolUseContext.agentId)
      : getSessionTranscriptPath(),
    startTime = Date.now();

  try {
    // Replace $ARGUMENTS in prompt (prompt can be function or string)
    let prompt = replaceArgumentsPlaceholder(
      typeof hook.prompt === "function" ? hook.prompt(messages) : hook.prompt,
      hookInputJSON
    );

    // Parse prompt into messages
    let parsed = await parseInput({ input: prompt, mode: "prompt", context: toolUseContext, ... });

    if (!parsed.shouldQuery) {
      return { hook, outcome: "success", message: "hook_success" };
    }

    let initialMessages = parsed.messages;

    // Setup timeout and abort handling
    let timeout = hook.timeout ? hook.timeout * 1000 : 60000,
      agentController = new AbortController(),
      { signal: combinedSignal, cleanup } = createCombinedAbortSignal(signal, AbortSignal.timeout(timeout)),
      abortHandler = () => agentController.abort();

    combinedSignal.addEventListener("abort", abortHandler);

    try {
      // Create structured output tool for agent response
      let structuredOutputTool = createStructuredOutputTool(),  // Returns {ok: boolean, reason?: string}
        tools = [...toolUseContext.options.tools.filter(...), structuredOutputTool],
        systemPrompt = [`You are verifying a stop condition in Claude Code...
Use the ${STRUCTURED_OUTPUT_TOOL_NAME} tool to return your result.`],
        model = hook.model ?? getSmallFastModel(),
        maxTurns = 50,
        agentId = `hook-agent-${generateUUID()}`;

      // Create agent context with transcript read access
      let agentContext = {
        ...toolUseContext,
        agentId: agentId,
        abortController: agentController,
        options: {
          ...toolUseContext.options,
          tools: tools,
          mainLoopModel: model,
          isNonInteractiveSession: true,
          maxThinkingTokens: 0
        },
        // Grant read access to conversation transcript
        async getAppState() {
          return {
            ...state,
            toolPermissionContext: {
              ...state.toolPermissionContext,
              mode: "dontAsk",
              alwaysAllowRules: { session: [...existingRules, `Read(/${transcriptPath})`] }
            }
          };
        }
      };

      // Register completion requirement
      registerCompletionRequirement(
        toolUseContext.setAppState,
        agentId,
        "Stop",
        "",
        (output) => extractStructuredOutput(output, STRUCTURED_OUTPUT_TOOL_NAME),
        `You MUST call the ${STRUCTURED_OUTPUT_TOOL_NAME} tool to complete this request.`,
        { timeout: 5000 }
      );

      let result = null,
        turnCount = 0,
        maxTurnsHit = false;

      // Run agent loop
      for await (let event of mainAgentLoop({
        messages: initialMessages,
        systemPrompt: systemPrompt,
        canUseTool: toolPermissionDispatcher,
        toolUseContext: agentContext,
        querySource: "hook_agent"
      })) {
        if (event.type === "stream_event" || event.type === "stream_request_start") continue;

        if (event.type === "assistant") {
          turnCount++;
          if (turnCount >= 50) {
            maxTurnsHit = true;
            log(`Hooks: Agent turn ${turnCount} hit max turns, aborting`);
            agentController.abort();
            break;
          }
        }

        // Check for structured output
        if (event.type === "attachment" && event.attachment.type === "structured_output") {
          let validated = hookResultSchema.safeParse(event.attachment.data);
          if (validated.success) {
            result = validated.data;
            log(`Hooks: Got structured output: ${JSON.stringify(result)}`);
            agentController.abort();
            break;
          }
        }
      }

      combinedSignal.removeEventListener("abort", abortHandler);
      cleanup();
      unregisterCompletionRequirement(toolUseContext.setAppState, agentId);

      // Process result
      if (!result) {
        return { hook, outcome: "cancelled" };  // Timeout or max turns
      }

      if (!result.ok) {
        return {
          hook,
          outcome: "blocking",
          blockingError: {
            blockingError: `Agent hook condition was not met: ${result.reason}`,
            command: "agent"
          }
        };
      }

      return { hook, outcome: "success", message: "Condition met" };

    } catch (error) {
      combinedSignal.removeEventListener("abort", abortHandler);
      cleanup();
      if (combinedSignal.aborted) return { hook, outcome: "cancelled" };
      throw error;
    }
  } catch (error) {
    return { hook, outcome: "non_blocking_error", message: "Error executing agent hook" };
  }
}

// Mapping: aX9→executeAgentHook
```

**Key Features:**
- Spawns temporary sub-agent with limited tools
- Grants read access to conversation transcript
- Uses structured output tool for response (`{ok: boolean, reason?: string}`)
- Enforces 50-turn limit to prevent infinite loops

---

### 4. Callback Hook

Executes a JavaScript callback function (programmatic use only).

**Schema:**
```typescript
{
  type: "callback",
  callback: (hookInput: HookInput, toolUseID: string, signal: AbortSignal, hookIndex: number) => Promise<HookOutput>,
  timeout?: number           // Timeout in milliseconds
}
```

**Example (programmatic):**
```javascript
{
  type: "callback",
  callback: async (hookInput, toolUseID, signal, hookIndex) => {
    console.log("Tool used:", hookInput.tool_name);

    // Check abort signal
    if (signal.aborted) return { async: true };

    return {
      decision: "approve",
      systemMessage: "Tool approved by callback hook"
    };
  },
  timeout: 5000
}
```

### Callback Hook Executor Implementation

```javascript
// ============================================
// executeCallbackHook - JavaScript callback executor
// Location: chunks.147.mjs:756-784
// ============================================

// ORIGINAL (for source lookup):
async function Qy3({
  toolUseID: A,
  hook: Q,
  hookEvent: B,
  hookInput: G,
  signal: Z,
  hookIndex: I
}) {
  let Y = await Q.callback(G, A, Z, I);
  if (zYA(Y)) return { outcome: "success", hook: Q };
  return {
    ...tX9({
      json: Y,
      command: "callback",
      hookName: `${B}:Callback`,
      toolUseID: A,
      hookEvent: B,
      expectedHookEvent: B,
      stdout: void 0,
      stderr: void 0,
      exitCode: void 0
    }),
    outcome: "success",
    hook: Q
  }
}

// READABLE (for understanding):
async function executeCallbackHook({
  toolUseID,
  hook,
  hookEvent,
  hookInput,
  signal,
  hookIndex
}) {
  // Execute callback directly with hook context
  let response = await hook.callback(hookInput, toolUseID, signal, hookIndex);

  // Check for async response
  if (isAsyncHookResponse(response)) {  // {"async": true}
    return { outcome: "success", hook };
  }

  // Process JSON response for special fields
  return {
    ...processHookResponse({
      json: response,
      command: "callback",
      hookName: `${hookEvent}:Callback`,
      toolUseID,
      hookEvent,
      expectedHookEvent: hookEvent,
      stdout: undefined,
      stderr: undefined,
      exitCode: undefined
    }),
    outcome: "success",
    hook
  };
}

// Mapping: Qy3→executeCallbackHook, zYA→isAsyncHookResponse, tX9→processHookResponse
```

**Note:** Callback hooks are NOT available in JSON configuration files - they are for programmatic (SDK) use only.

---

### 5. Function Hook

Executes a JavaScript function with message access (REPL context only).

**Schema:**
```typescript
{
  type: "function",
  callback: (messages: Message[], signal: AbortSignal) => Promise<boolean>,
  errorMessage: string,      // Error message if function returns false
  timeout?: number           // Timeout in milliseconds
}
```

**Example (programmatic):**
```javascript
{
  type: "function",
  callback: async (messages, signal) => {
    // Analyze conversation messages
    const hasErrors = messages.some(m =>
      m.type === "tool_result" && m.isError
    );

    return !hasErrors; // true = approve, false = block
  },
  errorMessage: "Cannot proceed - errors detected in conversation",
  timeout: 5000
}
```

### Function Hook Executor Implementation

```javascript
// ============================================
// executeFunctionHook - Function hook executor (Stop hooks only)
// Location: chunks.147.mjs:698-754
// ============================================

// ORIGINAL (for source lookup):
async function Ay3({
  hook: A,
  messages: Q,
  hookName: B,
  toolUseID: G,
  hookEvent: Z,
  timeoutMs: I,
  signal: Y
}) {
  let J = A.timeout ?? I,
    { signal: W, cleanup: X } = ck(AbortSignal.timeout(J), Y);
  try {
    if (W.aborted) return X(), { outcome: "cancelled", hook: A };
    let V = await new Promise((F, K) => {
      let D = () => K(Error("Function hook cancelled"));
      W.addEventListener("abort", D);
      Promise.resolve(A.callback(Q, W)).then((H) => {
        W.removeEventListener("abort", D);
        F(H)
      }).catch((H) => {
        W.removeEventListener("abort", D);
        K(H)
      })
    });
    if (X(), V) return { outcome: "success", hook: A };
    return {
      blockingError: { blockingError: A.errorMessage, command: "function" },
      outcome: "blocking",
      hook: A
    }
  } catch (V) {
    X();
    if (V instanceof Error && (V.message === "Function hook cancelled" || V.name === "AbortError"))
      return { outcome: "cancelled", hook: A };
    return {
      message: l9({ type: "hook_error_during_execution", hookName: B, toolUseID: G, hookEvent: Z, content: V.message }),
      outcome: "non_blocking_error",
      hook: A
    }
  }
}

// READABLE (for understanding):
async function executeFunctionHook({
  hook,
  messages,
  hookName,
  toolUseID,
  hookEvent,
  timeoutMs,
  signal
}) {
  // Combine hook timeout with parent signal
  let timeout = hook.timeout ?? timeoutMs,
    { signal: combinedSignal, cleanup } = createCombinedAbortSignal(AbortSignal.timeout(timeout), signal);

  try {
    // Early abort check
    if (combinedSignal.aborted) {
      cleanup();
      return { outcome: "cancelled", hook };
    }

    // Wrap callback execution with abort listener
    let result = await new Promise((resolve, reject) => {
      let abortHandler = () => reject(Error("Function hook cancelled"));

      combinedSignal.addEventListener("abort", abortHandler);

      Promise.resolve(hook.callback(messages, combinedSignal))
        .then((value) => {
          combinedSignal.removeEventListener("abort", abortHandler);
          resolve(value);
        })
        .catch((error) => {
          combinedSignal.removeEventListener("abort", abortHandler);
          reject(error);
        });
    });

    cleanup();

    // Boolean result: true = success, false = blocking error
    if (result) {
      return { outcome: "success", hook };
    }

    return {
      blockingError: { blockingError: hook.errorMessage, command: "function" },
      outcome: "blocking",
      hook
    };

  } catch (error) {
    cleanup();

    // Detect cancellation vs errors
    if (error instanceof Error &&
        (error.message === "Function hook cancelled" || error.name === "AbortError")) {
      return { outcome: "cancelled", hook };
    }

    logError(error);
    return {
      message: createHookMessage({
        type: "hook_error_during_execution",
        hookName,
        toolUseID,
        hookEvent,
        content: error instanceof Error ? error.message : "Function hook execution error"
      }),
      outcome: "non_blocking_error",
      hook
    };
  }
}

// Mapping: Ay3→executeFunctionHook, ck→createCombinedAbortSignal, l9→createHookMessage
```

**Limitations:**
- **Only supported in REPL context (Stop hooks)**
- Requires messages array (not available in non-REPL contexts)
- Will error if executed outside REPL

---

## JSON Output Processing

### JSON Parser (`oX9`)

```javascript
// ============================================
// parseHookJSONOutput - Hook output JSON parser
// Location: chunks.146.mjs:3197-3225
// ============================================

// ORIGINAL (for source lookup):
function oX9(A) {
  let Q = A.trim();
  if (!Q.startsWith("{")) return { plainText: A };
  try {
    let B = JSON.parse(Q),
      G = Q91.safeParse(B);
    if (G.success) return { json: G.data };
    else {
      let I = `Hook JSON output validation failed:
${G.error.errors.map((Y) => `  - ${Y.path.join(".")}: ${Y.message}`).join("\n")}`;
      return { plainText: A, validationError: I }
    }
  } catch (B) {
    return { plainText: A }
  }
}

// READABLE (for understanding):
function parseHookJSONOutput(stdout) {
  let trimmed = stdout.trim();

  // Only parse if starts with "{"
  if (!trimmed.startsWith("{")) {
    return { plainText: stdout };
  }

  try {
    let parsed = JSON.parse(trimmed),
      validated = hookOutputSchema.safeParse(parsed);

    if (validated.success) {
      return { json: validated.data };
    } else {
      let errorMessage = `Hook JSON output validation failed:
${validated.error.errors.map((e) => `  - ${e.path.join(".")}: ${e.message}`).join("\n")}`;
      return { plainText: stdout, validationError: errorMessage };
    }
  } catch (error) {
    // Not valid JSON, treat as plain text
    return { plainText: stdout };
  }
}

// Mapping: oX9→parseHookJSONOutput, Q91→hookOutputSchema
```

### Response Processor (`tX9`)

```javascript
// ============================================
// processHookResponse - Hook JSON response processor
// Location: chunks.146.mjs:3227-3335
// ============================================

// READABLE (for understanding):
function processHookResponse({
  json,
  command,
  hookName,
  toolUseID,
  hookEvent,
  expectedHookEvent,
  stdout,
  stderr,
  exitCode
}) {
  let result = {};

  // Handle continue field
  if (json.continue === false) {
    result.preventContinuation = true;
    if (json.stopReason) result.stopReason = json.stopReason;
  }

  // Handle decision field (deprecated)
  if (json.decision) {
    switch (json.decision) {
      case "approve":
        result.permissionBehavior = "allow";
        break;
      case "block":
        result.permissionBehavior = "deny";
        result.blockingError = {
          blockingError: json.reason || "Blocked by hook",
          command
        };
        break;
    }
  }

  // Handle systemMessage
  if (json.systemMessage) {
    result.systemMessage = json.systemMessage;
  }

  // Handle hookSpecificOutput
  if (json.hookSpecificOutput) {
    // Validate event name matches
    if (expectedHookEvent && json.hookSpecificOutput.hookEventName !== expectedHookEvent) {
      throw Error(`Hook returned incorrect event name: expected '${expectedHookEvent}' but got '${json.hookSpecificOutput.hookEventName}'`);
    }

    switch (json.hookSpecificOutput.hookEventName) {
      case "PreToolUse":
        if (json.hookSpecificOutput.permissionDecision) {
          result.permissionBehavior = json.hookSpecificOutput.permissionDecision;
          if (json.hookSpecificOutput.permissionDecision === "deny") {
            result.blockingError = {
              blockingError: json.hookSpecificOutput.permissionDecisionReason || "Blocked",
              command
            };
          }
        }
        if (json.hookSpecificOutput.updatedInput) {
          result.updatedInput = json.hookSpecificOutput.updatedInput;
        }
        break;

      case "UserPromptSubmit":
      case "SessionStart":
      case "SubagentStart":
        result.additionalContext = json.hookSpecificOutput.additionalContext;
        break;

      case "PostToolUse":
        result.additionalContext = json.hookSpecificOutput.additionalContext;
        if (json.hookSpecificOutput.updatedMCPToolOutput) {
          result.updatedMCPToolOutput = json.hookSpecificOutput.updatedMCPToolOutput;
        }
        break;

      case "PermissionRequest":
        if (json.hookSpecificOutput.decision) {
          result.permissionRequestResult = json.hookSpecificOutput.decision;
          result.permissionBehavior = json.hookSpecificOutput.decision.behavior;
          if (json.hookSpecificOutput.decision.behavior === "allow" &&
              json.hookSpecificOutput.decision.updatedInput) {
            result.updatedInput = json.hookSpecificOutput.decision.updatedInput;
          }
        }
        break;
    }
  }

  return {
    ...result,
    message: result.blockingError
      ? createHookMessage({ type: "hook_blocking_error", hookName, toolUseID, ... })
      : createHookMessage({ type: "hook_success", hookName, toolUseID, content: "Success", stdout, stderr, exitCode })
  };
}

// Mapping: tX9→processHookResponse
```

---

## Timeout Handling

### Default Timeout
- All hooks default to **60 seconds** (60000 ms)
- System constant: `ZN = 60000`

### Per-Hook Timeout Override

Each hook type supports optional `timeout` field:
- **Command/Prompt/Agent hooks:** Timeout in **seconds**
- **Callback/Function hooks:** Timeout in **milliseconds**

```json
{
  "type": "command",
  "command": "npm test",
  "timeout": 300        // 5 minutes in seconds
}
```

```javascript
{
  type: "callback",
  callback: async () => { /* ... */ },
  timeout: 5000         // 5 seconds in milliseconds
}
```

### Timeout Behavior

1. **Before timeout:** Hook executes normally
2. **On timeout:**
   - Abort signal fires via `ck()` signal combiner
   - Hook execution is cancelled
   - Outcome: `"cancelled"`
   - Message: `hook_cancelled` event
3. **Cleanup:** Always runs after timeout via cleanup callback

---

## Summary Table

| Hook Type | Use Case | Configuration | Timeout Unit | REPL Only |
|-----------|----------|--------------|--------------|-----------|
| `command` | Shell commands | JSON | Seconds | No |
| `prompt` | LLM evaluation | JSON | Seconds | No |
| `agent` | Agentic verification | JSON | Seconds | No |
| `callback` | Programmatic logic | Code | Milliseconds | No |
| `function` | Message analysis | Code | Milliseconds | **Yes** |

---

## See Also

- [Hook Execution](./execution.md) - Execution flow and event types
- [Hook Configuration](./configuration.md) - Configuration and custom hook development
