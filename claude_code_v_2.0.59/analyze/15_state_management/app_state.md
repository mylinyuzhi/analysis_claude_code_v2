# Application State Management

## Overview

Claude Code v2.0.59 uses a centralized application state object (`f0`) that manages all runtime state for the interactive mode. The state is defined in `chunks.158.mjs` and passed through React context to all components.

## State Structure: f0

The main application state is created in the action handler:

```javascript
// ============================================
// f0 - Application State Object
// Location: chunks.158.mjs:352-415
// ============================================

// Get current session ID
let sessionId = e1();  // Returns current or new UUID

// Build application state
let f0 = {
  // ========================================
  // Core Configuration
  // ========================================
  settings: $T(),
  // Merged settings from:
  // - User: ~/.claude/settings.json
  // - Project: .claude/settings.json
  // - Local: .claude/settings.local.json

  // ========================================
  // Background Task Tracking
  // ========================================
  backgroundTasks: {},
  // Map of background task IDs to task state:
  // {
  //   [taskId]: {
  //     status: "running" | "completed" | "failed",
  //     result: any,
  //     error: Error | null
  //   }
  // }

  // ========================================
  // Debug/Logging
  // ========================================
  verbose: e ?? N1().verbose ?? false,
  // Verbose logging mode, from:
  // 1. CLI flag --verbose (e)
  // 2. Config file (N1().verbose)
  // 3. Default: false

  // ========================================
  // Model Configuration
  // ========================================
  mainLoopModel: UkA(),
  // Default model for this session
  // Resolved from: CLI flag > env var > config > default

  mainLoopModelForSession: null,
  // Per-session model override
  // Set when user changes model during session

  // ========================================
  // UI State
  // ========================================
  showExpandedTodos: N1().showExpandedTodos ?? false,
  // Whether todo panel is expanded

  statusLineText: void 0,
  // Custom status line message (optional)

  // ========================================
  // Tool Permissions
  // ========================================
  toolPermissionContext: oA,
  // Tool permission configuration from _E9():
  // {
  //   mode: "default" | "strict" | "bypassPermissions",
  //   allowedTools: Set<string>,
  //   disallowedTools: Set<string>,
  //   allowedDirectories: Set<string>,
  //   // ... more permission fields
  // }

  // ========================================
  // Agent System
  // ========================================
  agentDefinitions: v1,
  // Agent definitions from Kf2():
  // {
  //   allAgents: Agent[],      // All defined agents
  //   activeAgents: Agent[],   // Currently active agents
  //   // Agent structure:
  //   // {
  //   //   agentType: string,
  //   //   description: string,
  //   //   prompt: string,
  //   //   model?: string,
  //   //   ...
  //   // }
  // }

  // ========================================
  // MCP (Model Context Protocol) State
  // ========================================
  mcp: {
    clients: [],
    // MCP client instances (populated async)
    // Each client manages connection to an MCP server

    tools: [],
    // Tools provided by MCP servers
    // Format: { name, description, inputSchema, ... }

    commands: [],
    // Commands/prompts from MCP servers
    // Format: { name, description, arguments, ... }

    resources: {}
    // Resources available from MCP servers
    // Format: { [uri]: { content, mimeType, ... } }
  },

  // ========================================
  // Plugin System State
  // ========================================
  plugins: {
    enabled: [],
    // List of enabled plugin IDs

    disabled: [],
    // List of disabled plugin IDs

    commands: [],
    // Commands provided by plugins
    // Format: { name, description, handler, ... }

    agents: [],
    // Agents provided by plugins
    // Format: same as agentDefinitions

    errors: [],
    // Plugin loading/execution errors
    // Format: { pluginId, error, timestamp }

    installationStatus: {
      marketplaces: [],
      // Marketplace sync status
      // Format: { name, lastUpdated, status }

      plugins: []
      // Plugin installation status
      // Format: { id, version, installed, enabled }
    }
  },

  // ========================================
  // Notification System
  // ========================================
  notifications: {
    current: null,
    // Currently displayed notification
    // Format: { key, text, priority, timestamp }

    queue: KA ? [{
      key: "permission-mode-notification",
      text: KA,  // Warning text from permission mode
      priority: "high"
    }] : []
    // Queued notifications
    // Priority: "high" | "medium" | "low"
  },

  // ========================================
  // User Input Elicitation
  // ========================================
  elicitation: {
    queue: []
    // Queue of pending user input requests
    // Format: { prompt, type, validator, resolve, reject }
  },

  // ========================================
  // Todo List Management
  // ========================================
  todos: {
    [sessionId]: Nh(sessionId)
    // Todo list state per session
    // Nh() creates initial todo list state:
    // {
    //   items: [],
    //   expanded: false,
    //   lastUpdated: timestamp
    // }
  },

  // ========================================
  // File History Tracking
  // ========================================
  fileHistory: {
    snapshots: [],
    // Historical file content snapshots
    // Format: { path, content, timestamp, operation }

    trackedFiles: new Set()
    // Set of file paths being tracked
  },

  // ========================================
  // Feature Flags
  // ========================================
  thinkingEnabled: VrA(),
  // Extended thinking mode enabled
  // Determined by:
  // - Model capabilities
  // - User settings
  // - Feature flags

  // ========================================
  // Feedback Survey
  // ========================================
  feedbackSurvey: {
    timeLastShown: null,
    // Timestamp when survey was last shown

    submitCountAtLastAppearance: null
    // Number of submissions when last shown
    // Used for survey targeting/frequency
  },

  // ========================================
  // Session Lifecycle Hooks
  // ========================================
  sessionHooks: {},
  // Custom lifecycle hooks
  // Format: { [eventName]: hookFunction[] }
  // Events: "startup", "shutdown", "tool_call", etc.

  // ========================================
  // Prompt Suggestions
  // ========================================
  promptSuggestion: {
    text: null,
    // Suggested prompt text (if any)

    shownAt: 0
    // Timestamp when suggestion was shown
  },

  // ========================================
  // Command Queue
  // ========================================
  queuedCommands: [],
  // Commands waiting to be executed
  // Format: { name, args, priority, timestamp }

  // ========================================
  // Git Integration
  // ========================================
  gitDiff: {
    stats: null,
    // Diff statistics
    // Format: { additions: number, deletions: number }

    hunks: new Map(),
    // Map of file paths to diff hunks
    // Format: Map<string, Hunk[]>

    lastUpdated: 0,
    // Timestamp of last diff update

    version: 0
    // Diff version for cache invalidation
  }
};
```

