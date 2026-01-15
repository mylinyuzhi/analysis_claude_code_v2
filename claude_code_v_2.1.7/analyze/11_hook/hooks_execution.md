# Hook Execution Details (2.1.7)

> Complete implementation of hook execution flow, input/output handling, and parallel execution

---

## Overview

This document covers:
1. **Hook Type Schemas** - Complete hook definition schemas
2. **Hook Execution Flow** - REPL vs non-REPL contexts
3. **Hook Input Structure** - Event-specific input schemas
4. **Hook Output Schema** - JSON output validation and handling
5. **Parallel Execution** - Concurrent hook processing
6. **Hook Type Execution** - Command, Prompt, Agent, Function hooks
7. **Event Trigger Functions** - All 12 event triggers
8. **Special Hooks** - StatusLine and FileSuggestion
9. **Settings Configuration** - Hook-related settings

---

## Hook Type Schemas (Complete Definition)

### Command Hook Schema (S75)

```javascript
// ============================================
// commandHookSchema - Shell command hook type
// Location: chunks.90.mjs:1878-1883
// ============================================

// ORIGINAL (for source lookup):
S75 = m.object({
  type: m.literal("command").describe("Bash command hook type"),
  command: m.string().describe("Shell command to execute"),
  timeout: m.number().positive().optional().describe("Timeout in seconds for this specific command"),
  statusMessage: m.string().optional().describe("Custom status message to display in spinner while hook runs"),
  once: m.boolean().optional().describe("If true, hook runs once and is removed after execution")
})

// READABLE (for understanding):
commandHookSchema = zod.object({
  type: zod.literal("command"),
  command: zod.string(),          // Shell command to execute
  timeout: zod.number().positive().optional(),  // Timeout in seconds (default 60)
  statusMessage: zod.string().optional(),       // Custom spinner status
  once: zod.boolean().optional()   // Auto-remove after first execution
})

// Mapping: S75→commandHookSchema
```

### Prompt Hook Schema (x75)

```javascript
// ============================================
// promptHookSchema - LLM prompt evaluation hook
// Location: chunks.90.mjs:1884-1890
// ============================================

// ORIGINAL (for source lookup):
x75 = m.object({
  type: m.literal("prompt").describe("LLM prompt hook type"),
  prompt: m.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
  timeout: m.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
  model: m.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses the default small fast model.'),
  statusMessage: m.string().optional().describe("Custom status message to display in spinner while hook runs"),
  once: m.boolean().optional().describe("If true, hook runs once and is removed after execution")
})

// READABLE (for understanding):
promptHookSchema = zod.object({
  type: zod.literal("prompt"),
  prompt: zod.string(),            // Prompt with $ARGUMENTS placeholder
  timeout: zod.number().positive().optional(),  // Timeout in seconds (default 30)
  model: zod.string().optional(),  // Model override (default: small fast model)
  statusMessage: zod.string().optional(),
  once: zod.boolean().optional()
})

// Mapping: x75→promptHookSchema
```

### Agent Hook Schema (y75)

```javascript
// ============================================
// agentHookSchema - Agentic verifier hook
// Location: chunks.90.mjs:1891-1897
// ============================================

// ORIGINAL (for source lookup):
y75 = m.object({
  type: m.literal("agent").describe("Agentic verifier hook type"),
  prompt: m.string().transform((A) => (Q) => A).describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
  timeout: m.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
  model: m.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-5-20250929"). If not specified, uses Haiku.'),
  statusMessage: m.string().optional().describe("Custom status message to display in spinner while hook runs"),
  once: m.boolean().optional().describe("If true, hook runs once and is removed after execution")
})

// READABLE (for understanding):
agentHookSchema = zod.object({
  type: zod.literal("agent"),
  prompt: zod.string().transform((p) => (msgs) => p),  // Prompt with $ARGUMENTS
  timeout: zod.number().positive().optional(),  // Default 60 seconds
  model: zod.string().optional(),  // Default: Haiku
  statusMessage: zod.string().optional(),
  once: zod.boolean().optional()
})

// Mapping: y75→agentHookSchema
```

**Key insight:** The `prompt` field in agent hooks is transformed into a function `(messages) => promptString` to allow access to conversation context.

### Hook Type Union (v75)

```javascript
// ============================================
// hookTypeUnion - Discriminated union of hook types
// Location: chunks.90.mjs:1898
// ============================================

// ORIGINAL:
v75 = m.discriminatedUnion("type", [S75, x75, y75])

// READABLE:
hookTypeUnion = zod.discriminatedUnion("type", [
  commandHookSchema,    // type: "command"
  promptHookSchema,     // type: "prompt"
  agentHookSchema       // type: "agent"
])

// Mapping: v75→hookTypeUnion
```

### Hook Matcher Schema (k75)

```javascript
// ============================================
// hookMatcherSchema - Hook matcher configuration
// Location: chunks.90.mjs:1898-1901
// ============================================

// ORIGINAL:
k75 = m.object({
  matcher: m.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
  hooks: m.array(v75).describe("List of hooks to execute when the matcher matches")
})

// READABLE:
hookMatcherSchema = zod.object({
  matcher: zod.string().optional(),  // Pattern: "Write", "Read|Edit", or regex
  hooks: zod.array(hookTypeUnion)    // Hooks to execute when matched
})

// Mapping: k75→hookMatcherSchema
```

### Event Hooks Schema (jb)

```javascript
// ============================================
// eventHooksSchema - Complete hooks configuration by event
// Location: chunks.90.mjs:1901
// ============================================

// ORIGINAL:
jb = m.partialRecord(m.enum(_b), m.array(k75))

// READABLE:
eventHooksSchema = zod.partialRecord(
  zod.enum(HOOK_EVENT_TYPES),  // PreToolUse, PostToolUse, etc.
  zod.array(hookMatcherSchema) // Array of matchers with hooks
)

// Mapping: jb→eventHooksSchema, _b→HOOK_EVENT_TYPES
```

---

## Hook Execution Contexts

### REPL Execution (Interactive)

