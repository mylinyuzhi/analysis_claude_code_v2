# Cross-Module Integration (Claude Code 2.1.7)

> Documents how major systems interact with each other
> Critical for understanding full system behavior

---

## Quick Navigation

- [Agent Loop Integration](#agent-loop-integration)
- [Background Agents + Compaction](#background-agents--compaction)
- [Shell Parser + Bash Tool](#shell-parser--bash-tool)
- [LSP + Session Management](#lsp--session-management)
- [Chrome + Session Persistence](#chrome--session-persistence)
- [Hooks + Tool Execution](#hooks--tool-execution)

---

## Agent Loop Integration

### Central Control Flow

The Agent Loop (`v19` in chunks.135.mjs) is the central coordinator for all other systems.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Agent Loop (v19)                                │
│                           chunks.135.mjs:195                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Tool System    │      │  Compaction     │      │  Background     │
│  (Permission    │      │  (Token Mgmt)   │      │  Agents         │
│   + Execution)  │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Shell Parser   │      │  Memory Cache   │      │  Task Files     │
│  (Security)     │      │  (Session)      │      │  (Output)       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Integration Points

| Component | Trigger | Integration Method |
|-----------|---------|-------------------|
| Tool System | Tool call from LLM | `canUseTool()` callback |
| Compaction | Token threshold | `autoCompactDispatcher()` check each turn |
| Background Agents | `run_in_background` flag | `backgroundSignalMap` promise |
| Hooks | Tool completion | `executeHooks()` after tool result |
| System Prompts | Each API call | `generateAllAttachments()` |

---

## Background Agents + Compaction

### Interaction Challenge

Background agents run independently but may affect the main conversation's token count through their output.

```javascript
// ============================================
// Background Agent + Compaction Interaction
// ============================================

backgroundAgentCompactionFlow = {
  scenario: "Background agent completes while main conversation is near token limit",

  flow: [
    {
      step: 1,
      event: "Background agent completes task",
      data: "Output written to ~/.claude/tasks/{taskId}/output.txt"
    },
    {
      step: 2,
      event: "User calls TaskOutput tool to read results",
      data: "Output is ~50k tokens of code analysis"
    },
    {
      step: 3,
      event: "Output added to main conversation",
      check: "Token count exceeds threshold"
    },
    {
      step: 4,
      event: "Compaction triggered",
      action: "autoCompactDispatcher() evaluates conversation"
    },
    {
      step: 5,
      event: "Background task output compacted",
      result: "Summary: 'Analysis complete, 47 issues found in 12 files'"
    }
  ],

  keyInsight: "Background agent output is treated as tool results and can be micro-compacted"
};
```

### Output Truncation Strategy

```javascript
// TaskOutput tool truncates BEFORE adding to conversation
truncationStrategy = {
  threshold: 30000,  // characters
  behavior: "Keep END of output (most recent is most relevant)",
  preview: "First 500 chars + last 500 chars shown in preview"
};
```

---

## Shell Parser + Bash Tool

### Security Flow

```
User Command → Bash Tool → Shell Parser → Permission System → Execution
                   │              │               │
                   │              │               └── Allow/Ask/Deny
                   │              │
                   │              └── tokenizeCommand() → shellOperatorChecker()
                   │                                            │
                   │                                            ├── Tier 1: Allow checkers
                   │                                            └── Tier 2: Ask checkers
                   │
                   └── pipePermissionChecker() for multi-segment commands
```

### Integration Details

```javascript
// ============================================
// Bash Tool Integration with Shell Parser
// Location: chunks.121.mjs + chunks.123.mjs + chunks.147.mjs
// ============================================

bashToolIntegration = {
  beforeExecution: {
    step1: "Parse command with shellCommandParser (cK1)",
    step2: "Check for dangerous operators with shellOperatorChecker (Mf)",
    step3: "If piped command, run pipePermissionChecker (cm2)",
    step4: "Check against permission rules"
  },

  duringExecution: {
    monitoring: "Capture stdout/stderr",
    timeout: "Default 120s, max 600s"
  },

  afterExecution: {
    step1: "Extract CWD reset warnings with extractCwdReset (Fb5)",
    step2: "Clean stderr output",
    step3: "Apply output truncation if needed"
  }
};
```

---

## LSP + Session Management

### Workspace Binding Issue

**Critical limitation:** LSP servers are bound to the workspace at startup.

```javascript
// ============================================
// LSP Session Persistence Challenge
// ============================================

lspSessionIssue = {
  problem: "LSP servers bind to workspace on startup, no multi-workspace support",

  scenarios: {
    sessionTeleport: {
      behavior: "Teleporting to different repo breaks LSP",
      workaround: "System must detect new workspace and reinitialize LSP",
      implemented: false  // NOT YET IMPLEMENTED
    },

    sessionResume: {
      behavior: "Resuming session in same workspace works",
      workaround: "LSP state is re-established on server start",
      implemented: true
    },

    worktreeSwitch: {
      behavior: "Switching git worktrees breaks LSP",
      workaround: "User must /shutdown and restart session",
      implemented: false  // User manual action required
    }
  },

  recommendation: "Check if CWD matches LSP workspace before using LSP tool"
};
```

### LSP Restart on Crash

```javascript
// NOT YET IMPLEMENTED
lspRestartOnCrash = {
  configField: "restartOnCrash",
  currentStatus: "NOT IMPLEMENTED (commented in source)",
  impact: "If LSP server crashes, user must manually restart session"
};
```

---

## Chrome + Session Persistence

### Tab Group Persistence

```javascript
// ============================================
// Chrome Tab Persistence Across Sessions
// ============================================

chromeSessionPersistence = {
  currentBehavior: {
    inSession: "Tab group maintained throughout session",
    sessionEnd: "Tab group survives session end (lives in Chrome)",
    sessionResume: "CRITICAL: Old tab IDs invalid, must call tabs_context_mcp"
  },

  persistedData: {
    inChromeExtension: [
      "Site-level permissions",
      "Tab group configuration",
      "Network request buffer (until navigation)"
    ],
    inClaudeCode: [
      "Session approval cache (cleared on session end)",
      "claudeInChromeDefaultEnabled setting"
    ]
  },

  sessionResumeFlow: [
    "1. Check if Chrome extension is installed",
    "2. Re-establish socket connection to native host",
    "3. Call tabs_context_mcp to get fresh tab IDs",
    "4. User must re-approve domains via update_plan"
  ]
};
```

### GIF Recording State

```javascript
gifRecordingPersistence = {
  storage: "Chrome extension in-memory (per tab group)",
  persistence: "Lost on browser restart or tab close",
  recommendation: "Export GIF before ending automation session"
};
```

---

## Hooks + Tool Execution

### Hook Timing

```
Tool Call Received → [PreExecution Hooks] → Tool Execution → [PostExecution Hooks]
                            │                     │                   │
                            │                     │                   └── Notification hooks
                            │                     │
                            │                     └── Actual tool logic
                            │
                            └── Can modify input, reject tool call

                    ┌───────────────────────────────────────────┐
                    │              Hook Chain                    │
                    │                                           │
                    │  PreToolUse → Tool → PostToolUse          │
                    │       │                    │               │
                    │       ├── bash             ├── bash        │
                    │       ├── write            ├── write       │
                    │       └── edit             └── edit        │
                    │                                           │
                    │  SubagentStart ─────────── SubagentStop   │
                    └───────────────────────────────────────────┘
```

### Hook + Compaction Interaction

```javascript
// ============================================
// Hooks and Compaction Timing
// ============================================

hookCompactionInteraction = {
  preCompactHook: {
    when: "Before any compaction operation",
    purpose: "Allow hooks to save critical state",
    timeout: "5 seconds (hook execution timeout)"
  },

  hookOutputInCompaction: {
    behavior: "Hook stdout/stderr is NOT added to conversation",
    reason: "Hooks run in subprocess, output logged but not tracked in tokens"
  },

  hookTriggeredCompaction: {
    scenario: "Hook adds large content to conversation",
    handling: "Normal compaction rules apply after hook completes"
  }
};
```

---

## Task System + Agent Loop

### Subagent Context Forking

```javascript
// ============================================
// Subagent Context Fork Strategy
// ============================================

subagentContextFork = {
  whatIsForked: [
    "Full message history up to task tool call",
    "System prompt (with subagent-specific modifications)",
    "Tool availability (restricted based on agent type)",
    "CWD and environment variables"
  ],

  whatIsNotForked: [
    "Token count (subagent has fresh context)",
    "Session memory cache (subagent builds own)",
    "Compaction state (subagent manages independently)",
    "Hook state (hooks re-execute in subagent)"
  ],

  returnBehavior: {
    sync: "Result immediately added to parent context",
    async: "Result written to file, retrieved via TaskOutput"
  }
};
```

### Resume Capability

```javascript
subagentResume = {
  howItWorks: {
    step1: "Subagent completes with agentId returned",
    step2: "User/parent calls Task tool with resume: agentId",
    step3: "System loads subagent's full conversation history",
    step4: "Subagent continues with preserved context"
  },

  limitations: {
    sessionBound: "Can only resume in same session",
    notPersisted: "Agent state lost on session end"
  }
};
```

---

## Compact + State Management

### What Survives Compaction

```javascript
// ============================================
// Compaction State Preservation
// ============================================

compactionPreservation = {
  alwaysPreserved: [
    "System prompt",
    "User preferences",
    "Active todo list",
    "Current plan (if in plan mode)"
  ],

  prioritizedRestoration: [
    { priority: 1, item: "Recent user messages", budget: "~10k tokens" },
    { priority: 2, item: "Recent tool results", budget: "~10k tokens" },
    { priority: 3, item: "File contents (from session memory)", budget: "~50k tokens" },
    { priority: 4, item: "Skill context", budget: "~5k tokens" }
  ],

  neverRestored: [
    "Old tool results (compressed to summary)",
    "Intermediate reasoning steps",
    "Large file contents exceeding budget"
  ]
};
```

### Session Memory Integration

```javascript
sessionMemoryCompactFlow = {
  triggerCondition: "Token count reaches 60-70% of context limit",

  microCompaction: {
    target: "Tool results older than 3 turns",
    saving: "At least 20k tokens",
    behavior: "Replace with [Compacted: summary]"
  },

  fullCompaction: {
    target: "Entire conversation",
    method: "LLM summarization",
    preserves: "Recent messages, active tasks, key decisions"
  },

  sessionMemoryUsage: {
    afterCompaction: "Restore file contents from session memory cache",
    budget: "50k tokens max for file restoration",
    priority: "Most recently accessed files first"
  }
};
```

---

## Key Integration Patterns

### 1. Event-Driven Notifications

Multiple systems use event subscription for loose coupling:

```javascript
eventDrivenPatterns = {
  toolCompletion: "Hooks subscribe to tool completion events",
  backgroundTaskComplete: "UI subscribes to task completion notifications",
  compactionComplete: "Session memory updates on compaction",
  lspServerCrash: "Manager subscribes to server exit events"
};
```

### 2. Promise-Based Synchronization

Async operations use Promise patterns for coordination:

```javascript
promisePatterns = {
  backgroundSignalMap: "Ctrl+B uses Promise.race to interrupt execution",
  lspRequestRetry: "Exponential backoff wrapped in Promise chain",
  chromeSocketReconnect: "Reconnection delay wrapped in setTimeout Promise"
};
```

### 3. State Machine Transitions

Complex features use explicit state machines:

```javascript
stateMachineExamples = {
  lspServer: "not_initialized → initializing → ready → shutting_down → stopped",
  chromeSocket: "disconnected → connecting → connected → reconnecting",
  backgroundTask: "pending → running → completed/failed",
  gifRecording: "idle → recording → stopped → exporting"
};
```

---

## See Also

- [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution symbols
- [symbol_index_core_features.md](./symbol_index_core_features.md) - Feature symbols
- [file_index.md](./file_index.md) - File content index
