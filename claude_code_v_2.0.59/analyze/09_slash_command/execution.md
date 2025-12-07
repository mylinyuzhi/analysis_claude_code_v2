# Command Execution Flow

## Overview

After parsing validates a slash command, the execution system routes it to the appropriate handler based on command type. This document details the execution flow, message creation, display options, and the serial command queue.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

**Key execution functions:**
- `executeCommand` (nf5) - Main dispatcher for command execution
- `processPromptSlashCommand` (kP2) - Handle prompt-type commands
- `createUserMessage` (R0) - Create user message objects
- `createLocalCommandSystemMessage` (z60) - Create system messages for local commands
- `formatCommandMetadata` (a61) - Format command metadata for display

---

## Execution Architecture

```
Command (parsed)
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  executeCommand (nf5)                                            │
│                                                                  │
│  switch (command.type) {                                         │
│    case "local-jsx":  → Promise-based, render JSX component      │
│    case "local":      → Sync execution, text output              │
│    case "prompt":     → LLM invocation with custom prompt        │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
       │
       ├─── "local-jsx" ───┐
       │                   ▼
       │    ┌─────────────────────────────────┐
       │    │ setCommandJSX()                 │
       │    │ Render React component          │
       │    │ (Interactive UI: config, help)  │
       │    └─────────────────────────────────┘
       │
       ├─── "local" ───────┐
       │                   ▼
       │    ┌─────────────────────────────────┐
       │    │ command.call(args, context)     │
       │    │ Return text output              │
       │    │ (cost, clear, compact)          │
       │    └─────────────────────────────────┘
       │
       └─── "prompt" ──────┐
                           ▼
           ┌─────────────────────────────────┐
           │ processPromptSlashCommand()     │
           │ Build prompt, send to LLM       │
           │ (Custom commands, plugins)      │
           └─────────────────────────────────┘
```

---

## Main Dispatcher: executeCommand (nf5)

The central function that routes commands to their appropriate handlers:

```javascript
// ============================================
// executeCommand - Main command execution dispatcher
// Location: chunks.121.mjs:1018-1147
// ============================================

// ORIGINAL (for source lookup):
async function nf5(A, Q, B, G, Z, I, Y) {
  let J = Pq(A, G.options.commands);
  try {
    switch (J.type) {
      case "local-jsx":
        return new Promise((W) => {
          J.call((X, V) => {
            if (B(null), V?.display === "skip") {
              W({
                messages: [],
                shouldQuery: !1,
                skipHistory: !0,
                command: J
              });
              return
            }
            W({
              messages: V?.display === "system" ? [z60(a61(J, Q)), z60(`<local-command-stdout>${X}</local-command-stdout>`)] : [R0({
                content: Y$({
                  inputString: a61(J, Q),
                  precedingInputBlocks: Z
                })
              }), X ? R0({
                content: `<local-command-stdout>${X}</local-command-stdout>`
              }) : R0({
                content: `<local-command-stdout>${$q}</local-command-stdout>`
              })],
              shouldQuery: !1,
              command: J
            })
          }, G, Q).then((X) => {
            if (G.options.isNonInteractiveSession) {
              W({
                messages: [],
                shouldQuery: !1,
                skipHistory: !0,
                command: J
              });
              return
            }
            B({
              jsx: X,
              shouldHidePromptInput: !0,
              showSpinner: !1,
              isLocalJSXCommand: !1
            })
          })
        });
      case "local": {
        let W = R0({
          content: Y$({
            inputString: a61(J, Q),
            precedingInputBlocks: Z
          })
        });
        try {
          let X = cV(),
            V = await J.call(Q, G);
          if (V.type === "skip") return {
            messages: [],
            shouldQuery: !1,
            skipHistory: !0,
            command: J
          };
          // ... (compact and normal result handling)
        } catch (X) {
          return AA(X), {
            messages: [W, R0({
              content: `<local-command-stderr>${String(X)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: J
          }
        }
      }
      case "prompt":
        try {
          return await kP2(J, Q, G, Z, I)
        } catch (W) {
          return {
            messages: [R0({
              content: Y$({
                inputString: a61(J, Q),
                precedingInputBlocks: Z
              })
            }), R0({
              content: `<local-command-stderr>${String(W)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: J
          }
        }
    }
  } catch (W) {
    if (W instanceof oj) return {
      messages: [R0({
        content: Y$({
          inputString: W.message,
          precedingInputBlocks: Z
        })
      })],
      shouldQuery: !1,
      command: J
    };
    throw W
  }
}

// READABLE (for understanding):
async function executeCommand(
  commandName,            // Name of command to execute
  args,                   // Command arguments
  setCommandJSX,          // Callback to set JSX component for rendering
  toolUseContext,         // Tool execution context
  precedingInputBlocks,   // Previous input blocks
  attachments,            // File attachments
  skipCompact             // Skip compaction flag
) {
  // Lookup command definition
  let command = lookupCommand(commandName, toolUseContext.options.commands);

  try {
    switch (command.type) {

      // ─────────────────────────────────────────────────────
      // LOCAL-JSX: Interactive React/Ink components
      // ─────────────────────────────────────────────────────
      case "local-jsx":
        return new Promise((resolve) => {
          // Call the command with completion callback
          command.call(
            // onComplete callback - called when JSX interaction finishes
            (output, displayOptions) => {
              // Clear JSX component
              setCommandJSX(null);

              // Handle display: "skip" - no transcript entry
              if (displayOptions?.display === "skip") {
                resolve({
                  messages: [],
                  shouldQuery: false,
                  skipHistory: true,
                  command: command
                });
                return;
              }

              // Handle display: "system" - system message format
              // Default: user message format
              resolve({
                messages: displayOptions?.display === "system"
                  ? [
                      createLocalCommandSystemMessage(formatCommandMetadata(command, args)),
                      createLocalCommandSystemMessage(`<local-command-stdout>${output}</local-command-stdout>`)
                    ]
                  : [
                      createUserMessage({
                        content: buildMessageContent({
                          inputString: formatCommandMetadata(command, args),
                          precedingInputBlocks: precedingInputBlocks
                        })
                      }),
                      output
                        ? createUserMessage({ content: `<local-command-stdout>${output}</local-command-stdout>` })
                        : createUserMessage({ content: `<local-command-stdout>${EMPTY_PLACEHOLDER}</local-command-stdout>` })
                    ],
                shouldQuery: false,
                command: command
              });
            },
            toolUseContext,
            args
          ).then((jsxElement) => {
            // Non-interactive mode: skip JSX rendering
            if (toolUseContext.options.isNonInteractiveSession) {
              resolve({
                messages: [],
                shouldQuery: false,
                skipHistory: true,
                command: command
              });
              return;
            }

            // Render the JSX component
            setCommandJSX({
              jsx: jsxElement,
              shouldHidePromptInput: true,
              showSpinner: false,
              isLocalJSXCommand: false
            });
          });
        });

      // ─────────────────────────────────────────────────────
      // LOCAL: Synchronous text output commands
      // ─────────────────────────────────────────────────────
      case "local": {
        // Create user message for transcript
        let userMessage = createUserMessage({
          content: buildMessageContent({
            inputString: formatCommandMetadata(command, args),
            precedingInputBlocks: precedingInputBlocks
          })
        });

        try {
          let systemMessage = createSystemMessage();
          let result = await command.call(args, toolUseContext);

          // Handle "skip" result type
          if (result.type === "skip") {
            return {
              messages: [],
              shouldQuery: false,
              skipHistory: true,
              command: command
            };
          }

          // Handle "compact" result type (from /compact command)
          if (result.type === "compact") {
            const {
              boundaryMarker,
              summaryMessages,
              attachments: compactAttachments,
              hookResults
            } = result.compactionResult;

            return {
              messages: [
                boundaryMarker,
                ...summaryMessages,
                systemMessage,
                userMessage,
                ...(result.displayText
                  ? [createUserMessage({
                      content: `<local-command-stdout>${result.displayText}</local-command-stdout>`,
                      timestamp: new Date(Date.now() + 100).toISOString()
                    })]
                  : []),
                ...compactAttachments,
                ...hookResults
              ],
              shouldQuery: false,
              command: command
            };
          }

          // Handle normal text result
          return {
            messages: [
              userMessage,
              createUserMessage({
                content: `<local-command-stdout>${result.value}</local-command-stdout>`
              })
            ],
            shouldQuery: false,
            command: command
          };
        } catch (error) {
          // Log error and return error message
          logError(error);
          return {
            messages: [
              userMessage,
              createUserMessage({
                content: `<local-command-stderr>${String(error)}</local-command-stderr>`
              })
            ],
            shouldQuery: false,
            command: command
          };
        }
      }

      // ─────────────────────────────────────────────────────
      // PROMPT: LLM invocation with custom prompts
      // ─────────────────────────────────────────────────────
      case "prompt":
        try {
          return await processPromptSlashCommand(
            command,
            args,
            toolUseContext,
            precedingInputBlocks,
            attachments
          );
        } catch (error) {
          return {
            messages: [
              createUserMessage({
                content: buildMessageContent({
                  inputString: formatCommandMetadata(command, args),
                  precedingInputBlocks: precedingInputBlocks
                })
              }),
              createUserMessage({
                content: `<local-command-stderr>${String(error)}</local-command-stderr>`
              })
            ],
            shouldQuery: false,
            command: command
          };
        }
    }
  } catch (error) {
    // Handle CommandNotFoundError specially
    if (error instanceof CommandNotFoundError) {
      return {
        messages: [
          createUserMessage({
            content: buildMessageContent({
              inputString: error.message,
              precedingInputBlocks: precedingInputBlocks
            })
          })
        ],
        shouldQuery: false,
        command: command
      };
    }
    throw error;
  }
}

// Mapping: nf5→executeCommand, A→commandName, Q→args, B→setCommandJSX,
//          G→toolUseContext, Z→precedingInputBlocks, I→attachments, Y→skipCompact,
//          J→command, Pq→lookupCommand, kP2→processPromptSlashCommand,
//          R0→createUserMessage, z60→createLocalCommandSystemMessage,
//          a61→formatCommandMetadata, Y$→buildMessageContent, oj→CommandNotFoundError
```

---

## Command Types Deep Dive

### 1. Local-JSX Commands

Interactive UI components using React/Ink for terminal rendering.

**Characteristics:**
- Async Promise-based execution
- Render JSX components in terminal
- Support display options: `skip`, `system`, default
- Skip rendering in non-interactive mode

**Examples:** `/help`, `/config`, `/context`, `/ide`, `/memory`, `/doctor`

**Execution Flow:**

```
command.call(onComplete, context, args)
       │
       ├─── Return Promise<JSX.Element>
       │           │
       │           ▼
       │    setCommandJSX({ jsx, ... })
       │           │
       │           ▼
       │    [User interacts with UI]
       │           │
       │           ▼
       └─── onComplete(output, displayOptions)
                   │
                   ▼
            Resolve with messages
```

**Display Options Handling:**

```javascript
// Display option determines message format:
if (displayOptions?.display === "skip") {
  // No messages, no history
  return { messages: [], skipHistory: true };
}

if (displayOptions?.display === "system") {
  // System message format (not sent to LLM)
  return {
    messages: [
      createLocalCommandSystemMessage(metadata),
      createLocalCommandSystemMessage(output)
    ]
  };
}

// Default: User message format (visible in conversation)
return {
  messages: [
    createUserMessage({ content: metadata }),
    createUserMessage({ content: output })
  ]
};
```

### 2. Local Commands

Synchronous commands that return text output directly.

**Characteristics:**
- Await command.call() directly
- Return text, skip, or compact results
- Support error handling with stderr tags
- Hide cursor during execution

**Examples:** `/cost`, `/clear`, `/compact`, `/vim`

**Result Types:**

| Type | Description | Messages |
|------|-------------|----------|
| `skip` | No output, no history | Empty array |
| `compact` | Compaction result | Boundary + summary + attachments |
| `value` | Text output | User message with stdout tag |

**Execution Flow:**

```javascript
// Local command execution:
let result = await command.call(args, context);

switch (result.type) {
  case "skip":
    // Command completed silently (e.g., clear)
    return { messages: [], skipHistory: true };

  case "compact":
    // Compaction result with summary
    return {
      messages: [
        result.boundaryMarker,
        ...result.summaryMessages,
        ...result.attachments
      ]
    };

  default:
    // Normal text output
    return {
      messages: [
        userMessage,
        createUserMessage({
          content: `<local-command-stdout>${result.value}</local-command-stdout>`
        })
      ]
    };
}
```

### 3. Prompt Commands

Commands that invoke the LLM with custom prompts.

**Characteristics:**
- Set `shouldQuery: true` to invoke LLM
- Support allowed tools restriction
- Support model override
- Support extended thinking tokens

**Examples:** Custom commands, plugin commands, `/init`, `/pr-comments`

---

## Prompt Command Processing (kP2)

The function that handles prompt-type commands:

```javascript
// ============================================
// processPromptSlashCommand - Handle prompt-type commands
// Location: chunks.121.mjs:1177-1214
// ============================================

// ORIGINAL (for source lookup):
async function kP2(A, Q, B, G = [], Z = []) {
  let I = await A.getPromptForCommand(Q, B),
    Y = sf5(A, Q);
  g(`Metadata string for ${A.userFacingName()}:`), g(`  ${Y.substring(0,200)}`);
  let J = (Y.match(/<command-message>/g) || []).length;
  g(`  command-message tags in metadata: ${J}`);
  let W = w0A(A.allowedTools ?? []),
    X = Z.length > 0 || G.length > 0 ? [...Z, ...G, ...I] : I,
    V = Xf([R0({
      content: X
    })], void 0),
    F = await d91(jYA(I.filter((D) => D.type === "text").map((D) => D.text).join(" "), B, null, [], B.messages, "repl_main_thread")),
    K = [R0({
      content: Y
    }), R0({
      content: X,
      isMeta: !0
    }), ...F, ...W.length || A.model ? [l9({
      type: "command_permissions",
      allowedTools: W,
      model: A.useSmallFastModel ? MW() : A.model
    })] : []];
  return g(`processPromptSlashCommand creating ${K.length} messages for ${A.userFacingName()}`), K.forEach((D, H) => {
    // ... (logging)
  }), {
    messages: K,
    shouldQuery: !0,
    allowedTools: W,
    maxThinkingTokens: V > 0 ? V : void 0,
    model: A.useSmallFastModel ? MW() : A.model,
    command: A
  }
}

// READABLE (for understanding):
async function processPromptSlashCommand(
  command,               // Command definition
  args,                  // Command arguments
  toolUseContext,        // Tool execution context
  precedingInputBlocks,  // Previous input blocks
  attachments            // File attachments
) {
  // Step 1: Get prompt content from command
  let promptContent = await command.getPromptForCommand(args, toolUseContext);

  // Step 2: Format command metadata for display
  let metadata = formatCommandMetadataWithProgress(command, args);
  debug(`Metadata string for ${command.userFacingName()}:`);
  debug(`  ${metadata.substring(0, 200)}`);

  // Step 3: Parse allowed tools
  let allowedTools = parseAllowedTools(command.allowedTools ?? []);

  // Step 4: Combine content (attachments + preceding blocks + prompt)
  let combinedContent = attachments.length > 0 || precedingInputBlocks.length > 0
    ? [...attachments, ...precedingInputBlocks, ...promptContent]
    : promptContent;

  // Step 5: Calculate thinking tokens
  let thinkingTokens = calculateThinkingTokens([
    createUserMessage({ content: combinedContent })
  ], undefined);

  // Step 6: Process any file attachments in prompt
  let processedAttachments = await processAttachments(
    extractTextContent(promptContent),
    toolUseContext,
    null,
    [],
    toolUseContext.messages,
    "repl_main_thread"
  );

  // Step 7: Build messages array
  let messages = [
    // Command metadata message
    createUserMessage({ content: metadata }),

    // Main prompt content (marked as meta)
    createUserMessage({ content: combinedContent, isMeta: true }),

    // Processed attachments
    ...processedAttachments,

    // Command permissions (if tools restricted or model override)
    ...(allowedTools.length || command.model
      ? [createCommandPermissionsMessage({
          type: "command_permissions",
          allowedTools: allowedTools,
          model: command.useSmallFastModel ? getSmallFastModel() : command.model
        })]
      : [])
  ];

  debug(`processPromptSlashCommand creating ${messages.length} messages for ${command.userFacingName()}`);

  return {
    messages: messages,
    shouldQuery: true,          // Invoke LLM
    allowedTools: allowedTools,
    maxThinkingTokens: thinkingTokens > 0 ? thinkingTokens : undefined,
    model: command.useSmallFastModel ? getSmallFastModel() : command.model,
    command: command
  };
}

// Mapping: kP2→processPromptSlashCommand, A→command, Q→args, B→toolUseContext,
//          G→precedingInputBlocks, Z→attachments, I→promptContent, Y→metadata,
//          W→allowedTools, X→combinedContent, V→thinkingTokens, F→processedAttachments,
//          K→messages, w0A→parseAllowedTools, sf5→formatCommandMetadataWithProgress,
//          MW→getSmallFastModel
```

### Prompt Processing Pseudocode

```
FUNCTION processPromptSlashCommand(command, args, context):

    // Get command's prompt template
    promptContent = command.getPromptForCommand(args, context)

    // Format metadata for display
    metadata = formatCommandMetadata(command, args)

    // Parse allowed tools (comma-separated with paren handling)
    allowedTools = parseAllowedTools(command.allowedTools)

    // Combine all content
    combinedContent = [...attachments, ...precedingBlocks, ...promptContent]

    // Calculate thinking tokens for extended thinking
    thinkingTokens = calculateThinkingTokens(combinedContent)

    // Build message array
    messages = [
        userMessage(metadata),
        userMessage(combinedContent, isMeta=true),
        ...processedAttachments,
        ...commandPermissions(allowedTools, model)
    ]

    RETURN {
        messages: messages,
        shouldQuery: true,        // SEND TO LLM
        allowedTools: allowedTools,
        maxThinkingTokens: thinkingTokens,
        model: command.model
    }
```

---

## Message Creation Functions

### createUserMessage (R0)

Creates user message objects for the conversation:

```javascript
// ============================================
// createUserMessage - Create user message object
// Location: chunks.153.mjs:2179-2205
// ============================================

// ORIGINAL (for source lookup):
function R0({
  content: A,
  isMeta: Q,
  isVisibleInTranscriptOnly: B,
  isCompactSummary: G,
  toolUseResult: Z,
  uuid: I,
  thinkingMetadata: Y,
  timestamp: J,
  todos: W
}) {
  return {
    type: "user",
    message: {
      role: "user",
      content: A || $q
    },
    isMeta: Q,
    isVisibleInTranscriptOnly: B,
    isCompactSummary: G,
    uuid: I ?? nO(),
    timestamp: J ?? new Date().toISOString(),
    toolUseResult: Z,
    thinkingMetadata: Y,
    todos: W
  }
}

// READABLE (for understanding):
function createUserMessage({
  content,                    // Message content (string or blocks)
  isMeta,                     // Meta message (not shown in UI)
  isVisibleInTranscriptOnly,  // Only visible in transcript
  isCompactSummary,           // Compaction summary message
  toolUseResult,              // Tool use result data
  uuid,                       // Message UUID
  thinkingMetadata,           // Extended thinking metadata
  timestamp,                  // Message timestamp
  todos                       // Associated todos
}) {
  return {
    type: "user",
    message: {
      role: "user",
      content: content || EMPTY_PLACEHOLDER
    },
    isMeta: isMeta,
    isVisibleInTranscriptOnly: isVisibleInTranscriptOnly,
    isCompactSummary: isCompactSummary,
    uuid: uuid ?? generateUUID(),
    timestamp: timestamp ?? new Date().toISOString(),
    toolUseResult: toolUseResult,
    thinkingMetadata: thinkingMetadata,
    todos: todos
  };
}

// Mapping: R0→createUserMessage, A→content, Q→isMeta, B→isVisibleInTranscriptOnly,
//          G→isCompactSummary, Z→toolUseResult, I→uuid, Y→thinkingMetadata,
//          J→timestamp, W→todos, $q→EMPTY_PLACEHOLDER, nO→generateUUID
```

### createLocalCommandSystemMessage (z60)

Creates system messages for local command output:

```javascript
// ============================================
// createLocalCommandSystemMessage - Create system message for local commands
// Location: chunks.154.mjs:383-393
// ============================================

// ORIGINAL (for source lookup):
function z60(A) {
  return {
    type: "system",
    subtype: "local_command",
    content: A,
    level: "info",
    timestamp: new Date().toISOString(),
    uuid: nO(),
    isMeta: !1
  }
}

// READABLE (for understanding):
function createLocalCommandSystemMessage(content) {
  return {
    type: "system",
    subtype: "local_command",
    content: content,
    level: "info",
    timestamp: new Date().toISOString(),
    uuid: generateUUID(),
    isMeta: false
  };
}

// Mapping: z60→createLocalCommandSystemMessage, A→content, nO→generateUUID
```

### formatCommandMetadata (a61)

Formats command metadata for display:

```javascript
// ============================================
// formatCommandMetadata - Format command info for display
// Location: chunks.121.mjs:1149-1153
// ============================================

// ORIGINAL (for source lookup):
function a61(A, Q) {
  return `<command-name>/${A.userFacingName()}</command-name>
            <command-message>${A.userFacingName()}</command-message>
            <command-args>${Q}</command-args>`
}

// READABLE (for understanding):
function formatCommandMetadata(command, args) {
  return `<command-name>/${command.userFacingName()}</command-name>
            <command-message>${command.userFacingName()}</command-message>
            <command-args>${args}</command-args>`;
}

// Mapping: a61→formatCommandMetadata, A→command, Q→args
```

### buildMessageContent (Y$)

Combines input string with preceding blocks:

```javascript
// ============================================
// buildMessageContent - Build message content array
// Location: chunks.153.mjs:2207-2216
// ============================================

// ORIGINAL (for source lookup):
function Y$({
  inputString: A,
  precedingInputBlocks: Q
}) {
  if (Q.length === 0) return A;
  return [...Q, {
    text: A,
    type: "text"
  }]
}

// READABLE (for understanding):
function buildMessageContent({ inputString, precedingInputBlocks }) {
  // If no preceding blocks, just return the string
  if (precedingInputBlocks.length === 0) {
    return inputString;
  }

  // Combine preceding blocks with new text block
  return [
    ...precedingInputBlocks,
    {
      text: inputString,
      type: "text"
    }
  ];
}

// Mapping: Y$→buildMessageContent, A→inputString, Q→precedingInputBlocks
```

---

## Serial Command Queue

Commands execute serially (one at a time) using a FIFO queue.

### Queue Architecture

```
User submits: /cmd1, /cmd2, /cmd3
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  Command Queue (FIFO)                                            │
│                                                                  │
│  [/cmd1] ─── [/cmd2] ─── [/cmd3]                                │
│     ▲                                                            │
│     │                                                            │
│  Currently executing                                             │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ Execute one at a time
       │
  /cmd1 completes
       │
       ▼ Dequeue next
       │
  /cmd2 starts executing
```

### Queue Functions

```javascript
// ============================================
// enqueueCommand - Add command to queue
// Location: chunks.142.mjs:1717-1722
// ============================================

// ORIGINAL (for source lookup):
function XI1(A, Q) {
  Q((B) => ({
    ...B,
    queuedCommands: [...B.queuedCommands, A]
  })), NjA("enqueue", typeof A.value === "string" ? A.value : void 0)
}

// READABLE (for understanding):
function enqueueCommand(command, setState) {
  setState((state) => ({
    ...state,
    queuedCommands: [...state.queuedCommands, command]
  }));
  logQueueEvent("enqueue", typeof command.value === "string" ? command.value : undefined);
}

// Mapping: XI1→enqueueCommand, A→command, Q→setState, B→state, NjA→logQueueEvent
```

```javascript
// ============================================
// dequeueSingleCommand - Remove and return next command
// Location: chunks.142.mjs:1724-1732
// ============================================

// ORIGINAL (for source lookup):
async function n89(A, Q) {
  let B = await A();
  if (B.queuedCommands.length === 0) return;
  let [G, ...Z] = B.queuedCommands;
  return Q((I) => ({
    ...I,
    queuedCommands: Z
  })), NjA("dequeue"), G
}

// READABLE (for understanding):
async function dequeueSingleCommand(getState, setState) {
  let state = await getState();

  // Return if queue is empty
  if (state.queuedCommands.length === 0) return;

  // Destructure: first command and rest
  let [nextCommand, ...remaining] = state.queuedCommands;

  // Update state with remaining commands
  setState((state) => ({
    ...state,
    queuedCommands: remaining
  }));

  logQueueEvent("dequeue");
  return nextCommand;
}

// Mapping: n89→dequeueSingleCommand, A→getState, Q→setState, B→state,
//          G→nextCommand, Z→remaining, NjA→logQueueEvent
```

```javascript
// ============================================
// dequeueAllCommands - Clear and return all commands
// Location: chunks.142.mjs:1734-1744
// ============================================

// ORIGINAL (for source lookup):
async function a89(A, Q) {
  let B = await A();
  if (B.queuedCommands.length === 0) return [];
  let G = [...B.queuedCommands];
  Q((Z) => ({
    ...Z,
    queuedCommands: []
  }));
  for (let Z of G) NjA("dequeue");
  return G
}

// READABLE (for understanding):
async function dequeueAllCommands(getState, setState) {
  let state = await getState();

  // Return empty if queue is empty
  if (state.queuedCommands.length === 0) return [];

  // Copy all commands
  let allCommands = [...state.queuedCommands];

  // Clear queue
  setState((state) => ({
    ...state,
    queuedCommands: []
  }));

  // Log each dequeue
  for (let cmd of allCommands) {
    logQueueEvent("dequeue");
  }

  return allCommands;
}

// Mapping: a89→dequeueAllCommands, A→getState, Q→setState, B→state,
//          G→allCommands, NjA→logQueueEvent
```

### Why Serial Execution?

**Design rationale:**
1. **Deterministic order:** Commands affect state (context, settings) predictably
2. **Avoid race conditions:** Commands that modify same resources don't conflict
3. **User expectations:** Commands execute in the order typed
4. **Resource management:** One LLM call at a time for prompt commands

**Contrast with tool execution:**
- **Commands:** SERIAL (queue, one at a time)
- **Tools:** PARALLEL (multiple tool calls can run concurrently)

---

## Display Options

Commands can control how their output appears:

### Display Option Values

| Option | Effect | Messages | History |
|--------|--------|----------|---------|
| `"skip"` | No transcript entry | Empty array | `skipHistory: true` |
| `"system"` | System message format | System messages | Normal |
| Default | User message format | User messages | Normal |

### Implementation

```javascript
// Display option handling in local-jsx commands:
command.call((output, displayOptions) => {
  if (displayOptions?.display === "skip") {
    // No messages, skip history
    return {
      messages: [],
      shouldQuery: false,
      skipHistory: true
    };
  }

  if (displayOptions?.display === "system") {
    // System message format
    return {
      messages: [
        createLocalCommandSystemMessage(metadata),
        createLocalCommandSystemMessage(output)
      ]
    };
  }

  // Default: User message format
  return {
    messages: [
      createUserMessage({ content: metadata }),
      createUserMessage({ content: output })
    ]
  };
}, context, args);
```

---

## Non-Interactive Mode

Commands can specify whether they support non-interactive (headless) mode:

```javascript
// Non-interactive check in executeCommand:
if (toolUseContext.options.isNonInteractiveSession) {
  // For local-jsx commands: skip JSX rendering
  resolve({
    messages: [],
    shouldQuery: false,
    skipHistory: true,
    command: command
  });
  return;
}
```

**Command property:** `supportsNonInteractive: boolean`

Commands that require user interaction (like `/config`, `/ide`) will be skipped in non-interactive mode.

---

## Error Handling

### Error Types and Handling

| Error Type | Source | Handling |
|------------|--------|----------|
| `CommandNotFoundError` | lookupCommand | Return error message |
| Execution error | command.call() | Wrap in `<local-command-stderr>` |
| Prompt error | processPromptSlashCommand | Wrap in `<local-command-stderr>` |

### Error Output Format

```xml
<!-- Error output uses stderr tags -->
<local-command-stderr>Error: Something went wrong</local-command-stderr>

<!-- Normal output uses stdout tags -->
<local-command-stdout>Command completed successfully</local-command-stdout>
```

---

## Execution Result Structure

The final result from command execution:

```typescript
interface ExecutionResult {
  messages: Message[];           // Messages for conversation
  shouldQuery: boolean;          // Whether to invoke LLM
  allowedTools?: string[];       // Restricted tools (prompt commands)
  skipHistory?: boolean;         // Skip saving to history
  maxThinkingTokens?: number;    // Extended thinking budget
  model?: string;                // Model override
  command: Command;              // Executed command definition
}
```

---

## See Also

- [Command Parsing](./parsing.md) - How commands are parsed before execution
- [Built-in Commands](./builtin_commands.md) - All built-in command definitions
- [Custom Commands](./custom_commands.md) - Custom command loading system
- [Streaming and Errors](./streaming_errors.md) - Streaming support and error handling