```javascript
// ============================================
// executeHooksInREPL - Main hook execution in REPL context
// Location: chunks.120.mjs:1532-1908
// ============================================

// ORIGINAL (for source lookup):
async function* At({
  hookInput: A,
  toolUseID: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = fO,
  toolUseContext: Y,
  messages: J
}) {
  if (jQ().disableAllHooks) return;
  let X = A.hook_event_name,
    I = B ? `${X}:${B}` : X;
  if (Ou2()) {
    k(`Skipping ${I} hook execution - workspace trust not accepted`);
    return
  }
  let D = Y ? await Y.getAppState() : void 0,
    W = Y?.agentId ?? q0(),
    K = uU0(D, W, X, A);
  if (K.length === 0) return;
  // ... yields hook progress and results
}

// READABLE (for understanding):
async function* executeHooksInREPL({
  hookInput,
  toolUseID,
  matchQuery,
  signal,
  timeoutMs = DEFAULT_HOOK_TIMEOUT,
  toolUseContext,
  messages
}) {
  // Check if hooks are disabled
  if (getSettings().disableAllHooks) return;

  let eventType = hookInput.hook_event_name;
  let hookName = matchQuery ? `${eventType}:${matchQuery}` : eventType;

  // Check workspace trust
  if (isWorkspaceTrustRequired()) {
    logDebug(`Skipping ${hookName} hook execution - workspace trust not accepted`);
    return;
  }

  // Get app state and matching hooks
  let appState = toolUseContext ? await toolUseContext.getAppState() : undefined;
  let sessionId = toolUseContext?.agentId ?? getCurrentSessionId();
  let matchingHooks = getMatchingHooks(appState, sessionId, eventType, hookInput);

  if (matchingHooks.length === 0) return;

  // Yield progress and execute hooks in parallel
  for await (let result of executeHooksParallel(matchingHooks)) {
    yield result;
  }
}

// Mapping: At→executeHooksInREPL, A→hookInput, Q→toolUseID, B→matchQuery
// G→signal, Z→timeoutMs, Y→toolUseContext, J→messages, fO→DEFAULT_HOOK_TIMEOUT
// uU0→getMatchingHooks, Ou2→isWorkspaceTrustRequired
```

### Non-REPL Execution (Background/Batch)

```javascript
// ============================================
// executeHooksOutsideREPL - Execute hooks outside REPL context
// Location: chunks.120.mjs:1910-2023
// ============================================

// ORIGINAL (for source lookup):
async function pU0({
  getAppState: A,
  hookInput: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = fO
}) {
  let Y = Q.hook_event_name,
    J = B ? `${Y}:${B}` : Y;
  if (jQ().disableAllHooks) return k(`Skipping hooks for ${J} due to 'disableAllHooks' setting`), [];
  if (Ou2()) return k(`Skipping ${J} hook execution - workspace trust not accepted`), [];
  // ...
}

// READABLE (for understanding):
async function executeHooksOutsideREPL({
  getAppState,
  hookInput,
  matchQuery,
  signal,
  timeoutMs = DEFAULT_HOOK_TIMEOUT
}) {
  let eventType = hookInput.hook_event_name;
  let hookName = matchQuery ? `${eventType}:${matchQuery}` : eventType;

  if (getSettings().disableAllHooks) {
    logDebug(`Skipping hooks for ${hookName} due to 'disableAllHooks' setting`);
    return [];
  }

  // Only command hooks are supported outside REPL
  // Prompt and agent hooks return error messages
}

// Mapping: pU0→executeHooksOutsideREPL
```

**Key Differences:**

| Feature | REPL (At) | Non-REPL (pU0) |
|---------|-----------|----------------|
| Async Generator | Yes | No (returns array) |
| Prompt Hooks | Supported | Not supported |
| Agent Hooks | Supported | Not supported |
| Function Hooks | Supported | Error |
| Progress Events | Yes | No |

---

## Hook Input Structure

### Base Context (All Events)

```javascript
// ============================================
// createHookEnvironmentContext - Base context for all hooks
// Location: chunks.120.mjs:1169-1177
// ============================================

// ORIGINAL:
function jE(A, Q) {
  let B = Q ?? q0();
  return {
    session_id: B,
    transcript_path: Bw(B),
    cwd: o1(),
    permission_mode: A
  }
}

// READABLE:
function createHookEnvironmentContext(permissionMode, sessionId) {
  let effectiveSessionId = sessionId ?? getCurrentSessionId();
  return {
    session_id: effectiveSessionId,
    transcript_path: getSessionTranscriptPath(effectiveSessionId),
    cwd: getCurrentWorkingDirectory(),
    permission_mode: permissionMode
  };
}

// Mapping: jE→createHookEnvironmentContext, Bw→getSessionTranscriptPath, o1→getCurrentWorkingDirectory
```

### Event-Specific Input Schemas

| Event | Additional Fields |
|-------|-------------------|
| **PreToolUse** | `tool_name`, `tool_input`, `tool_use_id` |
| **PostToolUse** | `tool_name`, `tool_input`, `tool_response`, `tool_use_id` |
| **PostToolUseFailure** | `tool_name`, `tool_input`, `tool_use_id`, `error`, `is_interrupt` |
| **PermissionRequest** | `tool_name`, `tool_input`, `permission_suggestions` |
| **UserPromptSubmit** | `prompt` |
| **SessionStart** | `source`, `agent_type` |
| **SessionEnd** | `reason` |
| **SubagentStart** | `agent_id`, `agent_type` |
| **PreCompact** | `trigger`, `custom_instructions` |
| **Notification** | `message`, `title`, `notification_type` |
| **Stop** | `stop_hook_active` |

---

## Hook Output Schema

```javascript
// ============================================
// hookOutputSchema - Validation schema for hook JSON output
// Location: chunks.92.mjs:106-149
// ============================================

// ORIGINAL (for source lookup):
vG5 = m.object({
  async: m.literal(!0),
  asyncTimeout: m.number().optional()
}),
kG5 = m.object({
  continue: m.boolean().describe("Whether Claude should continue after hook").optional(),
  suppressOutput: m.boolean().describe("Hide stdout from transcript").optional(),
  stopReason: m.string().describe("Message shown when continue is false").optional(),
  decision: m.enum(["approve", "block"]).optional(),
  reason: m.string().describe("Explanation for the decision").optional(),
  systemMessage: m.string().describe("Warning message shown to the user").optional(),
  hookSpecificOutput: m.union([...]).optional()
}),
AY1 = m.union([vG5, kG5])

// READABLE (for understanding):
asyncHookResponseSchema = zod.object({
  async: zod.literal(true),
  asyncTimeout: zod.number().optional()
});

syncHookOutputSchema = zod.object({
  continue: zod.boolean().optional(),        // Default: true
  suppressOutput: zod.boolean().optional(),  // Default: false
  stopReason: zod.string().optional(),
  decision: zod.enum(["approve", "block"]).optional(),
  reason: zod.string().optional(),
  systemMessage: zod.string().optional(),
  hookSpecificOutput: hookSpecificOutputUnion.optional()
});

hookOutputSchema = zod.union([asyncHookResponseSchema, syncHookOutputSchema]);

// Mapping: vG5→asyncHookResponseSchema, kG5→syncHookOutputSchema, AY1→hookOutputSchema
```

### Event-Specific Output Fields

