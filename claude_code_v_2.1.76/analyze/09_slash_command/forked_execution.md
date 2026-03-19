# Forked Command Execution

## Overview

Forked commands execute prompt-type skills in an isolated sub-agent context. Unlike inline prompt commands that merge into the main conversation, forked commands spawn a dedicated agent with its own state, displaying real-time progress while preventing tool call side-effects from affecting the main session.

**Primary use case:** Commands like `/review` that make extensive API calls or need isolated execution without cluttering the main conversation.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)

Key functions in this document:
- `handleForkedCommand` (MvY) - Main entry point for forked execution (chunks.133.mjs:1025)
- `buildForkedCommandConfig` (DN1) - Prepares isolated execution context (chunks.148.mjs:1951)
- `extractResultFromEvents` (XN1) - Extracts result text from event stream (chunks.148.mjs:1971)
- `renderForkedProgress` (ff6) - Renders progress UI component (chunks.133.mjs:490)
- `generateAgentId` (bI) - Creates unique agent identifier (chunks.93.mjs:1557)

---

## handleForkedCommand (MvY) — Complete Analysis

**What it does:** Executes a prompt-type command in an isolated sub-agent context with real-time progress display.

**Location:** chunks.133.mjs:1025-1114

**How it works:**

1. **Generate agent ID**: Creates unique identifier for the forked agent
2. **Build isolated context**: Prepares modified state, agent definition, and prompt
3. **Progress tracking**: Sets up emitter and UI callback for streaming updates
4. **Agent loop iteration**: Streams events from sub-agent execution
5. **Result extraction**: Pulls final text from accumulated events

```javascript
// ============================================
// handleForkedCommand - Isolated sub-agent execution for prompt commands
// Location: chunks.133.mjs:1025-1114
// ============================================

// ORIGINAL (for source lookup):
async function MvY(A, q, K, Y, z, _) {
    let w = bI();
    d("tengu_slash_command_forked", {
        command_name: A.name
    });
    let {
        skillContent: O,
        modifiedGetAppState: $,
        baseAgent: H,
        promptMessages: j
    } = await DN1(A, q, K);
    k(`Executing forked slash command /${A.name} with agent ${H.agentType}`);
    let J = [],
        M = [],
        D = `forked-command-${A.name}`,
        X = 0,
        P = (f) => {
            return X++, {
                type: "progress",
                data: {
                    message: f,
                    type: "agent_progress",
                    prompt: O,
                    agentId: w
                },
                parentToolUseID: D,
                toolUseID: `${D}-${X}`,
                timestamp: new Date().toISOString(),
                uuid: ac4()
            }
        },
        W = () => {
            z({
                jsx: ff6(M, {
                    tools: K.options.tools,
                    verbose: !1
                }),
                shouldHidePromptInput: !1,
                shouldContinueAnimation: !0,
                showSpinner: !0
            })
        };
    W();
    try {
        for await (let f of qh({
            agentDefinition: H,
            promptMessages: j,
            toolUseContext: {
                ...K,
                getAppState: $
            },
            canUseTool: _,
            isAsync: !1,
            querySource: "agent:custom",
            model: A.model,
            availableTools: K.options.tools
        })) {
            J.push(f);
            let v = JM([f]);
            if (f.type === "assistant") {
                let N = QD1(f);
                if (N > 0) K.setResponseLength((L) => L + N);
                let V = v[0];
                if (V && V.type === "assistant") M.push(P(f)), W()
            }
            if (f.type === "user") {
                let N = v[0];
                if (N && N.type === "user") M.push(P(N)), W()
            }
        }
    } finally {
        z(null)
    }
    let Z = XN1(J, "Command completed");
    return k(`Forked slash command /${A.name} completed with agent ${w}`), {
        messages: [p1({
            content: HE({
                inputString: `/${A.userFacingName()} ${q}`.trim(),
                precedingInputBlocks: Y
            })
        }), p1({
            content: `<local-command-stdout>