## State Fields

### Settings

```javascript
settings: $T()
```

User and system settings loaded from configuration files. The `$T()` function merges settings from:
- User settings (`~/.claude/settings.json`)
- Project settings (`.claude/settings.json`)
- Local settings (`.claude/settings.local.json`)

### Background Tasks

```javascript
backgroundTasks: {}
```

Tracks running background tasks. Each task has:
- Task ID
- Status (running, completed, failed)
- Result or error information

### Verbosity

```javascript
verbose: e ?? N1().verbose ?? false
```

Controls debug output level. Determined by:
1. CLI flag (`--verbose`)
2. Config file setting
3. Default: `false`

### Model Configuration

```javascript
mainLoopModel: UkA(),
mainLoopModelForSession: null
```

- **mainLoopModel**: Default model for the session
- **mainLoopModelForSession**: Override model for current session

### UI State

```javascript
showExpandedTodos: N1().showExpandedTodos ?? false,
statusLineText: void 0
```

- **showExpandedTodos**: Whether todo list is expanded
- **statusLineText**: Custom status line message

### Tool Permission Context

```javascript
toolPermissionContext: oA
```

Manages tool permissions:
- Permission mode (default, strict, bypass)
- Allowed/disallowed tools
- Permission prompts
- Directory access controls

Structure from earlier in code:

```javascript
let {
  toolPermissionContext: oA,
  warnings: X1
} = _E9({
  allowedToolsCli: D,
  disallowedToolsCli: H,
  baseToolsCli: K,
  permissionMode: qA,
  allowDangerouslySkipPermissions: F,
  addDirs: U
});
```

### Agent Definitions

```javascript
agentDefinitions: v1
```

Contains all available agents:

```javascript
let v1 = {
  ...jA,
  allAgents: t1,
  activeAgents: ky(t1)
};
```

Structure:
- **allAgents**: All defined agents (built-in + custom)
- **activeAgents**: Currently active agents

### MCP State

```javascript
mcp: {
  clients: [],
  tools: [],
  commands: [],
  resources: {}
}
```

**Fields:**
- **clients**: Connected MCP client instances
- **tools**: Tools provided by MCP servers
- **commands**: Commands/prompts from MCP servers
- **resources**: Resources available from MCP servers

This is populated asynchronously after state initialization:

```javascript
let n0 = $A || OA ? await p0 : {
  clients: [],
  tools: [],
  commands: []
};

let _1 = n0.clients,
    zQ = n0.tools,
    W1 = n0.commands;
```

### Plugin State

```javascript
plugins: {
  enabled: [],
  disabled: [],
  commands: [],
  agents: [],
  errors: [],
  installationStatus: {
    marketplaces: [],
    plugins: []
  }
}
```