```javascript
// hookSpecificOutput union by event type:

// PreToolUse
{
  hookEventName: "PreToolUse",
  permissionDecision: "allow" | "deny" | "ask",  // Override permission
  permissionDecisionReason: string,
  updatedInput: Record<string, unknown>          // Modified tool input
}

// PermissionRequest
{
  hookEventName: "PermissionRequest",
  decision: {
    behavior: "allow",
    updatedInput: Record<string, unknown>,
    updatedPermissions: Permission[]
  } | {
    behavior: "deny",
    message: string,
    interrupt: boolean
  }
}

// PostToolUse
{
  hookEventName: "PostToolUse",
  additionalContext: string,
  updatedMCPToolOutput: unknown  // Modify MCP tool output
}

// UserPromptSubmit, SessionStart, SubagentStart, PostToolUseFailure
{
  hookEventName: "...",
  additionalContext: string
}
```

---

## Hook Output Processing

```javascript
// ============================================
// parseHookOutput - Parse and validate hook JSON output
// Location: chunks.120.mjs:1179-1207
// ============================================

// ORIGINAL (for source lookup):
function Mu2(A) {
  let Q = A.trim();
  if (!Q.startsWith("{")) return k("Hook output does not start with {, treating as plain text"), {
    plainText: A
  };
  try {
    let B = AQ(Q),
      G = AY1.safeParse(B);
    if (G.success) return k("Successfully parsed and validated hook JSON output"), {
      json: G.data
    };
    else {
      let Y = `Hook JSON output validation failed:
${G.error.issues.map((J)=>`  - ${J.path.join(".")}: ${J.message}`).join(`
`)}

Expected schema: ...`;
      return k(Y), { plainText: A, validationError: Y }
    }
  } catch (B) {
    return k(`Failed to parse hook output as JSON: ${B}`), { plainText: A }
  }
}

// READABLE (for understanding):
function parseHookOutput(rawOutput) {
  let trimmed = rawOutput.trim();

  // Not JSON - return as plain text
  if (!trimmed.startsWith("{")) {
    logDebug("Hook output does not start with {, treating as plain text");
    return { plainText: rawOutput };
  }

  try {
    let parsed = JSON.parse(trimmed);
    let validation = hookOutputSchema.safeParse(parsed);

    if (validation.success) {
      logDebug("Successfully parsed and validated hook JSON output");
      return { json: validation.data };
    } else {
      // Validation failed - return with error
      let errorMessage = `Hook JSON output validation failed:\n${formatZodErrors(validation.error)}`;
      logDebug(errorMessage);
      return { plainText: rawOutput, validationError: errorMessage };
    }
  } catch (parseError) {
    logDebug(`Failed to parse hook output as JSON: ${parseError}`);
    return { plainText: rawOutput };
  }
}

// Mapping: Mu2→parseHookOutput, AY1→hookOutputSchema, AQ→JSON.parse
```

---

## Parallel Hook Execution

```javascript
// ============================================
// Hook parallel execution via SVA
// Location: chunks.120.mjs:1810-1818
// ============================================

// ORIGINAL (for source lookup):
let H = K.map(async ({hook: $, pluginRoot: O}, L) => {
  // Execute each hook
  // ... (hook execution logic)
});

for await (let $ of SVA(H)) {
  if (E[$.outcome]++, $.preventContinuation) yield {
    preventContinuation: !0,
    stopReason: $.stopReason
  };
  // ... process results
}

// READABLE (for understanding):
let hookPromises = matchingHooks.map(async ({hook, pluginRoot}, index) => {
  // Execute each hook asynchronously
  return await executeHook(hook, pluginRoot, index);
});

// Process results as they complete (parallel streaming)
for await (let result of streamAsyncIterator(hookPromises)) {
  outcomeCounters[result.outcome]++;

  if (result.preventContinuation) {
    yield { preventContinuation: true, stopReason: result.stopReason };
  }
  // ... yield other results
}

// Mapping: SVA→streamAsyncIterator (parallel async iterator)
```

**Key insight:** Hooks are executed in parallel using `SVA`, which yields results as each hook completes, allowing for efficient concurrent processing.

---

## Command Hook Execution

```javascript
// ============================================
// executeCommandHook - Execute shell command hook
// Location: chunks.120.mjs:1319-1416
// ============================================

// ORIGINAL (for source lookup):
async function CK1(A, Q, B, G, Z, Y, J) {
  let X = EQ(),
    I = A.command;
  if (J) I = I.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, J);
  let D = process.env.CLAUDE_CODE_SHELL_PREFIX ? o51(process.env.CLAUDE_CODE_SHELL_PREFIX, I) : I,
    W = A.timeout ? A.timeout * 1000 : 60000,
    K = {
      ...process.env,
      CLAUDE_PROJECT_DIR: X
    };
  if (J) K.CLAUDE_PLUGIN_ROOT = J;
  if (Q === "SessionStart" && Y !== void 0) K.CLAUDE_ENV_FILE = SA2(Y);
  let V = il5(D, [], {
      env: K,
      cwd: o1(),
      shell: !0
    }),
    // ... capture stdout/stderr
}

// READABLE (for understanding):
async function executeCommandHook(hook, eventType, hookName, inputJson, signal, hookIndex, pluginRoot) {
  let projectDir = getProjectDirectory();
  let command = hook.command;

  // Replace plugin root placeholder
  if (pluginRoot) {
    command = command.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);
  }

  // Apply shell prefix if configured
  let shellCommand = process.env.CLAUDE_CODE_SHELL_PREFIX
    ? prefixCommand(process.env.CLAUDE_CODE_SHELL_PREFIX, command)
    : command;

  // Hook timeout (default 60s, or hook-specific)
  let timeoutMs = hook.timeout ? hook.timeout * 1000 : 60000;

  // Build environment variables
  let env = {
    ...process.env,
    CLAUDE_PROJECT_DIR: projectDir
  };
  if (pluginRoot) env.CLAUDE_PLUGIN_ROOT = pluginRoot;
  if (eventType === "SessionStart" && hookIndex !== undefined) {
    env.CLAUDE_ENV_FILE = getEnvFilePath(hookIndex);
  }

  // Spawn shell process
  let childProcess = spawn(shellCommand, [], {
    env: env,
    cwd: getCurrentWorkingDirectory(),
    shell: true
  });

  // Write hook input to stdin
  // Capture stdout/stderr
  // Return { stdout, stderr, status, aborted }
}

// Mapping: CK1→executeCommandHook, EQ→getProjectDirectory, il5→spawn
// o51→prefixCommand, o1→getCurrentWorkingDirectory, SA2→getEnvFilePath
```

---

## Environment Variables Passed to Hooks

| Variable | Description | When Set |
|----------|-------------|----------|
| `CLAUDE_PROJECT_DIR` | Project root directory | Always |
| `CLAUDE_PLUGIN_ROOT` | Plugin installation directory | Plugin hooks only |
| `CLAUDE_ENV_FILE` | Path to env file | SessionStart hook |
| `CLAUDE_CODE_SHELL_PREFIX` | Command prefix (system env) | If configured |

---

## Prompt Hook Execution