${Z}
</local-command-stdout>`
        })],
        shouldQuery: !1,
        command: A,
        resultText: Z
    }
}

// READABLE (for understanding):
async function handleForkedCommand(command, args, toolUseContext, precedingBlocks, setJSXOutput, canUseTool) {
    // Step 1: Generate unique agent ID
    let agentId = generateAgentId();

    // Step 2: Emit telemetry
    trackEvent("tengu_slash_command_forked", { command_name: command.name });

    // Step 3: Build isolated execution context
    let { skillContent, modifiedGetAppState, baseAgent, promptMessages } =
        await buildForkedCommandConfig(command, args, toolUseContext);

    log(`Executing forked slash command /${command.name} with agent ${baseAgent.agentType}`);

    // Step 4: Set up progress tracking
    let allEvents = [];
    let progressMessages = [];
    let progressId = `forked-command-${command.name}`;
    let progressIndex = 0;

    // Progress emitter creates displayable progress items
    let emitProgress = (message) => {
        progressIndex++;
        return {
            type: "progress",
            data: {
                message,
                type: "agent_progress",
                prompt: skillContent,
                agentId
            },
            parentToolUseID: progressId,
            toolUseID: `${progressId}-${progressIndex}`,
            timestamp: new Date().toISOString(),
            uuid: generateUUID()
        };
    };

    // Step 5: UI update callback
    let updateDisplay = () => {
        setJSXOutput({
            jsx: renderForkedProgress(progressMessages, {
                tools: toolUseContext.options.tools,
                verbose: false
            }),
            shouldHidePromptInput: false,
            shouldContinueAnimation: true,
            showSpinner: true
        });
    };

    updateDisplay();  // Show initial empty state

    try {
        // Step 6: Stream events from sub-agent execution
        for await (let event of runAgentLoop({
            agentDefinition: baseAgent,
            promptMessages,
            toolUseContext: { ...toolUseContext, getAppState: modifiedGetAppState },
            canUseTool,
            isAsync: false,
            querySource: "agent:custom",
            model: command.model,
            availableTools: toolUseContext.options.tools
        })) {
            allEvents.push(event);

            let normalizedMessages = normalizeMessages([event]);

            // Update progress for assistant messages
            if (event.type === "assistant") {
                let tokenCount = countTokens(event);
                if (tokenCount > 0) {
                    toolUseContext.setResponseLength((len) => len + tokenCount);
                }
                let normalized = normalizedMessages[0];
                if (normalized && normalized.type === "assistant") {
                    progressMessages.push(emitProgress(event));
                    updateDisplay();
                }
            }

            // Update progress for user messages
            if (event.type === "user") {
                let normalized = normalizedMessages[0];
                if (normalized && normalized.type === "user") {
                    progressMessages.push(emitProgress(normalized));
                    updateDisplay();
                }
            }
        }
    } finally {
        setJSXOutput(null);  // Clear progress display
    }

    // Step 7: Extract final result
    let resultText = extractResultFromEvents(allEvents, "Command completed");

    log(`Forked slash command /${command.name} completed with agent ${agentId}`);

    return {
        messages: [
            createUserMessage({
                content: formatInputDisplay({
                    inputString: `/${command.userFacingName()} ${args}`.trim(),
                    precedingInputBlocks
                })
            }),
            createUserMessage({
                content: `<local-command-stdout>
${resultText}
</local-command-stdout>`
            })
        ],
        shouldQuery: false,
        command,
        resultText
    };
}

// Mapping: MvY→handleForkedCommand, A→command, q→args, K→toolUseContext, Y→precedingBlocks,
//          z→setJSXOutput, _→canUseTool, w→agentId, DN1→buildForkedCommandConfig,
//          qh→runAgentLoop, XN1→extractResultFromEvents, ff6→renderForkedProgress,
//          bI→generateAgentId, ac4→generateUUID, JM→normalizeMessages, QD1→countTokens
```

**Why this approach:**

- **State isolation**: The `modifiedGetAppState` wrapper ensures tool executions don't pollute main conversation state
- **Progress visibility**: Users see real-time progress updates instead of a frozen UI
- **Error containment**: Failures in the forked agent don't crash the main REPL
- **Context separation**: The forked agent has its own message history and tool permissions

**Key insight:** Forked commands are essentially mini-agent sessions within the main session. The `finally` block ensures the progress UI is always cleared, even on errors.

---

## buildForkedCommandConfig (DN1) — Context Preparation

**What it does:** Prepares the isolated execution context for forked command execution.

**Location:** chunks.148.mjs:1951-1968

```javascript
// ============================================
// buildForkedCommandConfig - Prepare isolated execution context
// Location: chunks.148.mjs:1951-1968
// ============================================

// ORIGINAL (for source lookup):
async function DN1(A, q, K) {
    let z = (await A.getPromptForCommand(q, K)).map((J) => J.type === "text" ? J.text : "").join(`
