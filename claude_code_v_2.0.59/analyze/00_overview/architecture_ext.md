# Claude Code v2.0.59 - Architecture Analysis (Part 2: Extended Modules)

> **Split Documentation:**
> - **Part 1:** [architecture_core.md](./architecture_core.md) - Entry/UI, LLM Core, Tool System (Modules 01-06)
> - **Part 2 (this file):** Context, Extensibility, Infrastructure (Modules 07-18)

> **Symbol References:**
> - [symbol_index_core.md](./symbol_index_core.md) - Core execution modules
> - [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules

---

## Table of Contents

1. [Context Management (Modules 07, 13, 15)](#context-management-modules-07-13-15)
2. [Extensibility Layer (Modules 08-12)](#extensibility-layer-modules-08-12)
3. [Infrastructure Layer (Modules 14, 16, 17, 18)](#infrastructure-layer-modules-14-16-17-18)
4. [Cross-Module Integration](#cross-module-integration)
5. [Key Algorithms Deep Dive](#key-algorithms-deep-dive)

---

## Context Management (Modules 07, 13, 15)

### Module 07: Compact System

#### Two-Tier Compaction Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPACT DISPATCHER (sI2)                      │
│                 chunks.107.mjs:1707-1731                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Check: Token count > threshold?
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌─────────────────────────────┐  ┌─────────────────────────────────┐
│    MICRO-COMPACT (Si)       │  │       FULL COMPACT (j91)        │
│    Fast, No API Call        │  │       LLM Summarization         │
│                             │  │                                 │
│  1. Find old tool results   │  │  1. Run PreCompact hooks        │
│  2. Truncate/remove content │  │  2. Build summary prompt        │
│  3. Keep last 3 tool uses   │  │  3. Call Claude for summary     │
│  4. Estimate token savings  │  │  4. Replace messages            │
│                             │  │  5. Restore context:            │
│  Success: Return savings    │  │     - Files (bD5)               │
│  Fail: Proceed to full      │  │     - Todos (fD5)               │
└─────────────────────────────┘  │     - Plan file (XQ0)           │
                                 │  6. Create boundary marker       │
                                 │  7. Run SessionStart hooks       │
                                 └─────────────────────────────────┘
```

#### Compact Threshold Calculation

```javascript
// ============================================
// x1A - calculateThresholds
// Location: chunks.107.mjs:1677-1691
// ============================================

// READABLE (for understanding):
function calculateThresholds(contextWindowSize) {
  const FREE_SPACE_BUFFER = 13000;  // Reserved for new messages
  const WARNING_MULTIPLIER = 0.9;   // 90% of available
  const ERROR_MULTIPLIER = 0.95;    // 95% of available

  const availableTokens = contextWindowSize - FREE_SPACE_BUFFER;

  return {
    autoCompact: availableTokens * 0.8,   // Trigger compaction
    warning: availableTokens * WARNING_MULTIPLIER,
    error: availableTokens * ERROR_MULTIPLIER
  };
}

// Key Constants:
const MIN_TOKENS_TO_SAVE = 20000;  // Micro-compact threshold
const KEEP_LAST_N_TOOLS = 3;      // Preserve recent tool results
const TOKENS_PER_IMAGE = 2000;    // Fixed estimate for images
```

#### Micro-Compact Algorithm

```javascript
// ============================================
// Si - microCompactToolResults
// Location: chunks.107.mjs:1440-1545
// ============================================

// READABLE (for understanding):
function microCompactToolResults(messages, targetSavings) {
  let totalSaved = 0;
  const compactedIds = new Set();

  // Walk messages from oldest to newest
  for (let i = 0; i < messages.length - KEEP_LAST_N_TOOLS; i++) {
    const message = messages[i];

    if (message.role !== 'assistant') continue;

    for (const block of message.content) {
      if (block.type !== 'tool_use') continue;

      const toolUseId = block.id;
      const resultMessage = findToolResult(messages, toolUseId);

      if (!resultMessage) continue;

      // Calculate token cost of this result
      const resultTokens = calculateToolResultTokens(resultMessage);

      // Truncate or remove entirely
      if (resultTokens > 1000) {
        const truncated = truncateToolResult(resultMessage, 500);
        totalSaved += resultTokens - 500;
        compactedIds.add(toolUseId);
      }

      if (totalSaved >= targetSavings) {
        return { success: true, tokensSaved: totalSaved, compactedIds };
      }
    }
  }

  return { success: totalSaved >= MIN_TOKENS_TO_SAVE, tokensSaved: totalSaved, compactedIds };
}
```

#### Context Restoration After Full Compact

```javascript
// ============================================
// Context Restoration Functions
// Location: chunks.107.mjs:1248-1291
// ============================================

// READABLE (for understanding):

// bD5 - Restore recent file reads
async function restoreFileReads(context) {
  const MAX_FILES = 5;
  const TOKEN_BUDGET = 50000;

  const recentFiles = getRecentlyReadFiles(context.fileReadState)
    .slice(0, MAX_FILES);

  let tokensUsed = 0;
  const restorations = [];

  for (const filePath of recentFiles) {
    const content = await readFileWithLimits(filePath, TOKEN_BUDGET - tokensUsed);
    const tokens = approximateTokenCount(content);

    if (tokensUsed + tokens > TOKEN_BUDGET) break;

    restorations.push(createFileReadMessage(filePath, content));
    tokensUsed += tokens;
  }

  return restorations;
}

// fD5 - Restore todo list
function restoreTodoList(context) {
  if (!context.todos || context.todos.length === 0) return null;

  return createAttachment({
    type: "todo",
    content: formatTodoList(context.todos),
    isMeta: false
  });
}

// XQ0 - Restore plan file
async function restorePlanFile(context) {
  if (!context.isPlanMode) return null;

  const planPath = getPlanFilePath(context.sessionId);
  if (!await fileExists(planPath)) return null;

  const planContent = await readFile(planPath);
  return createAttachment({
    type: "plan_file",
    path: planPath,
    content: planContent
  });
}
```

---

### Module 13: Todo List System

#### 5-Layer Enforcement Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: STRONG LANGUAGE IN SYSTEM PROMPT                       │
│  - "Use these tools VERY frequently" (all caps)                 │
│  - "may forget...unacceptable" (negative framing)               │
│  - "It is critical that you mark..."                            │
│  Location: chunks.152.mjs:2342-2435                             │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: HIDDEN META-REMINDERS                                  │
│  - Generated after 7+ turns without TodoWrite                   │
│  - At least 3 turns since last reminder                         │
│  - Wrapped with isMeta: true (hidden from user)                 │
│  Location: _H5 (chunks.107.mjs:2379-2394)                       │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: EXPLICIT EXAMPLES IN PROMPT                            │
│  - 5+ detailed usage examples                                    │
│  - Shows proper state transitions                                │
│  - Demonstrates complex task breakdown                           │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: AUTO-CLEANUP ON COMPLETION                             │
│  - If all todos are completed, list is cleared                  │
│  - Prevents stale todos from accumulating                        │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  Layer 5: UI VISIBILITY (Spinner)                                │
│  - Active todo shown in spinner with activeForm text            │
│  - Full list visible when expanded                               │
│  Location: OO2 (chunks.118.mjs:1317-1460)                       │
└─────────────────────────────────────────────────────────────────┘
```

#### TodoWriteTool Definition

```javascript
// ============================================
// BY - TodoWriteTool
// Location: chunks.60.mjs:1141-1211
// ============================================

const TodoWriteTool = {
  name: "TodoWrite",
  description: todoWriteDescription,  // ~1000 chars of usage instructions

  inputSchema: z.object({
    todos: z.array(z.object({
      content: z.string().min(1),     // What needs to be done
      status: z.enum(["pending", "in_progress", "completed"]),
      activeForm: z.string().min(1)   // Present continuous (e.g., "Running tests")
    }))
  }),

  outputSchema: z.object({
    success: z.boolean()
  }),

  isReadOnly: false,
  requiresApproval: false,
  isConcurrencySafe: true,

  async call(input, context) {
    const { todos } = input;

    // Update state
    context.setAppState(state => ({
      ...state,
      todos: {
        ...state.todos,
        [context.agentId]: {
          items: todos,
          lastUpdated: Date.now()
        }
      }
    }));

    // Auto-cleanup if all completed
    if (todos.every(t => t.status === "completed")) {
      context.setAppState(state => ({
        ...state,
        todos: {
          ...state.todos,
          [context.agentId]: { items: [], lastUpdated: Date.now() }
        }
      }));
    }

    // Persist to disk
    await writeTodosToFile(context.sessionId, context.agentId, todos);

    return { success: true };
  }
};
```

---

### Module 15: State Management

#### Central State Object (18 Fields)

```javascript
// ============================================
// f0 - appState
// Location: chunks.158.mjs:353-415
// ============================================

const appState = {
  // User Preferences
  settings: Object,                    // User/project/local merged settings
  verbose: boolean,                    // Debug output enabled
  showExpandedTodos: boolean,          // Todo list expansion

  // Session State
  backgroundTasks: Object,             // Running async task states
  mainLoopModel: string | null,        // Current model name
  mainLoopModelForSession: string | null, // Session-specific override
  thinkingEnabled: boolean,            // Extended thinking mode

  // Permission & Security
  toolPermissionContext: {
    mode: "default" | "bypassPermissions",
    additionalWorkingDirectories: Map,
    alwaysAllowRules: Object,
    alwaysDenyRules: Object,
    alwaysAskRules: Object,
    isBypassPermissionsModeAvailable: boolean
  },

  // Extensions
  agentDefinitions: Object,            // Available agents
  mcp: {
    clients: Array,
    tools: Array,
    commands: Array,
    resources: Object
  },
  plugins: {
    enabled: Array,
    disabled: Array,
    commands: Array,
    agents: Array,
    errors: Array,
    installationStatus: Object
  },

  // UI State
  statusLineText: string | undefined,
  notifications: { current: Object | null, queue: Array },
  elicitation: { queue: Array },
  promptSuggestion: { text: string | null, shownAt: number },
  queuedCommands: Array,

  // Task Management
  todos: { [agentId]: { items: Array, lastUpdated: number } },

  // File Tracking
  fileHistory: { snapshots: Array, trackedFiles: Set },
  gitDiff: { stats: Object, hunks: Map, lastUpdated: number, version: number },

  // Analytics
  feedbackSurvey: { timeLastShown: number | null, submitCountAtLastAppearance: number | null },
  sessionHooks: Object
};
```

#### React Context Implementation

```javascript
// ============================================
// yG - AppStateProvider
// Location: chunks.70.mjs:2399-2437
// ============================================

// READABLE (for understanding):
function AppStateProvider({ children, initialState, onChangeAppState }) {
  // Prevent nesting
  const isAlreadyInitialized = useContext(AppStateProviderFlag);
  if (isAlreadyInitialized) {
    throw Error("AppStateProvider cannot be nested");
  }

  // State with history for diffing
  const [stateHistory, setStateHistory] = useState({
    currentState: initialState ?? getDefaultState(),
    previousState: null
  });

  // State updater with change notification
  const updateState = useCallback((updaterFn) => {
    setStateHistory(({ currentState: oldState }) => {
      const newState = updaterFn(oldState);

      // Notify parent for persistence
      onChangeAppState?.({
        newState,
        oldState
      });

      return { currentState: newState, previousState: oldState };
    });
  }, [onChangeAppState]);

  // Watch for external settings changes
  useEffect(() => {
    return subscribeToSettingsChanges((source, newSettings) => {
      updateState(state => ({
        ...state,
        settings: newSettings,
        toolPermissionContext: mergePermissions(
          state.toolPermissionContext,
          recalculatePermissions()
        )
      }));
    });
  }, [updateState]);

  return (
    <AppStateProviderFlag.Provider value={true}>
      <AppStateContext.Provider value={[stateHistory.currentState, updateState]}>
        {children}
      </AppStateContext.Provider>
    </AppStateProviderFlag.Provider>
  );
}

// Hook to access state
function useAppState() {
  const value = useContext(AppStateContext);
  if (!value.__IS_INITIALIZED__) {
    throw ReferenceError("useAppState must be called within AppStateProvider");
  }
  return value;
}
```

#### Persistence Callback (Yu)

```javascript
// ============================================
// Yu - onChangeAppState
// Location: chunks.156.mjs:2146-2183
// ============================================

// Monitors changes and persists specific fields:

const PERSISTENCE_TRIGGERS = {
  mainLoopModel: {
    storage: '~/.claude/settings.json',
    condition: (newVal, oldVal) => newVal !== oldVal
  },
  showExpandedTodos: {
    storage: '~/.claude/settings.json',
    condition: (newVal, settings) => newVal !== settings.showExpandedTodos
  },
  todos: {
    storage: '~/.claude/todos/{sessionId}-agent-{agentId}.json',
    condition: (newRef, oldRef) => newRef !== oldRef // Reference check
  },
  verbose: {
    storage: '~/.claude/settings.json',
    condition: (newVal, settings) => newVal !== settings.verbose
  },
  thinkingEnabled: {
    storage: '~/.claude/settings.json',
    condition: (newVal, oldVal) => newVal !== oldVal
  },
  'feedbackSurvey.timeLastShown': {
    storage: '~/.claude/settings.json',
    condition: (newVal) => newVal !== null
  }
};
```

---

## Extensibility Layer (Modules 08-12)

### Module 08: Subagent System

#### Task Tool Architecture

```javascript
// ============================================
// jn - TaskTool
// Location: chunks.145.mjs:1812-2015
// ============================================

const TaskTool = {
  name: "Task",
  description: taskToolDescription,  // ~2000 chars

  inputSchema: z.object({
    prompt: z.string(),
    description: z.string().max(50),
    subagent_type: z.string(),
    model: z.enum(["sonnet", "opus", "haiku"]).optional(),
    resume: z.string().optional(),  // Agent ID to resume
    run_in_background: z.boolean().optional()
  }),

  outputSchema: z.union([
    z.object({ result: z.string() }),                    // Completed
    z.object({ agentId: z.string(), status: z.string() }) // Background
  ]),

  async *call(input, context) {
    const { prompt, subagent_type, model, run_in_background } = input;

    // Find agent definition
    const agentDef = context.agentDefinitions[subagent_type];
    if (!agentDef) {
      throw new Error(`Unknown agent type: ${subagent_type}`);
    }

    // Resolve model (env var > param > agent def > parent)
    const resolvedModel = resolveAgentModel(model, agentDef, context);

    // Create isolated context
    const subContext = createSubAgentContext(context, {
      agentId: generateAgentId(),
      model: resolvedModel,
      tools: filterToolsForSubagent(agentDef, context.tools),
      isSubAgent: true
    });

    if (run_in_background) {
      // Launch and return immediately
      const agentId = subContext.agentId;
      launchBackgroundAgent(subContext, prompt);
      yield { agentId, status: "running" };
    } else {
      // Execute and wait for completion
      const result = await executeAgentToCompletion(subContext, prompt);
      yield { result };
    }
  }
};
```

#### Agent Model Resolution Chain

```
Environment Variable Override (CLAUDE_CODE_AGENT_MODEL_*)
    ↓
Task Parameter (model: "sonnet")
    ↓
Agent Definition (agent.model: "haiku")
    ↓
Parent Model (inherit from caller)
```

#### Context Fork and Isolation

```javascript
// ============================================
// BSA - createSubAgentContext
// Location: chunks.145.mjs:915-960
// ============================================

function createSubAgentContext(parentContext, options) {
  return {
    ...parentContext,

    // Unique identity
    agentId: options.agentId,
    chainId: generateChainId(parentContext.chainId),

    // Isolation
    isSubAgent: true,
    abortController: createIsolatedAbortController(),

    // Filtered capabilities
    tools: options.tools,
    model: options.model,

    // Fork messages (remove unresolved tool uses)
    messages: filterUnresolvedToolUses(parentContext.messages),

    // Entry marker
    entryMessage: createAgentEntryMessage(parentContext)
  };
}

// Filter out pending tool calls from fork context
function filterUnresolvedToolUses(messages) {
  return messages.filter(msg => {
    if (msg.role !== 'assistant') return true;
    return !msg.content.some(block =>
      block.type === 'tool_use' && !hasToolResult(messages, block.id)
    );
  });
}
```

---

### Module 09: Slash Command System

#### Parsing Pipeline

```
User Input: "/review-pr 123"
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 1: extractCommandParts (rJA)                           │
│  - Tokenize input                                            │
│  - Detect "(MCP)" marker                                     │
│  Output: { name: "review-pr", args: "123", isMcp: false }   │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 2: isValidCommandName (if5)                            │
│  - Regex: /^[a-zA-Z0-9:\-_]+$/                              │
│  - Reject invalid characters                                 │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 3: classifyType                                        │
│  - Built-in: /help, /clear, /compact                        │
│  - Custom: .claude/commands/*.md                            │
│  - MCP: (MCP) marker present                                │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 4: lookupCommand (Pq)                                  │
│  - Find by name, userFacingName, or aliases                 │
│  - Return command definition                                 │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 5: executeCommand (nf5)                                │
│  - Route by type: local-jsx | local | prompt                │
│  - Execute and return result                                 │
└──────────────────────────────────────────────────────────────┘
```

#### Command Types

```javascript
// Type 1: local-jsx (Promise-based, renders JSX)
{
  type: "local-jsx",
  call: async (args, context) => {
    return <Component {...props} />;  // Returns JSX
  }
}

// Type 2: local (sync, text output)
{
  type: "local",
  supportsNonInteractive: true,
  call: (args, context) => {
    return { type: "value", value: "result" };
    // Or: { type: "skip" }
    // Or: { type: "compact" }
  }
}

// Type 3: prompt (LLM invocation)
{
  type: "prompt",
  call: async (args, context) => {
    return processPromptCommand(args, context); // kP2
  }
}
```

#### Serial Command Queue

```javascript
// Commands execute one-at-a-time (FIFO)
// Different from parallel tool execution

function enqueueCommand(command) {
  appState.queuedCommands.push(command);
}

function dequeueSingleCommand() {
  return appState.queuedCommands.shift();
}

// Processing loop
while (appState.queuedCommands.length > 0) {
  const command = dequeueSingleCommand();
  await executeCommand(command);
  // Wait for completion before next
}
```

---

### Module 10: Skill System

#### 3-Tier Loading Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Tier 1: Policy Settings (Highest Priority)                     │
│  Location: Enterprise/managed directory                         │
│  Priority: 1 (overrides all)                                    │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  Tier 2: User Settings                                          │
│  Location: ~/.claude/skills/*.md                                │
│  Priority: 2                                                    │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  Tier 3: Project Settings                                       │
│  Location: .claude/skills/*.md                                  │
│  Priority: 3 (lowest)                                           │
└─────────────────────────────────────────────────────────────────┘

Deduplication: By inode (prevents symlink duplicates)
Token Budget: 15,000 chars max per skill (configurable)
```

#### SKILL.md Frontmatter Schema

```yaml
---
name: skill-name              # Required: Unique identifier
description: What it does     # Required: Shown in skill list
when_to_use: When to invoke   # Optional: LLM guidance

allowed-tools:                # Optional: Tool whitelist
  - Read
  - Grep
  - Glob

model: sonnet                 # Optional: sonnet|opus|haiku|inherit
disable-model-invocation: false  # Optional: Hide from LLM
argument-hint: <optional args>   # Optional: Usage hint
version: 1.0                     # Optional: Schema version
---

# Skill Content

Markdown content that becomes the skill prompt.
Can include $ARGUMENTS placeholder for user input.
```

#### Skill Tool Implementation

```javascript
// ============================================
// ln - SkillTool
// Location: chunks.130.mjs:2555-2745
// ============================================

const SkillTool = {
  name: "Skill",

  validateInput(input) {
    const { skill } = input;
    const skillDef = lookupSkill(skill);

    if (!skillDef) return { error: `Skill not found: ${skill}` };
    if (skillDef.disableModelInvocation) return { error: "Skill disabled" };
    if (skillDef.type !== "prompt") return { error: "Not a prompt skill" };

    return { valid: true };
  },

  checkPermissions(input, context) {
    // Wildcard pattern matching (prefix:*)
    const rule = findMatchingRule(input.skill, context.permissions);
    return rule ? rule.allowed : true;
  },

  async call(input, context) {
    const { skill, arguments: args } = input;
    const skillDef = lookupSkill(skill);

    // Process prompt template
    let prompt = skillDef.content;
    if (prompt.includes("$ARGUMENTS")) {
      prompt = prompt.replace("$ARGUMENTS", args || "");
    } else if (args) {
      prompt += `\n\nARGUMENTS: ${args}`;
    }

    // Return context modifier
    return {
      contextModifier: {
        allowedTools: skillDef.allowedTools,
        model: skillDef.model,
        maxThinkingTokens: skillDef.maxThinkingTokens
      },
      prompt
    };
  }
};
```

---

### Module 11: Hook System

#### 12 Event Types

```javascript
const HOOK_EVENT_TYPES = [
  "PreToolUse",           // Before tool execution
  "PostToolUse",          // After successful tool execution
  "PostToolUseFailure",   // After failed tool execution
  "Notification",         // System notification
  "UserPromptSubmit",     // User sends message
  "SessionStart",         // Session begins
  "SessionEnd",           // Session ends
  "Stop",                 // User cancels
  "SubagentStart",        // Subagent launched
  "SubagentStop",         // Subagent completed
  "PreCompact",           // Before compaction
  "PermissionRequest"     // Permission needed
];
```

#### Hook Configuration Loading

```javascript
// ============================================
// ek3 - loadAllHooks
// Location: chunks.146.mjs:3445-3476
// ============================================

// READABLE (for understanding):
function loadAllHooks() {
  // Priority: Managed > User > Project > Session
  // ALL sources AGGREGATE (not deduplicated)

  const hooks = [];

  // 1. Managed hooks (enterprise policy)
  hooks.push(...getManagedHooks());

  // 2. User hooks (~/.claude/hooks/)
  hooks.push(...getUserHooks());

  // 3. Project hooks (.claude/hooks/)
  hooks.push(...getProjectHooks());

  // 4. Session hooks (runtime registered)
  hooks.push(...getSessionHooks());

  return hooks;
}
```

#### Pattern Matching (tk3)

```javascript
// ============================================
// tk3 - matchPattern
// Location: chunks.146.mjs:3432-3443
// ============================================

function matchPattern(toolName, pattern) {
  // Format 1: Exact match
  // Pattern: "Write"
  // Matches: "Write" only
  if (!pattern.includes('|') && !pattern.startsWith('/')) {
    return toolName === pattern;
  }

  // Format 2: Pipe-separated list
  // Pattern: "Write|Edit|Bash"
  // Matches: "Write", "Edit", or "Bash"
  if (pattern.includes('|') && !pattern.startsWith('/')) {
    const options = pattern.split('|');
    return options.includes(toolName);
  }

  // Format 3: Regex
  // Pattern: "/^(Read|Write)$/"
  // Matches: Regex test
  if (pattern.startsWith('/') && pattern.endsWith('/')) {
    const regex = new RegExp(pattern.slice(1, -1));
    return regex.test(toolName);
  }

  return false;
}
```

#### Hook Execution Flow

```javascript
// ============================================
// qa - executeHooksInREPL
// Location: chunks.147.mjs:3-338
// ============================================

async function* executeHooksInREPL(eventType, context, options) {
  // Phase 1: Pre-execution guards
  if (isHookDisabled(eventType)) return;
  if (!isWorkspaceTrusted() && !shouldSkipWorkspaceTrust(eventType)) return;
  if (options.abortSignal?.aborted) return;

  // Phase 2: Analytics & progress
  yield { type: "progress", event: eventType };

  // Phase 3: Get matching hooks
  const matchingHooks = getMatchingHooks(eventType, context.toolName);

  // Phase 4: Execute hooks in parallel
  const results = await Promise.all(
    matchingHooks.map(hook =>
      executeHook(hook, context, options)
    )
  );

  // Phase 5: Aggregate results
  const aggregated = aggregateHookResults(results);

  // Phase 6: Telemetry
  logHookTelemetry(eventType, matchingHooks.length, aggregated);

  yield { type: "result", ...aggregated };
}
```

#### Exit Code Semantics

```
Exit 0    → Success (allow operation)
Exit 2    → BLOCKING ERROR (stop execution)
Exit 1,3+ → Non-blocking error (continue with warning)

// No retry logic by design
// Hooks must be idempotent
```

---

### Module 12: Plan Mode

#### State Machine

```
                    ┌─────────────────────┐
                    │    default mode     │
                    └──────────┬──────────┘
                               │
                    EnterPlanMode (cTA)
                               │
                    ┌──────────▼──────────┐
                    │     plan mode       │
                    │  (read-only tools)  │
                    └──────────┬──────────┘
                               │
                    ExitPlanMode (gq)
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    default      │  │  acceptEdits    │  │bypassPermissions│
│ (ask each tool) │  │ (auto-approve   │  │ (approve all)   │
│                 │  │  file edits)    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Plan File Management

```javascript
// ============================================
// Plan Slug Generation (ueB)
// Location: chunks.88.mjs:770-785
// ============================================

function generateRandomPlanSlug() {
  // 3-word combination from 200-word lists
  // ~8 million unique combinations
  const adjective = randomSelect(PLAN_ADJECTIVES);  // 200 words
  const action = randomSelect(PLAN_ACTIONS);        // 200 words
  const noun = randomSelect(PLAN_NOUNS);            // 200 words

  return `${adjective}-${action}-${noun}`;
  // Example: "graceful-napping-breeze"
}

// Path resolution
function getPlanFilePath(sessionId, agentId) {
  const slug = getOrCreateSlug(sessionId);

  if (agentId) {
    // Sub-agent plan
    return `~/.claude/plans/${slug}-agent-${agentId}.md`;
  }

  // Main session plan
  return `~/.claude/plans/${slug}.md`;
}
```

#### Built-in Agents for Plan Mode

```javascript
// ============================================
// Explore Agent (xq)
// Location: chunks.125.mjs:1404-1413
// ============================================

const exploreAgent = {
  name: "Explore",
  model: "haiku",  // Fast model for exploration
  tools: ["Glob", "Grep", "Read", "Bash"],  // Read-only subset
  systemPrompt: exploreAgentSystemPrompt,  // File search specialist
  forkContext: false,
  whenToUse: "Codebase exploration, file search, understanding structure"
};

// ============================================
// Plan Agent (kWA)
// Location: chunks.125.mjs:1474-1484
// ============================================

const planAgent = {
  name: "Plan",
  model: "inherit",  // Uses parent model (usually Sonnet/Opus)
  tools: ["Glob", "Grep", "Read", "Bash"],  // Same read-only subset
  systemPrompt: planAgentSystemPrompt,  // Software architect
  forkContext: true,
  whenToUse: "Implementation planning, architecture design"
};

// Agent counts (configurable)
// CLAUDE_CODE_PLAN_V2_AGENT_COUNT
const DEFAULT_PLAN_AGENTS = 1;     // 3 for enterprise/team
const DEFAULT_EXPLORE_AGENTS = 3;
```

#### Disallowed Tools in Plan Mode

```javascript
const PLAN_MODE_DISALLOWED = [
  "Task",           // No spawning subagents
  "ExitPlanMode",   // Handled specially
  "Edit",           // No file modifications
  "Write",          // No file modifications
  "NotebookEdit"    // No file modifications
];

// NOTE: TodoWrite is NOT in this list
// → Available during plan mode for tracking
```

---

## Infrastructure Layer (Modules 14, 16, 17, 18)

### Module 14: Code Indexing

#### Tree-sitter Bash Parsing

```javascript
// ============================================
// Q05 - loadTreeSitterWasm
// Location: chunks.90.mjs:465-498
// ============================================

// WASM Loading Strategy:
// 1. Primary: Bun embedded WASM binaries
// 2. Fallback: Load from ~/.claude/dependencies/
// 3. Third: FallbackCommandParser (string-based)

// Global singletons (session-level, never invalidated)
let parser = null;      // q01
let language = null;    // jo1
let initPromise = null; // Po1 - prevents concurrent init

async function loadTreeSitterWasm() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const Parser = await loadParser();
    const Bash = await loadBashLanguage();

    parser = new Parser();
    await parser.setLanguage(Bash);
    language = Bash;
  })();

  return initPromise;
}

// Parse result structure
interface ParseResult {
  tree: Tree;              // Full AST
  rootNode: Node;          // Root node
  envVars: string[];       // ["VAR=value", ...]
  commandNode: Node;       // Command node
  originalCommand: string;
}
```

#### File Index with Rust Backend

```javascript
// ============================================
// NO3 - buildFileIndex
// Location: chunks.138.mjs:1976-1998
// ============================================

// Cache Strategy:
// | Timeline    | State        | Behavior                    |
// |-------------|--------------|----------------------------|
// | First call  | No cache     | Block, wait for index build |
// | Within 60s  | Valid cache  | Return immediately          |
// | After 60s   | Stale cache  | Background refresh, use old |

const CACHE_TTL = 60000;  // 60 seconds
const MAX_RESULTS = 15;

async function buildFileIndex() {
  // Run ripgrep to discover files
  const files = await execWithTimeout(
    'rg --files --follow --hidden --glob "!.git/"',
    10000  // 10s timeout
  );

  // Merge with additional directories
  const additionalFiles = await getAdditionalFiles();
  const allFiles = [...files, ...additionalFiles];

  // Extract directory prefixes for autocomplete
  const directories = extractDirectoryPrefixes(allFiles);

  // Load into search backend
  if (isRustModuleAvailable()) {
    // Rust FileIndex (high performance)
    return new RustFileIndex(allFiles, directories);
  } else {
    // Fuse.js fallback (client-side fuzzy matching)
    return new FuseIndex(allFiles, directories, {
      filenameWeight: 2,  // Higher priority than full path
      testFilePenalty: true
    });
  }
}
```

---

### Module 16: File System (Under Development)

> **Note:** Module 16 analysis is under development. This module covers file system operations including:
> - File reading/writing abstractions
> - Path resolution and normalization
> - File watching and change detection
> - Workspace file enumeration

---

### Module 17: Telemetry

#### Multi-Destination Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Event Origin                                 │
│  GA() / eu() / M9() / AA()                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Sample Rate Check
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Event Router (hg3)                            │
└─────┬─────────────┬─────────────┬─────────────┬─────────────────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Sentry  │   │ Segment │   │ Datadog │   │  Local  │
│ (always)│   │ (gated) │   │ (gated) │   │ (always)│
└─────────┘   └─────────┘   └─────────┘   └─────────┘

Feature Gates (Statsig):
- tengu_log_segment_events → Segment routing
- tengu_log_datadog_events → Datadog routing
```

#### Queue Buffering Pattern

```javascript
// Events fire before OpenTelemetry initializes
// Queue in pendingEventQueue (NFA)

let telemetryProvider = null;  // tu
let pendingEventQueue = [];    // NFA

function analyticsEvent(name, properties) {
  if (!telemetryProvider) {
    // Queue for later
    pendingEventQueue.push({ name, properties, async: false });
    return;
  }

  telemetryProvider.log(name, properties);
}

// When provider attaches
function attachTelemetryProvider(provider) {
  telemetryProvider = provider;

  // Replay queued events
  const queued = [...pendingEventQueue];
  pendingEventQueue = [];

  queueMicrotask(() => {
    for (const event of queued) {
      if (event.async) {
        provider.logAsync(event.name, event.properties);
      } else {
        provider.log(event.name, event.properties);
      }
    }
  });
}
```

#### Telemetry Checkpoints (~20 markers)

```javascript
// Startup profiling (conditional via CLAUDE_CODE_PROFILE_STARTUP)

const STARTUP_CHECKPOINTS = [
  "cli_version_fast_path",
  "cli_ripgrep_path",
  "cli_before_main_import",
  "cli_after_main_import",
  "run_commander_initialized",
  "preAction_start",
  "preAction_after_init",
  "preAction_after_migrations",
  "action_handler_start",
  "action_after_mcp_load",
  "action_after_permissions",
  "action_after_tools_load",
  "action_after_agents_load",
  "action_after_plugins_init",
  "action_before_ui_render",
  "cli_after_main_complete"
];
```

---

### Module 18: Sandbox

#### 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: Settings & Configuration                               │
│  sH1 (parseSettingsToSandboxConfig)                             │
│  Sources: Local settings, CLI flags, Policy settings            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: Core Sandbox Engine                                    │
│  SandboxConfig (e8):                                            │
│  {                                                               │
│    network: { allowedDomains, deniedDomains, proxies },        │
│    filesystem: { denyRead, allowWrite, denyWrite },            │
│    ignoreViolations: { "*": [], [cmd]: [] }                    │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: Platform Wrappers                                      │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │ macOS: Tm0              │  │ Linux: qm0                  │   │
│  │ - sandbox-exec          │  │ - bubblewrap (bwrap)        │   │
│  │ - Seatbelt profile      │  │ - bind mounts               │   │
│  │ - H44 (profile gen)     │  │ - seccomp BPF               │   │
│  │ - Pm0 (violation log)   │  │ - J44 (fs restrictions)     │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: Bash Tool Integration                                  │
│  WIA (isBashSandboxed) - Decision tree:                         │
│  1. Is sandbox enabled?                                          │
│  2. Is dangerouslyDisableSandbox=true AND allowed?              │
│  3. Is command in excludedCommands?                              │
│  4. Run in sandbox if all checks pass                            │
└─────────────────────────────────────────────────────────────────┘
```

#### Platform-Specific Wrappers

```javascript
// ============================================
// macOS: Tm0 - macOSSandboxWrapper
// Location: chunks.17.mjs:45-80
// ============================================

function macOSSandboxWrapper(command, config) {
  // Generate Seatbelt profile
  const profile = generateSandboxProfile(config);  // H44

  // Tag command for violation monitoring
  const tag = generateCommandTag(command);  // F44

  return `sandbox-exec -p '${profile}' -D TAG='${tag}' -- ${command}`;
}

// ============================================
// Linux: qm0 - linuxSandboxWrapper
// Location: chunks.16.mjs:3401-3484
// ============================================

function linuxSandboxWrapper(command, config) {
  const args = [
    '--unshare-all',
    '--die-with-parent',
    '--proc', '/proc',
    '--dev', '/dev',
    ...buildFilesystemRestrictions(config),  // J44
    ...buildNetworkRestrictions(config),      // Y44
  ];

  // Add seccomp filter if available
  const seccompFilter = getSeccompFilter();
  if (seccompFilter) {
    args.push('--seccomp', seccompFilter);
  }

  return `bwrap ${args.join(' ')} -- ${command}`;
}
```

#### Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Sandboxed App                                                   │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │            HTTP/SOCKS Proxy (built-in)                      ││
│  │                        │                                     ││
│  │         ┌──────────────┼──────────────┐                     ││
│  │         ▼              ▼              ▼                     ││
│  │  ┌──────────┐   ┌──────────┐   ┌───────────────┐           ││
│  │  │Check deny│   │Check allow│  │Permission     │           ││
│  │  │list      │   │list       │  │callback       │           ││
│  │  └────┬─────┘   └────┬──────┘  └───────┬───────┘           ││
│  │       │              │                  │                    ││
│  │       └──────────────┴──────────────────┘                   ││
│  │                        │                                     ││
│  │               Forward or Deny                                ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### Environment Variables in Sandbox

```javascript
const SANDBOX_ENV = {
  TMPDIR: '/tmp/claude',
  SANDBOX_RUNTIME: '1',
  HTTP_PROXY: proxyAddress,
  HTTPS_PROXY: proxyAddress,
  ALL_PROXY: socksAddress,
  NO_PROXY: 'localhost,127.0.0.1,::1,*.local',
  GIT_SSH_COMMAND: `ssh -o ProxyCommand="nc -X 5 -x ${socksAddress} %h %p"`
};
```

---

## Cross-Module Integration

### Data Flow: Tool Execution Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│  1. LLM Response with tool_use block                             │
│     From: Module 03 (LLM Core)                                   │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Tool Definition Lookup                                       │
│     From: Module 05 (Tool Registry)                              │
│     Function: wY1 → find tool by name                           │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Permission Check                                             │
│     From: Infrastructure (symbol_index_infra.md)                │
│     Function: Wb3 → check allow/deny rules                      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. PreToolUse Hook                                              │
│     From: Module 11 (Hooks)                                      │
│     Function: OV0 → execute matching hooks                       │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Sandbox Wrapping (if Bash)                                   │
│     From: Module 18 (Sandbox)                                    │
│     Function: WIA → check if sandboxed, a64 → wrap              │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Tool Execution                                               │
│     From: Module 05 (Tools)                                      │
│     Function: OY1 → execute single tool                         │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. PostToolUse Hook                                             │
│     From: Module 11 (Hooks)                                      │
│     Function: RV0 → execute matching hooks                       │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. Result Processing & State Update                             │
│     From: Module 15 (State Management)                           │
│     Function: setAppState → update state                         │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  9. Token Count Check → Compact if needed                        │
│     From: Module 07 (Compact)                                    │
│     Function: sI2 → auto-compact dispatcher                     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow: User Input to Response

```
User Input → Slash Command Check → Skill Check → LLM API → Tool Loop → Response
    │              │                    │            │          │
    ▼              ▼                    ▼            ▼          ▼
Module 09      Module 10           Module 03    Module 05   Module 04
(_P2)          (ln)                ($E9)        (EV0)       (JH5)
```

### Data Flow: Compact Trigger

```
Token Check (ZK) → Threshold (x1A) → Micro-Compact (Si)
                                            │
                                   ┌────────┴─────────┐
                                   │ Success          │ Fail
                                   ▼                  ▼
                              Return              Full Compact (j91)
                                                      │
                                           ┌──────────┴──────────┐
                                           ▼                     ▼
                                   PreCompact Hooks         Summarization
                                   (FQ0)                    ($E9)
                                           │                     │
                                           └──────────┬──────────┘
                                                      ▼
                                           Context Restoration
                                           (bD5, fD5, XQ0)
                                                      │
                                                      ▼
                                           SessionStart Hooks
                                           (WQ0)
```

---

## Key Algorithms Deep Dive

### Algorithm 1: Concurrency Safety Classification

```javascript
// Decision tree for tool concurrency

function isConcurrencySafe(tool, input) {
  // Always safe: Read-only operations
  if (tool.name in ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch']) {
    return true;
  }

  // Never safe: Write operations
  if (tool.name in ['Write', 'Edit', 'NotebookEdit']) {
    return false;
  }

  // Conditional: Bash depends on command
  if (tool.name === 'Bash') {
    const command = input.command;
    const isReadOnly = analyzeCommandReadOnly(command);
    return isReadOnly;
  }

  // Default: Treat as unsafe
  return false;
}
```

### Algorithm 2: Token Budget Allocation

```javascript
// Token budget for context restoration after compact

const TOTAL_FILE_TOKEN_BUDGET = 50000;
const MAX_FILES_TO_RESTORE = 5;
const MAX_TOKENS_PER_FILE = 10000;

function allocateRestoration(files) {
  let remaining = TOTAL_FILE_TOKEN_BUDGET;
  const restored = [];

  for (const file of files.slice(0, MAX_FILES_TO_RESTORE)) {
    const fileTokens = Math.min(
      approximateTokenCount(file.content),
      MAX_TOKENS_PER_FILE,
      remaining
    );

    if (fileTokens > 0) {
      restored.push(truncateToTokens(file, fileTokens));
      remaining -= fileTokens;
    }

    if (remaining <= 0) break;
  }

  return restored;
}
```

### Algorithm 3: Hook Pattern Matching Priority

```javascript
// Pattern matching with specificity

function findBestMatch(toolName, rules) {
  // Priority order:
  // 1. Exact match: "Write"
  // 2. Pipe list containing: "Write|Edit|Bash"
  // 3. Regex match: "/^Write.*/"
  // 4. Wildcard: "*"

  for (const rule of rules) {
    if (rule.pattern === toolName) return rule;  // Exact
  }

  for (const rule of rules) {
    if (rule.pattern.includes('|') && rule.pattern.split('|').includes(toolName)) {
      return rule;  // Pipe list
    }
  }

  for (const rule of rules) {
    if (rule.pattern.startsWith('/') && new RegExp(rule.pattern.slice(1, -1)).test(toolName)) {
      return rule;  // Regex
    }
  }

  for (const rule of rules) {
    if (rule.pattern === '*') return rule;  // Wildcard
  }

  return null;
}
```

---

## Summary

Claude Code v2.0.59 implements a sophisticated multi-layered architecture:

| Layer | Modules | Primary Technologies |
|-------|---------|---------------------|
| **Entry** | 01, 02 | Commander.js, React/Ink.js |
| **Core** | 03, 04, 05 | Claude API, Streaming, Tool Registry |
| **Support** | 06, 08-12 | MCP Protocol, Hooks, Skills, Plan Mode |
| **State** | 07, 13, 15 | React Context, Compaction, Todos |
| **Infrastructure** | 14, 17, 18 | Tree-sitter, OpenTelemetry, Sandbox |

**Key Design Patterns:**
- Fast-path routing for performance
- Two-tier strategies (micro/full compact, quick/precise token counting)
- Reference counting for shared resources
- Async generators for streaming operations
- Context modifiers for tool execution side effects
- Multi-destination telemetry with sampling

**Symbol Index References:**
- Core modules: [symbol_index_core.md](./symbol_index_core.md)
- Infrastructure: [symbol_index_infra.md](./symbol_index_infra.md)

---

> **Back to Part 1:** [architecture_core.md](./architecture_core.md) for Entry/UI, LLM Core, Tool System modules.