```javascript
// ============================================
// executePromptHook - Execute LLM prompt evaluation hook
// Location: chunks.92.mjs:387-515
// ============================================

// ORIGINAL (for source lookup):
async function w82(A, Q, B, G, Z, Y, J, X) {
  let I = X || `hook-${bG5()}`;
  try {
    let D = BY1(A.prompt, G);
    k(`Hooks: Processing prompt hook with prompt: ${D}`);
    let W = H0({ content: D }),
      K = J && J.length > 0 ? [...J, W] : [W];
    k(`Hooks: Querying model with ${K.length} messages`);
    let V = A.timeout ? A.timeout * 1000 : 30000,
      F = c9(),
      H = setTimeout(() => { F.abort() }, V),
      { signal: E, cleanup: z } = u_(Z, F.signal),
      $ = [...K, QU({ content: "{" })];
    try {
      let O = await Pd({
        messages: $,
        systemPrompt: [`You are evaluating a hook in Claude Code.

CRITICAL: You MUST return ONLY valid JSON with no other text, explanation, or commentary before or after the JSON. Do not include any markdown code blocks, thinking, or additional text.

Your response must be a single JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}

Return the JSON object directly with no preamble or explanation.`],
        maxThinkingTokens: 0,
        tools: Y.options.tools,
        signal: E,
        options: {
          async getToolPermissionContext() {
            return (await Y.getAppState()).toolPermissionContext
          },
          model: A.model ?? SD(),
          toolChoice: void 0,
          isNonInteractiveSession: !0,
          hasAppendSystemPrompt: !1,
          agents: [],
          querySource: "hook_prompt",
          mcpTools: [],
          agentId: Y.agentId
        }
      });
      clearTimeout(H), z();
      let L = O.message.content.filter((x) => x.type === "text").map((x) => x.text).join("");
      Y.setResponseLength((x) => x + L.length);
      let M = ("{" + L).trim();
      k(`Hooks: Model response: ${M}`);
      let _ = c5(M);
      if (!_) return /* non_blocking_error */;
      let j = WyA.safeParse(_);
      if (!j.success) return /* schema validation error */;
      if (!j.data.ok) return {
        hook: A,
        outcome: "blocking",
        blockingError: { blockingError: `Condition not met: ${j.data.reason}` }
      };
      return { hook: A, outcome: "success", message: /* success message */ };
    } catch (O) { /* error handling */ }
  } catch (D) { /* error handling */ }
}

// READABLE (for understanding):
async function executePromptHook(hook, hookName, eventType, inputJson, signal, toolUseContext, messages, toolUseID) {
  let hookId = toolUseID || `hook-${generateId()}`;

  try {
    // 1. Substitute $ARGUMENTS placeholder in prompt
    let prompt = substituteArguments(hook.prompt, inputJson);
    logDebug(`Hooks: Processing prompt hook with prompt: ${prompt}`);

    // 2. Build message array
    let userMessage = createUserMessage({ content: prompt });
    let messagesArray = messages && messages.length > 0 ? [...messages, userMessage] : [userMessage];

    // 3. Set up timeout (default 30 seconds)
    let timeoutMs = hook.timeout ? hook.timeout * 1000 : 30000;
    let abortController = new AbortController();
    let timeout = setTimeout(() => abortController.abort(), timeoutMs);
    let { signal: combinedSignal, cleanup } = combineSignals(signal, abortController.signal);

    // 4. Add assistant prefix "{" to force JSON output
    let promptMessages = [...messagesArray, createAssistantMessage({ content: "{" })];

    // 5. Query LLM with specific system prompt for JSON evaluation
    let response = await queryLLM({
      messages: promptMessages,
      systemPrompt: [PROMPT_HOOK_SYSTEM_PROMPT],  // See below
      maxThinkingTokens: 0,
      tools: toolUseContext.options.tools,
      signal: combinedSignal,
      options: {
        model: hook.model ?? getSmallFastModel(),
        querySource: "hook_prompt",
        isNonInteractiveSession: true,
        // ... other options
      }
    });

    clearTimeout(timeout);
    cleanup();

    // 6. Parse response as JSON
    let textContent = response.message.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("");

    // Prepend "{" since we gave it as assistant prefix
    let jsonOutput = ("{" + textContent).trim();
    logDebug(`Hooks: Model response: ${jsonOutput}`);

    // 7. Validate against schema
    let parsed = parseJSON(jsonOutput);
    if (!parsed) {
      return { hook, outcome: "non_blocking_error", message: /* error */ };
    }

    let validation = promptHookResponseSchema.safeParse(parsed);
    if (!validation.success) {
      return { hook, outcome: "non_blocking_error", message: /* validation error */ };
    }

    // 8. Check condition result
    if (!validation.data.ok) {
      return {
        hook,
        outcome: "blocking",
        blockingError: { blockingError: `Condition not met: ${validation.data.reason}` }
      };
    }

    return { hook, outcome: "success", message: /* success message */ };

  } catch (error) {
    return { hook, outcome: "non_blocking_error", message: /* error message */ };
  }
}

// Mapping: w82→executePromptHook, A→hook, Q→hookName, B→eventType, G→inputJson
// Z→signal, Y→toolUseContext, J→messages, X→toolUseID
// BY1→substituteArguments, SD→getSmallFastModel, Pd→queryLLM, WyA→promptHookResponseSchema
```

### Prompt Hook System Prompt

The prompt hook uses a specific system prompt to force structured JSON output:

```
You are evaluating a hook in Claude Code.

CRITICAL: You MUST return ONLY valid JSON with no other text, explanation, or commentary
before or after the JSON. Do not include any markdown code blocks, thinking, or additional text.

Your response must be a single JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}

Return the JSON object directly with no preamble or explanation.
```

### Prompt Hook Response Schema (WyA)

```javascript
// ORIGINAL:
WyA = m.object({
  ok: m.boolean(),
  reason: m.string().optional()
})

// READABLE:
promptHookResponseSchema = zod.object({
  ok: zod.boolean(),           // Condition met?
  reason: zod.string().optional()  // Explanation if not met
})
```

**Key insight:** The prompt hook uses an "assistant prefix" technique - it starts the response with `{` in the assistant message to force the model to output JSON directly.

---

## Agent Hook Execution

```javascript
// ============================================
// executeAgentHook - Execute agentic verifier hook
// Location: chunks.120.mjs:986-1142
// ============================================

// ORIGINAL (for source lookup):
async function Nu2(A, Q, B, G, Z, Y, J, X) {
  let I = J || `hook-${qu2()}`,
    D = Y.agentId ? yb(Y.agentId) : uz(),
    W = Date.now();
  try {
    let K = BY1(A.prompt(X), G);  // Replace $ARGUMENTS
    k(`Hooks: Processing agent hook with prompt: ${K}`);
    // ... spawn agent with tools, run agent loop
    // ... check for structured output with ok/reason
  }
}

// READABLE (for understanding):
async function executeAgentHook(hook, hookName, eventType, inputJson, signal, toolUseContext, toolUseID, messages) {
  let agentId = toolUseID || `hook-${generateId()}`;
  let transcriptPath = toolUseContext.agentId
    ? getAgentTranscriptPath(toolUseContext.agentId)
    : getSessionTranscriptPath();
  let startTime = Date.now();

  try {
    // Substitute $ARGUMENTS placeholder in prompt
    let prompt = substituteArguments(hook.prompt(messages), inputJson);
    logDebug(`Hooks: Processing agent hook with prompt: ${prompt}`);

    // Run agent with limited tools (no Task tool)
    let systemPrompt = `You are verifying a stop condition in Claude Code.