`),
        _ = Kh(A.allowedTools ?? []),
        w = ABY(K.getAppState, _),
        O = A.agent ?? "general-purpose",
        $ = K.options.agentDefinitions.activeAgents,
        H = $.find((J) => J.agentType === O) ?? $.find((J) => J.agentType === "general-purpose") ?? $[0];
    if (!H) throw Error("No agent available for forked execution");
    let j = [p1({
        content: z
    })];
    return {
        skillContent: z,
        modifiedGetAppState: w,
        baseAgent: H,
        promptMessages: j
    }
}

// READABLE (for understanding):
async function buildForkedCommandConfig(command, args, toolUseContext) {
    // Step 1: Get skill content
    let promptResult = await command.getPromptForCommand(args, toolUseContext);
    let skillContent = promptResult
        .map((item) => item.type === "text" ? item.text : "")
        .join("\n");

    // Step 2: Filter allowed tools
    let allowedTools = filterAllowedTools(command.allowedTools ?? []);

    // Step 3: Create state isolation wrapper
    let modifiedGetAppState = createIsolatedAppState(toolUseContext.getAppState, allowedTools);

    // Step 4: Select agent definition
    let agentType = command.agent ?? "general-purpose";
    let activeAgents = toolUseContext.options.agentDefinitions.activeAgents;

    // Priority: specified agent > general-purpose > first available
    let baseAgent = activeAgents.find((a) => a.agentType === agentType) ??
                    activeAgents.find((a) => a.agentType === "general-purpose") ??
                    activeAgents[0];

    if (!baseAgent) {
        throw new Error("No agent available for forked execution");
    }

    // Step 5: Build prompt messages
    let promptMessages = [createUserMessage({ content: skillContent })];

    return {
        skillContent,
        modifiedGetAppState,
        baseAgent,
        promptMessages
    };
}

// Mapping: DN1→buildForkedCommandConfig, A→command, q→args, K→toolUseContext,
//          z→skillContent, _→allowedTools, w→modifiedGetAppState, H→baseAgent,
//          Kh→filterAllowedTools, ABY→createIsolatedAppState, p1→createUserMessage
```

**Agent Selection Priority:**

| Priority | Condition | Use Case |
|----------|-----------|----------|
| 1 | `command.agent` specified | Custom agent for specific skill |
| 2 | "general-purpose" exists | Standard forked execution |
| 3 | First available agent | Fallback |

**Why skill content extraction:**
- Joins all text-type prompt items into single string
- Filters out non-text items (images, attachments)
- Used for progress display and invoked_skills tracking

---

## extractResultFromEvents (XN1) — Result Extraction

**What it does:** Extracts the final result text from accumulated agent events.

**Location:** chunks.148.mjs:1971-1976

```javascript
// ============================================
// extractResultFromEvents - Extract result text from event stream
// Location: chunks.148.mjs:1971-1976
// ============================================

// ORIGINAL (for source lookup):
function XN1(A, q = "Execution completed") {
    let K = bX(A);
    if (!K) return q;
    return K.message.content.filter((z) => z.type === "text").map((z) => ("text" in z) ? z.text : "").join(`
`) || q
}

// READABLE (for understanding):
function extractResultFromEvents(events, fallbackMessage = "Execution completed") {
    // Find the last message in the event stream
    let lastMessage = getLastMessage(events);
    if (!lastMessage) return fallbackMessage;

    // Extract text content from the message
    return lastMessage.message.content
        .filter((item) => item.type === "text")
        .map((item) => ("text" in item) ? item.text : "")
        .join("\n") || fallbackMessage;
}

// Mapping: XN1→extractResultFromEvents, A→events, q→fallbackMessage, bX→getLastMessage
```

**Why this approach:**
- **Last message**: The final assistant message contains the summary/result
- **Text filtering**: Removes non-text content (tool uses, images)
- **Fallback**: Provides meaningful message when no result found

---

## State Isolation Architecture

### What State Is Isolated vs Shared

| State | Isolated | Shared | Reason |
|-------|----------|--------|--------|
| `getAppState` | ✅ | | Modified with filtered tools |
| `toolPermissionContext` | ✅ | | Separate permission decisions |
| `messages` | ✅ | | Fresh conversation for forked agent |
| `abortController` | ✅ | | Independent cancellation |
| `agentId` | ✅ | | Unique identifier for forked agent |
| `options.tools` | | ✅ | Tool definitions are read-only |
| `setResponseLength` | | ✅ | Update main session metrics |
| `options.mainLoopModel` | | ✅ | Model selection from main session |

### State Isolation Wrapper (ABY)

**What it does:** Creates a wrapped `getAppState` function that injects the skill's allowed tools into the permission context while preserving other state.