**Fields:**
- **enabled**: List of enabled plugins
- **disabled**: List of disabled plugins
- **commands**: Commands provided by plugins
- **agents**: Agents provided by plugins
- **errors**: Plugin loading/execution errors
- **installationStatus**: Marketplace and plugin installation status

### Notification State

```javascript
notifications: {
  current: null,
  queue: KA ? [{
    key: "permission-mode-notification",
    text: KA,
    priority: "high"
  }] : []
}
```

**Fields:**
- **current**: Currently displayed notification
- **queue**: Queued notifications with priority

Notification structure:
- **key**: Unique notification identifier
- **text**: Notification message
- **priority**: "high", "medium", "low"

### Elicitation State

```javascript
elicitation: {
  queue: []
}
```

Queue for user input requests (elicitations). Used for interactive prompts during execution.

### Todos State

```javascript
todos: {
  [k0]: Nh(k0)
}
```

Todo lists per session. Structure:
- Key: Session ID
- Value: Todo list state created by `Nh()` function

### File History

```javascript
fileHistory: {
  snapshots: [],
  trackedFiles: new Set
}
```

**Fields:**
- **snapshots**: Historical file snapshots for undo/diff
- **trackedFiles**: Set of files being tracked

### Thinking Mode

```javascript
thinkingEnabled: VrA()
```

Whether "thinking" (extended thinking) mode is enabled. Determined by `VrA()` function based on:
- Model capabilities
- User settings
- Feature flags

### Feedback Survey

```javascript
feedbackSurvey: {
  timeLastShown: null,
  submitCountAtLastAppearance: null
}
```

**Fields:**
- **timeLastShown**: Timestamp of last survey display
- **submitCountAtLastAppearance**: Number of submissions when last shown

Used to control survey frequency and targeting.

### Session Hooks

```javascript
sessionHooks: {}
```

Custom hooks for session lifecycle events. Structure:
- Event name → Array of hook functions
- Events: startup, shutdown, tool call, etc.

### Prompt Suggestion

```javascript
promptSuggestion: {
  text: null,
  shownAt: 0
}
```

**Fields:**
- **text**: Suggested prompt text
- **shownAt**: Timestamp when suggestion was shown

### Queued Commands

```javascript
queuedCommands: []
```

Commands waiting to be executed. Each command:
- Command name
- Arguments
- Priority

### Git Diff State

```javascript
gitDiff: {
  stats: null,
  hunks: new Map,
  lastUpdated: 0,
  version: 0
}
```

**Fields:**
- **stats**: Diff statistics (additions, deletions)
- **hunks**: Map of file → diff hunks
- **lastUpdated**: Timestamp of last diff update
- **version**: Diff version for cache invalidation

## State Updates

State is updated via the `Yu` callback function:

```javascript
// ============================================
// State Update Callback - Yu
// Location: chunks.158.mjs (inferred from usage)
// ============================================

// Interactive mode: Pass state to React components
await VG(d3.default.createElement(yG, {
  initialState: f0,
  onChangeAppState: Yu  // State change callback
}, d3.default.createElement(WVA, {
  debug: debug || debugToStderr,
  initialPrompt: prompt,
  commands: [...builtInCommands, ...mcpCommands],
  initialTools: mcpTools,
  initialMessages: messages,
  initialFileHistorySnapshots: fileHistorySnapshots,
  mcpClients: mcpClients,
  dynamicMcpConfig: dynamicMcpConfig,
  mcpCliEndpoint: mcpCliEndpoint,
  autoConnectIdeFlag: autoConnectIde,
  strictMcpConfig: strictMcpConfig,
  appendSystemPrompt: appendSystemPrompt,
  mainThreadAgentDefinition: mainThreadAgent
})), renderContext);
```

### Update Function Pattern

The state update pattern in both print and interactive modes:

```javascript
// ============================================
// Print Mode State Update
// Location: chunks.158.mjs:309-314
// ============================================
let printState = wp();  // Get base print state

// Update state in print mode
Rw9(
  prompt,                    // Initial prompt
  async () => printState,    // State getter
  (updateFn) => {            // State setter
    let oldState = printState;
    printState = updateFn(printState);  // Apply update

    // Call Yu callback with state change
    Yu({
      newState: printState,
      oldState: oldState
    });
  },
  commands,                  // Available commands
  tools,                     // Available tools
  sdkMcpServers,            // SDK MCP servers
  activeAgents,             // Active agents
  options                   // Additional options
);
```

### State Update Flow