Your task is to verify that the agent completed the given plan.
The conversation transcript is available at: ${transcriptPath}`;

    // Agent loop with max 50 turns
    for await (let event of runAgentLoop(...)) {
      if (event.type === "attachment" && event.attachment.type === "structured_output") {
        let result = structuredOutputSchema.safeParse(event.attachment.data);
        if (result.success) {
          // Check if condition is met
          if (!result.data.ok) {
            return {
              hook,
              outcome: "blocking",
              blockingError: { blockingError: `Condition not met: ${result.data.reason}` }
            };
          }
          return { hook, outcome: "success", message: ... };
        }
      }
    }

    return { hook, outcome: "cancelled" };  // No structured output
  } catch (error) {
    return { hook, outcome: "non_blocking_error", message: ... };
  }
}

// Mapping: Nu2→executeAgentHook, BY1→substituteArguments, qu2→generateId
```

**Agent Hook Structured Output:**
```javascript
{
  ok: boolean,      // Condition met?
  reason?: string   // If not ok, why
}
```

---

## Hook Result Types

| Outcome | Description | Effect |
|---------|-------------|--------|
| `success` | Hook completed successfully | Continue execution |
| `blocking` | Hook returned blocking error | Stop tool execution |
| `non_blocking_error` | Hook failed but non-fatal | Continue with warning |
| `cancelled` | Hook was cancelled (timeout/abort) | Continue |

---

## Async Hook Processing

```javascript
// ============================================
// registerAsyncHook - Track hooks running asynchronously
// Location: chunks.92.mjs:175-198
// ============================================

// ORIGINAL:
function H82({
  processId: A,
  asyncResponse: Q,
  hookName: B,
  hookEvent: G,
  command: Z,
  shellCommand: Y,
  toolName: J
}) {
  let X = Q.asyncTimeout || 15000;
  k(`Hooks: Registering async hook ${A} (${B}) with timeout ${X}ms`);
  Td.set(A, {
    processId: A,
    hookName: B,
    hookEvent: G,
    toolName: J,
    command: Z,
    startTime: Date.now(),
    timeout: X,
    stdout: "",
    stderr: "",
    responseAttachmentSent: !1,
    shellCommand: Y
  })
}

// READABLE:
function registerAsyncHook({ processId, asyncResponse, hookName, hookEvent, command, shellCommand, toolName }) {
  let timeout = asyncResponse.asyncTimeout || 15000;
  logDebug(`Hooks: Registering async hook ${processId} (${hookName}) with timeout ${timeout}ms`);

  asyncHookRegistry.set(processId, {
    processId,
    hookName,
    hookEvent,
    toolName,
    command,
    startTime: Date.now(),
    timeout,
    stdout: "",
    stderr: "",
    responseAttachmentSent: false,
    shellCommand
  });
}

// Mapping: H82→registerAsyncHook, Td→asyncHookRegistry
```

**Async Hook Flow:**
1. Hook returns `{ async: true, asyncTimeout: 15000 }`
2. `registerAsyncHook` tracks the running process
3. `addAsyncHookStdout` (`E82`) accumulates output
4. `checkAsyncHooks` (`$82`) polls for completion

---

## Event Trigger Functions

All 12 hook events have dedicated trigger functions:

### PreToolUse (lU0)

```javascript
// ============================================
// executePreToolHooks - Trigger PreToolUse hooks
// Location: chunks.120.mjs:2027-2043
// ============================================

// ORIGINAL:
async function* lU0(A, Q, B, G, Z, Y, J = fO) {
  k(`executePreToolHooks called for tool: ${A}`);
  let X = {
    ...jE(Z),
    hook_event_name: "PreToolUse",
    tool_name: A,
    tool_input: B,
    tool_use_id: Q
  };
  yield* At({ hookInput: X, toolUseID: Q, matchQuery: A, signal: Y, timeoutMs: J, toolUseContext: G });
}

// READABLE:
async function* executePreToolHooks(toolName, toolUseId, toolInput, toolUseContext, permissionMode, signal, timeoutMs = DEFAULT_TIMEOUT) {
  logDebug(`executePreToolHooks called for tool: ${toolName}`);
  let hookInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "PreToolUse",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseId
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: toolUseId, matchQuery: toolName, signal, timeoutMs, toolUseContext });
}

// Mapping: lU0→executePreToolHooks, A→toolName, Q→toolUseId, B→toolInput, G→toolUseContext
```

### PostToolUse (iU0)

```javascript
// ============================================
// executePostToolHooks - Trigger PostToolUse hooks
// Location: chunks.120.mjs:2046-2062
// ============================================

// ORIGINAL:
async function* iU0(A, Q, B, G, Z, Y, J, X = fO) {
  let I = {
    ...jE(Y),
    hook_event_name: "PostToolUse",
    tool_name: A,
    tool_input: B,
    tool_response: G,
    tool_use_id: Q
  };
  yield* At({ hookInput: I, toolUseID: Q, matchQuery: A, signal: J, timeoutMs: X, toolUseContext: Z });
}

// READABLE:
async function* executePostToolHooks(toolName, toolUseId, toolInput, toolResponse, toolUseContext, permissionMode, signal, timeoutMs = DEFAULT_TIMEOUT) {
  let hookInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "PostToolUse",
    tool_name: toolName,
    tool_input: toolInput,
    tool_response: toolResponse,
    tool_use_id: toolUseId
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: toolUseId, matchQuery: toolName, signal, timeoutMs, toolUseContext });
}

// Mapping: iU0→executePostToolHooks
```

### PostToolUseFailure (nU0)

```javascript
// ============================================
// executePostToolFailureHooks - Trigger PostToolUseFailure hooks
// Location: chunks.120.mjs:2065-2083
// ============================================

// ORIGINAL:
async function* nU0(A, Q, B, G, Z, Y, J, X, I = fO) {
  let D = {
    ...jE(J),
    hook_event_name: "PostToolUseFailure",
    tool_name: A,
    tool_input: B,
    tool_use_id: Q,
    error: G,
    is_interrupt: Y
  };
  yield* At({ hookInput: D, toolUseID: Q, matchQuery: A, signal: X, timeoutMs: I, toolUseContext: Z });
}

// READABLE:
async function* executePostToolFailureHooks(toolName, toolUseId, toolInput, error, isInterrupt, toolUseContext, permissionMode, signal, timeoutMs = DEFAULT_TIMEOUT) {
  let hookInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "PostToolUseFailure",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseId,
    error: error,
    is_interrupt: isInterrupt
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: toolUseId, matchQuery: toolName, signal, timeoutMs, toolUseContext });
}

// Mapping: nU0→executePostToolFailureHooks
```