**Location:** chunks.148.mjs:1934-1948

```javascript
// ============================================
// createIsolatedAppState - State wrapper for forked command isolation
// Location: chunks.148.mjs:1934-1948
// ============================================

// ORIGINAL (for source lookup):
function ABY(A, q) {
    if (q.length === 0) return A;
    return () => {
        let K = A();
        return {
            ...K,
            toolPermissionContext: {
                ...K.toolPermissionContext,
                alwaysAllowRules: {
                    ...K.toolPermissionContext.alwaysAllowRules,
                    command: [...new Set([...K.toolPermissionContext.alwaysAllowRules.command || [], ...q])]
                }
            }
        }
    }
}

// READABLE (for understanding):
function createIsolatedAppState(originalGetAppState, allowedTools) {
    // If no allowed tools specified, use original getter unchanged
    if (allowedTools.length === 0) return originalGetAppState;

    // Return wrapped getter that injects allowed tools
    return () => {
        let originalState = originalGetAppState();

        return {
            ...originalState,
            toolPermissionContext: {
                ...originalState.toolPermissionContext,
                alwaysAllowRules: {
                    ...originalState.toolPermissionContext.alwaysAllowRules,
                    // Merge skill's allowed tools into existing command permissions
                    command: [...new Set([
                        ...(originalState.toolPermissionContext.alwaysAllowRules.command || []),
                        ...allowedTools
                    ])]
                }
            }
        };
    };
}

// Mapping: ABY→createIsolatedAppState, A→originalGetAppState, q→allowedTools, K→originalState
```

**Why this approach:**
- **Non-destructive wrapping**: Original getter is preserved if no tools specified
- **Set deduplication**: `new Set([...])` prevents duplicate tool entries
- **Permission injection**: Allowed tools are automatically approved for the forked context
- **State immutability**: Creates new state object rather than mutating existing

**Why suppress permission prompts:**
- Forked commands run in background-like context
- User already approved the command invocation
- Prevents interactive prompts from blocking execution

---

## Progress Streaming Mechanism

### Progress Event Structure

```javascript
{
    type: "progress",
    data: {
        message: <assistant|user event>,
        type: "agent_progress",
        prompt: <skillContent>,
        agentId: <unique agent ID>
    },
    parentToolUseID: "forked-command-<commandName>",
    toolUseID: "forked-command-<commandName>-<index>",
    timestamp: "<ISO timestamp>",
    uuid: "<unique ID>"
}
```

### UI Update Flow

```
Agent emits event
        │
        ▼
event.type === "assistant"?
        │
        ├─── Yes ──→ emitProgress(event) → progressMessages.push()
        │                                    │
        │                                    ▼
        │                              updateDisplay()
        │                                    │
        │                                    ▼
        │                              setJSXOutput({ jsx: renderForkedProgress(...) })
        │
        └─── No ──→ event.type === "user"?
                           │
                           ├─── Yes ──→ Same flow as assistant
                           │
                           └─── No ──→ Tool event, no progress update
```

### renderForkedProgress (ff6)

**What it does:** Renders the progress list as a React component.

**Location:** chunks.133.mjs:490

**Key features:**
- Scrollable list of progress messages
- Shows last N messages (truncates older ones)
- Displays tool names and statuses
- Shows spinner while execution in progress

---

## Error Handling

### Error Containment

```javascript
try {
    for await (let event of runAgentLoop(...)) {
        // Process events
    }
} catch (error) {
    // Error is logged but doesn't crash main REPL
    // Progress UI is cleared in finally block
} finally {
    setJSXOutput(null);  // Always clear progress
}
```

### Error Result Handling

When an error occurs:
1. Progress UI is cleared (finally block)
2. Error message becomes resultText
3. Error is logged with command name
4. User sees error in `<local-command-stdout>` block

---

## Use Cases

### When to Use Forked Execution

| Command Type | Fork? | Reason |
|--------------|-------|--------|
| `/review` | ✅ Yes | Makes many API calls, isolated context |
| `/security-review` | ✅ Yes | Complex analysis, separate from main conversation |
| `/init` | ❌ No | Should merge into main conversation |
| `/pr-comments` | ✅ Yes | Fetches and analyzes PR data |

### Configuration

Commands opt into forked execution via `context` field:

```javascript
const reviewCommand = {
    type: "prompt",
    name: "review",
    context: "fork",  // Enables forked execution
    getPromptForCommand: async (args, context) => [...]
};
```

**Without `context: "fork"`**, prompt commands use inline execution via `handlePromptCommand`.