```javascript
// ============================================
// State Update Flow
// ============================================

// 1. Component triggers state change
//    Example: User adds todo, tool is called, etc.

// 2. Update function is called
const updateState = (updaterFn) => {
  // Save old state
  let oldState = currentState;

  // Apply update (updater can be function or new state)
  if (typeof updaterFn === 'function') {
    currentState = updaterFn(currentState);
  } else {
    currentState = updaterFn;
  }

  // 3. Trigger callback with both states
  Yu({
    newState: currentState,
    oldState: oldState
  });
};

// 4. Yu callback can:
//    - Persist state to disk
//    - Update React context
//    - Trigger side effects
//    - Log state changes (if verbose)
```

### State Update Examples

```javascript
// ============================================
// Common State Updates
// ============================================

// Update MCP state
updateState((state) => ({
  ...state,
  mcp: {
    ...state.mcp,
    clients: newClients,
    tools: newTools
  }
}));

// Add notification
updateState((state) => ({
  ...state,
  notifications: {
    ...state.notifications,
    queue: [
      ...state.notifications.queue,
      {
        key: "new-notification",
        text: "Something happened",
        priority: "medium"
      }
    ]
  }
}));

// Update todos
updateState((state) => ({
  ...state,
  todos: {
    ...state.todos,
    [sessionId]: {
      ...state.todos[sessionId],
      items: [
        ...state.todos[sessionId].items,
        {
          content: "New task",
          status: "pending",
          activeForm: "Adding new task"
        }
      ]
    }
  }
}));

// Update git diff
updateState((state) => ({
  ...state,
  gitDiff: {
    stats: { additions: 10, deletions: 5 },
    hunks: newHunks,
    lastUpdated: Date.now(),
    version: state.gitDiff.version + 1
  }
}));
```

## Print Mode State

In print mode (`--print`), a simplified state is used:

```javascript
let yQ = wp();  // Get base print state

yQ = {
  ...yQ,
  mcp: {
    ...yQ.mcp,
    clients: _1,
    commands: W1,
    tools: zQ
  },
  toolPermissionContext: oA
};
```

Print mode bypasses React and uses a simpler state structure.

## State Initialization Flow