### Notification (vE0)

```javascript
// ============================================
// executeNotificationHooks - Trigger Notification hooks (non-REPL)
// Location: chunks.120.mjs:2085-2102
// ============================================

// ORIGINAL:
async function vE0(A, Q = fO) {
  let { message: B, title: G, notificationType: Z } = A,
    Y = {
      ...jE(void 0),
      hook_event_name: "Notification",
      message: B,
      title: G,
      notification_type: Z
    };
  await pU0({ hookInput: Y, timeoutMs: Q, matchQuery: Z });
}

// READABLE:
async function executeNotificationHooks(notification, timeoutMs = DEFAULT_TIMEOUT) {
  let { message, title, notificationType } = notification;
  let hookInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: "Notification",
    message: message,
    title: title,
    notification_type: notificationType
  };
  await executeHooksOutsideREPL({ hookInput, timeoutMs, matchQuery: notificationType });
}

// Mapping: vE0→executeNotificationHooks
```

### Stop/SubagentStop (aU0)

```javascript
// ============================================
// executeStopHooks - Trigger Stop or SubagentStop hooks
// Location: chunks.120.mjs:2104-2124
// ============================================

// ORIGINAL:
async function* aU0(A, Q, B = fO, G = !1, Z, Y, J) {
  let X = Z ? {
    ...jE(A),
    hook_event_name: "SubagentStop",
    stop_hook_active: G,
    agent_id: Z,
    agent_transcript_path: yb(Z)
  } : {
    ...jE(A),
    hook_event_name: "Stop",
    stop_hook_active: G
  };
  yield* At({ hookInput: X, timeoutMs: B, signal: Q, toolUseContext: Y, messages: J });
}

// READABLE:
async function* executeStopHooks(permissionMode, signal, timeoutMs = DEFAULT_TIMEOUT, stopHookActive = false, agentId, toolUseContext, messages) {
  // If agentId provided, trigger SubagentStop; otherwise Stop
  let hookInput = agentId ? {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "SubagentStop",
    stop_hook_active: stopHookActive,
    agent_id: agentId,
    agent_transcript_path: getAgentTranscriptPath(agentId)
  } : {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "Stop",
    stop_hook_active: stopHookActive
  };
  yield* executeHooksInREPL({ hookInput, timeoutMs, signal, toolUseContext, messages });
}

// Mapping: aU0→executeStopHooks, yb→getAgentTranscriptPath
```

### UserPromptSubmit (oU0)

```javascript
// ============================================
// executeUserPromptSubmitHooks - Trigger UserPromptSubmit hooks
// Location: chunks.120.mjs:2126-2139
// ============================================

// ORIGINAL:
async function* oU0(A, Q, B) {
  let G = {
    ...jE(Q),
    hook_event_name: "UserPromptSubmit",
    prompt: A
  };
  yield* At({ hookInput: G, toolUseID: tHA(), matchQuery: void 0, signal: B });
}

// READABLE:
async function* executeUserPromptSubmitHooks(prompt, permissionMode, signal) {
  let hookInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "UserPromptSubmit",
    prompt: prompt
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: generateToolUseId(), matchQuery: undefined, signal });
}

// Mapping: oU0→executeUserPromptSubmitHooks, tHA→generateToolUseId
```

### SessionStart (rU0)

```javascript
// ============================================
// executeSessionStartHooks - Trigger SessionStart hooks
// Location: chunks.120.mjs:2141-2155
// ============================================

// ORIGINAL:
async function* rU0(A, Q, B, G, Z = fO) {
  let Y = {
    ...jE(void 0, Q),
    hook_event_name: "SessionStart",
    source: A,
    agent_type: B
  };
  yield* At({ hookInput: Y, toolUseID: tHA(), matchQuery: void 0, signal: G, timeoutMs: Z });
}

// READABLE:
async function* executeSessionStartHooks(source, sessionId, agentType, signal, timeoutMs = DEFAULT_TIMEOUT) {
  let hookInput = {
    ...createHookEnvironmentContext(undefined, sessionId),
    hook_event_name: "SessionStart",
    source: source,      // "cli", "ide", "api", etc.
    agent_type: agentType
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: generateToolUseId(), matchQuery: undefined, signal, timeoutMs });
}

// Mapping: rU0→executeSessionStartHooks
```

### SubagentStart (kz0)

```javascript
// ============================================
// executeSubagentStartHooks - Trigger SubagentStart hooks
// Location: chunks.120.mjs:2157-2171
// ============================================

// ORIGINAL:
async function* kz0(A, Q, B, G = fO) {
  let Z = {
    ...jE(void 0),
    hook_event_name: "SubagentStart",
    agent_id: A,
    agent_type: Q
  };
  yield* At({ hookInput: Z, toolUseID: tHA(), matchQuery: Q, signal: B, timeoutMs: G });
}

// READABLE:
async function* executeSubagentStartHooks(agentId, agentType, signal, timeoutMs = DEFAULT_TIMEOUT) {
  let hookInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: "SubagentStart",
    agent_id: agentId,
    agent_type: agentType
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: generateToolUseId(), matchQuery: agentType, signal, timeoutMs });
}

// Mapping: kz0→executeSubagentStartHooks
```

### PreCompact (sU0)

```javascript
// ============================================
// executePreCompactHooks - Trigger PreCompact hooks (non-REPL)
// Location: chunks.120.mjs:2173-2202
// ============================================

// ORIGINAL:
async function sU0(A, Q, B = fO) {
  let G = {
      ...jE(void 0),
      hook_event_name: "PreCompact",
      trigger: A.trigger,
      custom_instructions: A.customInstructions
    },
    Z = await pU0({ hookInput: G, matchQuery: A.trigger, signal: Q, timeoutMs: B });
  if (Z.length === 0) return {};
  let Y = Z.filter((X) => X.succeeded && X.output.trim().length > 0).map((X) => X.output.trim()),
    J = [];
  for (let X of Z)
    if (X.succeeded)
      if (X.output.trim()) J.push(`PreCompact [${X.command}] completed successfully: ${X.output.trim()}`);
      else J.push(`PreCompact [${X.command}] completed successfully`);
    else if (X.output.trim()) J.push(`PreCompact [${X.command}] failed: ${X.output.trim()}`);
    else J.push(`PreCompact [${X.command}] failed`);
  return {
    newCustomInstructions: Y.length > 0 ? Y.join("\n\n") : void 0,
    userDisplayMessage: J.length > 0 ? J.join("\n") : void 0
  }
}

// READABLE:
async function executePreCompactHooks(params, signal, timeoutMs = DEFAULT_TIMEOUT) {
  let hookInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: "PreCompact",
    trigger: params.trigger,           // "auto" | "manual" | etc.
    custom_instructions: params.customInstructions
  };

  let results = await executeHooksOutsideREPL({ hookInput, matchQuery: params.trigger, signal, timeoutMs });
  if (results.length === 0) return {};

  // Collect successful outputs for new custom instructions
  let successOutputs = results
    .filter(r => r.succeeded && r.output.trim().length > 0)
    .map(r => r.output.trim());

  // Build user display message
  let displayMessages = results.map(r => {
    if (r.succeeded) {
      return r.output.trim()
        ? `PreCompact [${r.command}] completed successfully: ${r.output.trim()}`
        : `PreCompact [${r.command}] completed successfully`;
    } else {
      return r.output.trim()
        ? `PreCompact [${r.command}] failed: ${r.output.trim()}`
        : `PreCompact [${r.command}] failed`;
    }
  });

  return {
    newCustomInstructions: successOutputs.length > 0 ? successOutputs.join("\n\n") : undefined,
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join("\n") : undefined
  };
}

// Mapping: sU0→executePreCompactHooks
```

**Key insight:** PreCompact hooks can return custom instructions that are injected into the compacted context.

### SessionEnd (tU0)

```javascript
// ============================================
// executeSessionEndHooks - Trigger SessionEnd hooks (non-REPL)
// Location: chunks.120.mjs:2204-2228
// ============================================

// ORIGINAL:
async function tU0(A, Q) {
  let { getAppState: B, setAppState: G, signal: Z, timeoutMs: Y = fO } = Q || {},
    J = {
      ...jE(void 0),
      hook_event_name: "SessionEnd",
      reason: A
    },
    X = await pU0({ getAppState: B, hookInput: J, matchQuery: A, signal: Z, timeoutMs: Y });
  for (let I of X)
    if (!I.succeeded && I.output) process.stderr.write(`SessionEnd hook [${I.command}] failed: ${I.output}\n`);
  if (G) {
    let I = q0();
    wVA(G, I)
  }
}

// READABLE:
async function executeSessionEndHooks(reason, options) {
  let { getAppState, setAppState, signal, timeoutMs = DEFAULT_TIMEOUT } = options || {};
  let hookInput = {
    ...createHookEnvironmentContext(undefined),
    hook_event_name: "SessionEnd",
    reason: reason   // "user_exit", "error", "completed", etc.
  };

  let results = await executeHooksOutsideREPL({ getAppState, hookInput, matchQuery: reason, signal, timeoutMs });

  // Log any failed hooks to stderr
  for (let result of results) {
    if (!result.succeeded && result.output) {
      process.stderr.write(`SessionEnd hook [${result.command}] failed: ${result.output}\n`);
    }
  }

  // Clear session hooks
  if (setAppState) {
    let sessionId = getCurrentSessionId();
    clearSessionHooks(setAppState, sessionId);
  }
}

// Mapping: tU0→executeSessionEndHooks, wVA→clearSessionHooks, q0→getCurrentSessionId
```

### PermissionRequest (eU0)

```javascript
// ============================================
// executePermissionRequestHooks - Trigger PermissionRequest hooks
// Location: chunks.120.mjs:2230-2247
// ============================================

// ORIGINAL:
async function* eU0(A, Q, B, G, Z, Y, J, X = fO) {
  k(`executePermissionRequestHooks called for tool: ${A}`);
  let I = {
    ...jE(Z),
    hook_event_name: "PermissionRequest",
    tool_name: A,
    tool_input: B,
    permission_suggestions: Y
  };
  yield* At({ hookInput: I, toolUseID: Q, matchQuery: A, signal: J, timeoutMs: X, toolUseContext: G });
}

// READABLE:
async function* executePermissionRequestHooks(toolName, toolUseId, toolInput, toolUseContext, permissionMode, permissionSuggestions, signal, timeoutMs = DEFAULT_TIMEOUT) {
  logDebug(`executePermissionRequestHooks called for tool: ${toolName}`);
  let hookInput = {
    ...createHookEnvironmentContext(permissionMode),
    hook_event_name: "PermissionRequest",
    tool_name: toolName,
    tool_input: toolInput,
    permission_suggestions: permissionSuggestions
  };
  yield* executeHooksInREPL({ hookInput, toolUseID: toolUseId, matchQuery: toolName, signal, timeoutMs, toolUseContext });
}

// Mapping: eU0→executePermissionRequestHooks
```

---

## Special Hooks

### StatusLine Hook (Aq0)

```javascript
// ============================================
// executeStatusLineHook - Custom status line display
// Location: chunks.120.mjs:2249-2272
// ============================================

// ORIGINAL:
async function Aq0(A, Q, B = 5000) {
  let G = jQ(),
    Z = G?.statusLine;
  if (G?.disableAllHooks === !0) return;
  if (!Z || Z.type !== "command") return;
  let Y = Q || AbortSignal.timeout(B);
  try {
    let J = eA(A),
      X = await CK1(Z, "StatusLine", "statusLine", J, Y);
    if (X.aborted) return;
    if (X.status === 0) {
      let I = X.stdout.trim().split("\n").flatMap((D) => D.trim() || []).join("\n");
      if (I) return I
    }
    return
  } catch (J) {
    k(`Status hook failed: ${J}`, { level: "error" });
  }
}

// READABLE:
async function executeStatusLineHook(statusContext, signal, timeoutMs = 5000) {
  let settings = getSettings();
  let statusLine = settings?.statusLine;

  // Check if hooks are disabled
  if (settings?.disableAllHooks === true) return;
  // Require command type configuration
  if (!statusLine || statusLine.type !== "command") return;

  let abortSignal = signal || AbortSignal.timeout(timeoutMs);

  try {
    let inputJson = JSON.stringify(statusContext);
    let result = await executeCommandHook(statusLine, "StatusLine", "statusLine", inputJson, abortSignal);

    if (result.aborted) return;
    if (result.status === 0) {
      // Parse multi-line output, filtering empty lines
      let output = result.stdout.trim()
        .split("\n")
        .flatMap(line => line.trim() || [])
        .join("\n");
      if (output) return output;
    }
    return;
  } catch (error) {
    logDebug(`Status hook failed: ${error}`, { level: "error" });
  }
}

// Mapping: Aq0→executeStatusLineHook, jQ→getSettings, CK1→executeCommandHook
```

**Configuration:**
```json
{
  "statusLine": {
    "type": "command",
    "command": "my-status-script",
    "padding": 2
  }
}
```

### FileSuggestion Hook (Qq0)