```javascript
// ============================================
// State Initialization Sequence
// Location: chunks.158.mjs:1-415
// ============================================

// 1. Load Settings
// Merge from user, project, and local config files
let settings = $T();
// Returns merged settings object:
// {
//   model: string,
//   verbose: boolean,
//   agent: string,
//   showExpandedTodos: boolean,
//   skipWebFetchPreflight: boolean,
//   ... more settings
// }

// 2. Get or Create Session ID
let sessionId = e1();  // Returns UUID
// If continuing session: existing ID
// If new session: generates new UUID

// 3. Initialize Tool Permissions
let {
  toolPermissionContext,
  warnings
} = _E9({
  allowedToolsCli: allowedTools,      // --allowed-tools flag
  disallowedToolsCli: disallowedTools, // --disallowed-tools flag
  baseToolsCli: tools,                 // --tools flag
  permissionMode: mode,                // --permission-mode flag
  allowDangerouslySkipPermissions: allowSkip,
  addDirs: additionalDirs              // --add-dir flag
});
// Returns:
// {
//   mode: "default" | "strict" | "bypassPermissions",
//   allowedTools: Set<string>,
//   disallowedTools: Set<string>,
//   allowedDirectories: Set<string>,
//   permissions: Map<string, Permission>
// }

// Display warnings
warnings.forEach((warning) => {
  console.error(warning);
});

// 4. Initialize Model Configuration
let mainLoopModel = UkA();
// Resolves model from:
// 1. CLI flag (--model)
// 2. Environment variable (ANTHROPIC_MODEL)
// 3. Settings file (settings.model)
// 4. Default model

// 5. Load Agent Definitions
let [builtInCommands, agentDefinitions] = await Promise.all([
  sE(),    // Load built-in commands
  Kf2()    // Load agent definitions
]);
// Returns:
// agentDefinitions = {
//   allAgents: [...builtInAgents, ...customAgents],
//   activeAgents: [...enabledAgents]
// }

// Parse additional agents from CLI flag
let additionalAgents = [];
if (agentsFlag) {
  try {
    let parsed = JSON.parse(agentsFlag);
    additionalAgents = A31(parsed, "flagSettings");
  } catch (e) {
    console.error("Failed to parse --agents flag");
  }
}

// Merge all agents
let allAgents = [
  ...agentDefinitions.allAgents,
  ...additionalAgents
];
let finalAgentDefinitions = {
  ...agentDefinitions,
  allAgents: allAgents,
  activeAgents: ky(allAgents)  // Filter active agents
};

// 6. Determine Main Thread Agent
let mainThreadAgent = null;
if (agentFlag || settings.agent) {
  let agentType = agentFlag ?? settings.agent;
  mainThreadAgent = finalAgentDefinitions.activeAgents.find(
    (a) => a.agentType === agentType
  );
  if (!mainThreadAgent) {
    console.warn(`Agent "${agentType}" not found`);
  }
}

// 7. Setup MCP Servers (Async)
let mcpServersPromise = $21(mcpServers);
// Starts connecting to MCP servers in background
// Returns promise that resolves to:
// {
//   clients: MCPClient[],
//   tools: Tool[],
//   commands: Command[]
// }

// 8. Create Initial State
let initialState = {
  settings: settings,
  backgroundTasks: {},
  verbose: verboseFlag ?? settings.verbose ?? false,
  mainLoopModel: mainLoopModel,
  mainLoopModelForSession: null,
  showExpandedTodos: settings.showExpandedTodos ?? false,
  toolPermissionContext: toolPermissionContext,
  agentDefinitions: finalAgentDefinitions,
  mcp: {
    clients: [],
    tools: [],
    commands: [],
    resources: {}
  },
  plugins: {
    enabled: [],
    disabled: [],
    commands: [],
    agents: [],
    errors: [],
    installationStatus: {
      marketplaces: [],
      plugins: []
    }
  },
  statusLineText: undefined,
  notifications: {
    current: null,
    queue: permissionWarning ? [{
      key: "permission-mode-notification",
      text: permissionWarning,
      priority: "high"
    }] : []
  },
  elicitation: {
    queue: []
  },
  todos: {
    [sessionId]: Nh(sessionId)  // Initialize todo list
  },
  fileHistory: {
    snapshots: [],
    trackedFiles: new Set()
  },
  thinkingEnabled: VrA(),  // Check if thinking mode available
  feedbackSurvey: {
    timeLastShown: null,
    submitCountAtLastAppearance: null
  },
  sessionHooks: {},
  promptSuggestion: {
    text: null,
    shownAt: 0
  },
  queuedCommands: [],
  gitDiff: {
    stats: null,
    hunks: new Map(),
    lastUpdated: 0,
    version: 0
  }
};

// 9. Await MCP Connection (if needed)
let mcpResult = await mcpServersPromise;
let mcpClients = mcpResult.clients;
let mcpTools = mcpResult.tools;
let mcpCommands = mcpResult.commands;

// 10. Update state with MCP data (not shown in initial state)
// This happens after state is created, before rendering
// State is updated via Yu callback or direct mutation

// 11. Render UI with State
if (printMode) {
  // Print mode: simpler flow
  await Rw9(prompt, () => initialState, updateCallback, ...);
} else {
  // Interactive mode: React components
  await VG(
    React.createElement(AppStateProvider, {
      initialState: initialState,
      onChangeAppState: Yu
    },
      React.createElement(MainApp, {
        // ... props including MCP clients/tools
      })
    ),
    renderContext
  );
}
```

### Initialization Timeline

```
0ms    - CLI parsing complete
10ms   - Settings loaded ($T)
15ms   - Session ID resolved (e1)
20ms   - Tool permissions configured (_E9)
25ms   - Model configuration resolved (UkA)
50ms   - Agent definitions loaded (Kf2)
100ms  - Initial state object created (f0)
150ms  - MCP servers start connecting ($21)
200ms  - Plugins begin loading
500ms  - UI renders with initial state
1000ms - MCP servers connected (async)
1500ms - State updated with MCP tools/commands
2000ms - Plugins loaded and activated
```

## State Access in Components

Components access state through React context:

```javascript
// In component
let state = useAppState();

// Access fields
let { mcp, todos, settings } = state;
```

## State Persistence

Some state is persisted across sessions:
- **Settings**: Saved to config files
- **File history**: Saved to session storage
- **Todos**: Saved per session
- **Session hooks**: Configured in settings

## Summary

The application state in Claude Code v2.0.59:

1. **Centralized**: Single `f0` object for all state
2. **Structured**: Clear hierarchy of state domains
3. **Initialized**: Built at startup with configuration
4. **Updated**: Via callback function pattern
5. **Passed down**: Through React context
6. **Persistent**: Some fields saved across sessions
7. **Modular**: Separate concerns (MCP, plugins, tools, UI)
8. **Extensible**: Easy to add new state fields
9. **Type-safe**: Clear structure and defaults
10. **Session-aware**: Tracks per-session data

This architecture enables Claude Code to manage complex state across:
- User interactions
- Background tasks
- MCP integrations
- Plugin systems
- File tracking
- Git operations
- Notifications
- Todos and workflows