```javascript
// ============================================
// executeFileSuggestionHook - Custom file suggestions for @ mentions
// Location: chunks.120.mjs:2274-2295
// ============================================

// ORIGINAL:
async function Qq0(A, Q, B = 5000) {
  let G = jQ();
  if (G?.disableAllHooks === !0) return [];
  let Z = G?.fileSuggestion;
  if (!Z || Z.type !== "command") return [];
  let Y = Q || AbortSignal.timeout(B);
  try {
    let J = eA(A),
      X = { type: "command", command: Z.command },
      I = await CK1(X, "FileSuggestion", "FileSuggestion", J, Y);
    if (I.aborted || I.status !== 0) return [];
    return I.stdout.split("\n").map((D) => D.trim()).filter(Boolean)
  } catch (J) {
    return k(`File suggestion helper failed: ${J}`, { level: "error" }), []
  }
}

// READABLE:
async function executeFileSuggestionHook(suggestionContext, signal, timeoutMs = 5000) {
  let settings = getSettings();

  // Check if hooks are disabled
  if (settings?.disableAllHooks === true) return [];

  let fileSuggestion = settings?.fileSuggestion;
  if (!fileSuggestion || fileSuggestion.type !== "command") return [];

  let abortSignal = signal || AbortSignal.timeout(timeoutMs);

  try {
    let inputJson = JSON.stringify(suggestionContext);
    let hookConfig = { type: "command", command: fileSuggestion.command };
    let result = await executeCommandHook(hookConfig, "FileSuggestion", "FileSuggestion", inputJson, abortSignal);

    if (result.aborted || result.status !== 0) return [];

    // Parse stdout as newline-separated file paths
    return result.stdout
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

  } catch (error) {
    logDebug(`File suggestion helper failed: ${error}`, { level: "error" });
    return [];
  }
}

// Mapping: Qq0→executeFileSuggestionHook
```

**Configuration:**
```json
{
  "fileSuggestion": {
    "type": "command",
    "command": "my-file-suggester"
  }
}
```

---

## Settings Configuration

### Hook-Related Settings

```javascript
// ============================================
// Settings schema for hooks
// Location: chunks.90.mjs:1944-1951
// ============================================

// Settings fields:
{
  // Hooks configuration by event type
  hooks: eventHooksSchema.optional(),

  // Disable all hooks including statusLine
  disableAllHooks: zod.boolean().optional(),

  // When true, only managed (policy) hooks run
  allowManagedHooksOnly: zod.boolean().optional(),

  // Custom status line display
  statusLine: zod.object({
    type: zod.literal("command"),
    command: zod.string(),
    padding: zod.number().optional()
  }).optional(),

  // Custom file suggestion for @ mentions
  fileSuggestion: zod.object({
    type: zod.literal("command"),
    command: zod.string()
  }).optional()
}
```

### Settings Hierarchy

| Setting | Effect |
|---------|--------|
| `disableAllHooks: true` | Disables ALL hooks including statusLine and fileSuggestion |
| `allowManagedHooksOnly: true` | Only policy hooks run; plugin/session hooks skipped |
| `hooks.PreToolUse` | Event-specific hooks configuration |
| `statusLine` | Custom status display command |
| `fileSuggestion` | Custom file picker suggestions |

---

## Complete Hook Output Schema

```javascript
// ============================================
// hookSpecificOutput - Event-specific output fields
// Location: chunks.92.mjs:116-148
// ============================================

hookSpecificOutput = zod.union([
  // PreToolUse specific
  {
    hookEventName: "PreToolUse",
    permissionDecision: zod.enum(["allow", "deny", "ask"]).optional(),
    permissionDecisionReason: zod.string().optional(),
    updatedInput: zod.record(zod.string(), zod.unknown()).optional()
  },

  // UserPromptSubmit specific
  {
    hookEventName: "UserPromptSubmit",
    additionalContext: zod.string().optional()
  },

  // SessionStart specific
  {
    hookEventName: "SessionStart",
    additionalContext: zod.string().optional()
  },

  // SubagentStart specific
  {
    hookEventName: "SubagentStart",
    additionalContext: zod.string().optional()
  },

  // PostToolUse specific
  {
    hookEventName: "PostToolUse",
    additionalContext: zod.string().optional(),
    updatedMCPToolOutput: zod.unknown().optional()  // Modify MCP tool output
  },

  // PostToolUseFailure specific
  {
    hookEventName: "PostToolUseFailure",
    additionalContext: zod.string().optional()
  },

  // PermissionRequest specific
  {
    hookEventName: "PermissionRequest",
    decision: zod.union([
      {
        behavior: "allow",
        updatedInput: zod.record(zod.string(), zod.unknown()).optional(),
        updatedPermissions: zod.array(permissionSchema).optional()
      },
      {
        behavior: "deny",
        message: zod.string().optional(),
        interrupt: zod.boolean().optional()
      }
    ])
  }
])
```

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key functions in this document:
- `executeHooksInREPL` (At) - REPL hook execution generator
- `executeHooksOutsideREPL` (pU0) - Non-REPL hook execution
- `executeCommandHook` (CK1) - Shell command execution
- `executeAgentHook` (Nu2) - Agent verifier execution
- `executePromptHook` (w82) - LLM prompt evaluation
- `parseHookOutput` (Mu2) - JSON output validation
- `createHookEnvironmentContext` (jE) - Base context
- `hookOutputSchema` (AY1) - Output validation schema
- `registerAsyncHook` (H82) - Async hook tracking
- `commandHookSchema` (S75) - Command hook type
- `promptHookSchema` (x75) - Prompt hook type
- `agentHookSchema` (y75) - Agent hook type
- `hookTypeUnion` (v75) - Hook type discriminated union
- `hookMatcherSchema` (k75) - Matcher with hooks array
- `eventHooksSchema` (jb) - Full event hooks config
- `executePreToolHooks` (lU0) - PreToolUse trigger
- `executePostToolHooks` (iU0) - PostToolUse trigger
- `executePostToolFailureHooks` (nU0) - PostToolUseFailure trigger
- `executeNotificationHooks` (vE0) - Notification trigger
- `executeStopHooks` (aU0) - Stop/SubagentStop trigger
- `executeUserPromptSubmitHooks` (oU0) - UserPromptSubmit trigger
- `executeSessionStartHooks` (rU0) - SessionStart trigger
- `executeSubagentStartHooks` (kz0) - SubagentStart trigger
- `executePreCompactHooks` (sU0) - PreCompact trigger
- `executeSessionEndHooks` (tU0) - SessionEnd trigger
- `executePermissionRequestHooks` (eU0) - PermissionRequest trigger
- `executeStatusLineHook` (Aq0) - Status line display
- `executeFileSuggestionHook` (Qq0) - File suggestions
- `promptHookResponseSchema` (WyA) - Prompt hook response schema

---

## See Also

- [hooks_implementation.md](hooks_implementation.md) - Scope and lifecycle
- [../00_overview/symbol_index_core.md](../00_overview/symbol_index_core.md) - Symbol index
