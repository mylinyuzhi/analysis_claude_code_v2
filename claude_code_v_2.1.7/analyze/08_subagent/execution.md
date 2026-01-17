# Subagent Execution (Claude Code 2.1.7)

> **Related:** [architecture.md](./architecture.md) | [tool_restrictions.md](./tool_restrictions.md) | [Background Agents](../26_background_agents/background_agents.md)

---

## Overview

This document details the execution flow for subagents, including:
- Task tool call processing
- Sync vs async execution modes
- Fork context feature
- Model resolution
- Resume capability
- Background execution integration

---

## Task Tool Call Flow

When the main agent calls the Task tool, the following sequence occurs:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Task Tool Call                               │
├─────────────────────────────────────────────────────────────────────┤
│  1. Input Validation                                                 │
│     └─ Validate subagent_type, prompt, model, etc.                  │
│                                                                      │
│  2. Agent Lookup                                                     │
│     └─ Find agent by subagent_type from activeAgents                │
│     └─ Check permission rules                                        │
│                                                                      │
│  3. Model Resolution                                                 │
│     └─ YA1() resolves final model                                   │
│                                                                      │
│  4. Transcript Loading (if resume)                                   │
│     └─ bD1(iz(agentId)) loads previous messages                     │
│                                                                      │
│  5. Context Preparation                                              │
│     ├─ If forkContext: I52() prepares fork messages                 │
│     └─ Else: H0({content: prompt}) creates simple entry             │
│                                                                      │
│  6. Execution Path Selection                                         │
│     ├─ run_in_background: true → L32() → Async path                 │
│     └─ run_in_background: false → O32() + $f() → Sync path          │
│                                                                      │
│  7. Agent Loop Execution                                             │
│     └─ $f() runs the agent loop                                     │
│                                                                      │
│  8. Result Processing                                                │
│     └─ Return completed or async_launched status                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sync vs Async Execution

### Sync Execution (Default)

When `run_in_background` is `false` or not specified:

```javascript
// ============================================
// Sync execution path - Wait for completion
// Location: chunks.113.mjs:209-356
// ============================================

// ORIGINAL (for source lookup):
let b = Z ? iz(Z) : LS(),
  S = {
    agentId: b,
    parentSessionId: gP2(),
    agentType: "subagent"
  };
return XA1(S, async () => {
  let u = [],
    f = Date.now();
  // ... execute agent loop via $f()
  // ... wait for completion
  let WA = uz0(u, b, j);
  return {
    data: {
      status: "completed",
      prompt: A,
      ...WA
    }
  }
})

// READABLE (for understanding):
let agentId = resumeId ? sanitizeId(resumeId) : generateSessionId();
let agentContext = {
  agentId: agentId,
  parentSessionId: getParentSessionId(),
  agentType: "subagent"
};
return executeInAgentContext(agentContext, async () => {
  let messages = [];
  let startTime = Date.now();
  // Execute agent loop
  // Wait for completion
  let result = formatAgentResult(messages, agentId, metadata);
  return {
    data: {
      status: "completed",
      prompt: prompt,
      ...result
    }
  };
});

// Mapping: XA1→executeInAgentContext, LS→generateSessionId, gP2→getParentSessionId, uz0→formatAgentResult, iz→sanitizeId
```

**Key characteristics:**
- Main agent blocks until subagent completes
- Full result returned in tool response
- Progress updates sent via callback during execution

### Async Execution (Background)

When `run_in_background` is `true`:

```javascript
// ============================================
// Async execution path - Return immediately
// Location: chunks.113.mjs:161-208
// ============================================

// ORIGINAL (for source lookup):
if (Y === !0 && !nkA) {
  let b = Z || LS(),
    S = L32({
      agentId: b,
      description: B,
      prompt: A,
      selectedAgent: z,
      setAppState: X.setAppState
    }),
    u = {
      agentId: b,
      parentSessionId: gP2(),
      agentType: "subagent"
    };
  return XA1(u, async () => {
    // Agent runs in background...
    // Progress tracked via RI0()
    // Completion notified via C4A()
  }), {
    data: {
      isAsync: !0,
      status: "async_launched",
      agentId: S.agentId,
      description: B,
      prompt: A,
      outputFile: aY(S.agentId)
    }
  }
}

// READABLE (for understanding):
if (runInBackground && !DISABLE_BACKGROUND_TASKS) {
  let agentId = resumeId || generateSessionId();
  let task = createFullyBackgroundedAgent({
    agentId: agentId,
    description: description,
    prompt: prompt,
    selectedAgent: agent,
    setAppState: context.setAppState
  });

  let agentContext = {
    agentId: agentId,
    parentSessionId: getParentSessionId(),
    agentType: "subagent"
  };

  // Agent runs in background (non-blocking)
  executeInAgentContext(agentContext, async () => {
    // Execute agent loop
    // Track progress via updateTaskProgress()
    // Notify completion via createTaskNotification()
  });

  // Return immediately
  return {
    data: {
      isAsync: true,
      status: "async_launched",
      agentId: task.agentId,
      description: description,
      prompt: prompt,
      outputFile: formatOutputPath(task.agentId)
    }
  };
}

// Mapping: L32→createFullyBackgroundedAgent, aY→formatOutputPath, nkA→DISABLE_BACKGROUND_TASKS
```

**Key characteristics:**
- Returns immediately with `async_launched` status
- Output file path provided for progress checking
- Agent runs in background independently
- TaskOutput tool used to retrieve results later

---

## Background Agent Creation

### Fully Backgrounded Agent (L32)

Created when `run_in_background: true` from the start:

```javascript
// ============================================
// createFullyBackgroundedAgent - For run_in_background: true
// Location: chunks.91.mjs:1288-1315
// ============================================

// ORIGINAL (for source lookup):
function L32({
  agentId: A,
  description: Q,
  prompt: B,
  selectedAgent: G,
  setAppState: Z
}) {
  OKA(A, yb(iz(A)));  // Register output file
  let Y = c9(),        // Create AbortController
    J = {
      ...KO(A, "local_agent", Q),
      type: "local_agent",
      status: "running",
      agentId: A,
      prompt: B,
      selectedAgent: G,
      agentType: G.agentType ?? "general-purpose",
      abortController: Y,
      retrieved: !1,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: !0  // Immediately backgrounded
    },
    X = C6(async () => {
      $4A(A, Z)  // Cleanup handler
    });
  return J.unregisterCleanup = X, FO(J, Z), J
}

// READABLE (for understanding):
function createFullyBackgroundedAgent({
  agentId,
  description,
  prompt,
  selectedAgent,
  setAppState
}) {
  registerOutputFile(agentId, getOutputPath(sanitizeId(agentId)));

  let abortController = createAbortController();
  let task = {
    ...createBaseTask(agentId, "local_agent", description),
    type: "local_agent",
    status: "running",
    agentId: agentId,
    prompt: prompt,
    selectedAgent: selectedAgent,
    agentType: selectedAgent.agentType ?? "general-purpose",
    abortController: abortController,
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: true  // Key difference: immediately backgrounded
  };

  let cleanupHandler = registerCleanup(async () => {
    killBackgroundTask(agentId, setAppState);
  });

  task.unregisterCleanup = cleanupHandler;
  addTaskToState(task, setAppState);
  return task;
}

// Mapping: L32→createFullyBackgroundedAgent, OKA→registerOutputFile, yb→getOutputPath, iz→sanitizeId, c9→createAbortController, KO→createBaseTask, C6→registerCleanup, $4A→killBackgroundTask, FO→addTaskToState
```

### Backgroundable Agent (O32)

Created for sync execution but can be backgrounded via Ctrl+B:

```javascript
// ============================================
// createBackgroundableAgent - For sync with Ctrl+B option
// Location: chunks.91.mjs:1317-1351
// ============================================

// ORIGINAL (for source lookup):
function O32({
  agentId: A,
  description: Q,
  prompt: B,
  selectedAgent: G,
  setAppState: Z
}) {
  OKA(A, yb(iz(A)));
  let Y = c9(),
    J = C6(async () => {
      $4A(A, Z)
    }),
    X = {
      ...KO(A, "local_agent", Q),
      type: "local_agent",
      status: "running",
      agentId: A,
      prompt: B,
      selectedAgent: G,
      agentType: G.agentType ?? "general-purpose",
      abortController: Y,
      unregisterCleanup: J,
      retrieved: !1,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: !1  // Initially NOT backgrounded
    },
    I, D = new Promise((W) => {
      I = W
    });
  return yZ1.set(A, I), FO(X, Z), {
    taskId: A,
    backgroundSignal: D  // Promise that resolves when Ctrl+B pressed
  }
}

// READABLE (for understanding):
function createBackgroundableAgent({
  agentId,
  description,
  prompt,
  selectedAgent,
  setAppState
}) {
  registerOutputFile(agentId, getOutputPath(sanitizeId(agentId)));

  let abortController = createAbortController();
  let cleanupHandler = registerCleanup(async () => {
    killBackgroundTask(agentId, setAppState);
  });

  let task = {
    ...createBaseTask(agentId, "local_agent", description),
    type: "local_agent",
    status: "running",
    agentId: agentId,
    prompt: prompt,
    selectedAgent: selectedAgent,
    agentType: selectedAgent.agentType ?? "general-purpose",
    abortController: abortController,
    unregisterCleanup: cleanupHandler,
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: false  // Key: NOT backgrounded initially
  };

  let resolveBackground;
  let backgroundSignal = new Promise((resolve) => {
    resolveBackground = resolve;
  });

  backgroundSignalMap.set(agentId, resolveBackground);
  addTaskToState(task, setAppState);

  return {
    taskId: agentId,
    backgroundSignal: backgroundSignal
  };
}

// Mapping: O32→createBackgroundableAgent, yZ1→backgroundSignalMap
```

**Key insight:** `O32` creates a Promise (`backgroundSignal`) that resolves when Ctrl+B is pressed. The execution loop uses `Promise.race` to detect this.

### Ctrl+B Transition Flow (Promise.race)

```javascript
// ============================================
// Promise.race pattern for interruptible execution
// Location: chunks.113.mjs:262-312
// ============================================

// ORIGINAL (for source lookup):
let TA = p.next(),
  bA = n ? await Promise.race([
    TA.then((HA) => ({ type: "message", result: HA })),
    n.then(() => ({ type: "background" }))
  ]) : await TA.then((HA) => ({ type: "message", result: HA }));

if (bA.type === "background" && AA) {
  let ZA = (await X.getAppState()).tasks[AA];
  if (Sr(ZA) && ZA.isBackgrounded) {
    let zA = AA;
    return XA1(S, async () => {
      // ... continue execution in background ...
    }), {
      data: {
        isAsync: !0,
        status: "async_launched",
        agentId: zA,
        description: B,
        prompt: A,
        outputFile: aY(zA)
      }
    }
  }
}

// READABLE (for understanding):
// Each iteration races between:
// 1. The next message from the agent
// 2. The background signal (Ctrl+B pressed)

let nextMessage = agentIterator.next();
let raceResult = backgroundSignal
  ? await Promise.race([
      nextMessage.then((result) => ({ type: "message", result: result })),
      backgroundSignal.then(() => ({ type: "background" }))
    ])
  : await nextMessage.then((result) => ({ type: "message", result: result }));

if (raceResult.type === "background" && taskId) {
  // User pressed Ctrl+B
  let task = (await context.getAppState()).tasks[taskId];

  if (isLocalAgentTask(task) && task.isBackgrounded) {
    // Task was marked as backgrounded by the UI
    let agentIdToBackground = taskId;

    // Continue execution in background and return immediately
    executeInAgentContext(agentContext, async () => {
      // ... agent continues running in background ...
      // Progress tracked via updateTaskProgress()
      // Completion notified via createTaskNotification()
    });

    return {
      data: {
        isAsync: true,
        status: "async_launched",
        agentId: agentIdToBackground,
        description: description,
        prompt: prompt,
        outputFile: formatOutputPath(agentIdToBackground)
      }
    };
  }
}
```

**Step-by-step Ctrl+B flow:**
1. User presses Ctrl+B while agent is running
2. UI sets `task.isBackgrounded = true` via `triggerBackgroundTransition()`
3. UI resolves the `backgroundSignal` promise stored in `backgroundSignalMap`
4. The `Promise.race` detects "background" won
5. Current task state is checked to confirm `isBackgrounded: true`
6. Agent execution continues in a detached async context
7. Tool result returns immediately with `async_launched` status
8. User can continue working while agent runs in background

### Background Signal Resolution

```javascript
// ============================================
// triggerBackgroundTransition - Called when Ctrl+B pressed
// Location: chunks.91.mjs:1353-1373
// ============================================

// ORIGINAL (for source lookup):
function M32(A, Q, B) {
  let Z = Q().tasks[A];
  if (!Sr(Z) || Z.isBackgrounded) return !1;
  B((J) => {
    let X = J.tasks[A];
    if (!Sr(X)) return J;
    return {
      ...J,
      tasks: { ...J.tasks, [A]: { ...X, isBackgrounded: !0 } }
    }
  });
  let Y = yZ1.get(A);
  if (Y) Y(), yZ1.delete(A);  // Resolve the backgroundSignal promise
  return !0
}

// READABLE (for understanding):
function triggerBackgroundTransition(taskId, getAppState, setAppState) {
  let task = getAppState().tasks[taskId];

  // Only transition running, non-backgrounded local_agent tasks
  if (!isLocalAgentTask(task) || task.isBackgrounded) return false;

  // Mark task as backgrounded
  setAppState((state) => {
    let task = state.tasks[taskId];
    if (!isLocalAgentTask(task)) return state;
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: { ...task, isBackgrounded: true }
      }
    };
  });

  // Resolve the background signal promise
  let resolveBackground = backgroundSignalMap.get(taskId);
  if (resolveBackground) {
    resolveBackground();  // This triggers Promise.race to return
    backgroundSignalMap.delete(taskId);
  }

  return true;
}

// Mapping: M32→triggerBackgroundTransition
```

---

## Complete Ctrl+B Implementation Details

The Ctrl+B background transition involves **four layers**:

### Layer 1: Key Binding System

```javascript
// ============================================
// registerKeyAction - Register key binding handler
// Location: chunks.68.mjs:1376-1403
// ============================================

// ORIGINAL (for source lookup):
function H2(A, Q, B = {}) {
  let {
    context: G = "Global",
    isActive: Z = !0
  } = B, Y = GjA(), J = jB0.useCallback((X, I, D) => {
    if (!Y) return;
    let W = Y.resolve(X, I, [G, "Global"]);
    switch (W.type) {
      case "match":
        if (Y.setPendingChord(null), W.action === A) Q(), D.stopImmediatePropagation();
        break;
      case "chord_started":
        Y.setPendingChord(W.pending), D.stopImmediatePropagation();
        break;
      // ...
    }
  }, [A, G, Q, Y]);
  J0(J, { isActive: Z })
}

// READABLE (for understanding):
function registerKeyAction(actionName, callback, options = {}) {
  let { context = "Global", isActive = true } = options;
  let keyBindingContext = useKeyBindingContext();

  let keyHandler = useCallback((input, key, event) => {
    if (!keyBindingContext) return;

    let resolution = keyBindingContext.resolve(input, key, [context, "Global"]);
    switch (resolution.type) {
      case "match":
        keyBindingContext.setPendingChord(null);
        if (resolution.action === actionName) {
          callback();
          event.stopImmediatePropagation();
        }
        break;
      case "chord_started":
        // For multi-key sequences like "ctrl+b ctrl+b"
        keyBindingContext.setPendingChord(resolution.pending);
        event.stopImmediatePropagation();
        break;
      // ...
    }
  }, [actionName, context, callback, keyBindingContext]);

  useInput(keyHandler, { isActive: isActive });
}

// Mapping: H2→registerKeyAction, GjA→useKeyBindingContext, J0→useInput
```

### Layer 2: UI Component (Background Shortcut Hint)

```javascript
// ============================================
// BackgroundShortcutHint - UI component showing Ctrl+B hint
// Location: chunks.112.mjs:3291-3313
// ============================================

// ORIGINAL (for source lookup):
function yD1({
  onBackground: A
} = {}) {
  let [Q, B] = a0(), G = M7.useRef(Q);
  G.current = Q;
  let Z = M7.useCallback(() => {
    vD1(() => G.current, B), A?.()
  }, [B, A]);
  H2("task:background", Z, { context: "Task" });
  let Y = J3("task:background", "Task", "ctrl+b"),
    J = l0.terminal === "tmux" && Y === "ctrl+b" ? "ctrl+b ctrl+b (twice)" : Y;
  if (a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;
  // ... render hint UI
}

// READABLE (for understanding):
function BackgroundShortcutHint({ onBackground } = {}) {
  let [appState, setAppState] = useAppState();
  let stateRef = useRef(appState);
  stateRef.current = appState;

  let handleBackground = useCallback(() => {
    backgroundAllTasks(() => stateRef.current, setAppState);
    onBackground?.();
  }, [setAppState, onBackground]);

  // Register "task:background" action with Ctrl+B
  registerKeyAction("task:background", handleBackground, { context: "Task" });

  // Get display text for the shortcut
  let shortcutKey = getKeyDisplayText("task:background", "Task", "ctrl+b");

  // Special handling for tmux (ctrl+b is tmux prefix)
  let displayShortcut = terminalType.terminal === "tmux" && shortcutKey === "ctrl+b"
    ? "ctrl+b ctrl+b (twice)"
    : shortcutKey;

  if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return null;

  // Render hint: "Ctrl+B to run in background"
  return <ShortcutHint shortcut={displayShortcut} action="run in background" />;
}

// Mapping: yD1→BackgroundShortcutHint, a0→useAppState, vD1→backgroundAllTasks, H2→registerKeyAction, J3→getKeyDisplayText, l0→terminalType, a1→parseBoolean
```

### Layer 3: Background All Tasks Function

```javascript
// ============================================
// backgroundAllTasks - Backgrounds all running foreground tasks
// Location: chunks.121.mjs:708-720
// ============================================

// ORIGINAL (for source lookup):
function vD1(A, Q) {
  let B = A(),
    G = Object.keys(B.tasks).filter((Y) => {
      let J = B.tasks[Y];
      return It(J) && !J.isBackgrounded && J.shellCommand
    });
  for (let Y of G) Li5(Y, A, Q);  // Background shell tasks
  let Z = Object.keys(B.tasks).filter((Y) => {
    let J = B.tasks[Y];
    return Sr(J) && !J.isBackgrounded
  });
  for (let Y of Z) M32(Y, A, Q)  // Background agent tasks
}

// READABLE (for understanding):
function backgroundAllTasks(getAppState, setAppState) {
  let state = getAppState();

  // Find all non-backgrounded shell tasks
  let shellTaskIds = Object.keys(state.tasks).filter((taskId) => {
    let task = state.tasks[taskId];
    return isShellTask(task) && !task.isBackgrounded && task.shellCommand;
  });

  // Background each shell task
  for (let taskId of shellTaskIds) {
    backgroundShellTask(taskId, getAppState, setAppState);
  }

  // Find all non-backgrounded agent tasks
  let agentTaskIds = Object.keys(state.tasks).filter((taskId) => {
    let task = state.tasks[taskId];
    return isLocalAgentTask(task) && !task.isBackgrounded;
  });

  // Background each agent task
  for (let taskId of agentTaskIds) {
    triggerBackgroundTransition(taskId, getAppState, setAppState);
  }
}

// Mapping: vD1→backgroundAllTasks, It→isShellTask, Sr→isLocalAgentTask, Li5→backgroundShellTask, M32→triggerBackgroundTransition
```

### Layer 4: Agent Loop Detection (Promise.race)

Already documented above - the agent execution loop uses `Promise.race` to detect when backgroundSignal resolves.

### Complete Ctrl+B Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Presses Ctrl+B                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Layer 1] Key Binding System                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ useInput() detects key press                                       │  │
│  │     ↓                                                              │  │
│  │ keyBindingContext.resolve("b", {ctrl: true}, ["Task", "Global"])  │  │
│  │     ↓                                                              │  │
│  │ Returns: { type: "match", action: "task:background" }             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                           ↓                                              │
│  [Layer 2] UI Component Callback                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ BackgroundShortcutHint.handleBackground() called                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                           ↓                                              │
│  [Layer 3] Background All Tasks                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ backgroundAllTasks(getAppState, setAppState)                       │  │
│  │     ↓                                                              │  │
│  │ For each running agent task:                                       │  │
│  │   triggerBackgroundTransition(taskId, getAppState, setAppState)   │  │
│  │     ↓                                                              │  │
│  │   1. Set task.isBackgrounded = true                               │  │
│  │   2. Resolve backgroundSignal promise                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                           ↓                                              │
│  [Layer 4] Agent Loop (in chunks.113.mjs)                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Promise.race([nextMessage, backgroundSignal]) → "background" wins │  │
│  │     ↓                                                              │  │
│  │ Check task.isBackgrounded === true                                │  │
│  │     ↓                                                              │
│  │ Detach execution to async context                                 │  │
│  │     ↓                                                              │  │
│  │ Return { status: "async_launched", outputFile: "..." }            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Special Cases

| Scenario | Behavior |
|----------|----------|
| **tmux terminal** | Requires `ctrl+b ctrl+b` (double press) since `ctrl+b` is tmux prefix |
| **`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=true`** | Ctrl+B hint hidden, backgrounding disabled |
| **Task already backgrounded** | `triggerBackgroundTransition` returns `false`, no-op |
| **Non-agent task (shell)** | Uses `Li5` (backgroundShellTask) instead of `M32` |

### Key Symbols Summary

| Symbol | Readable Name | Location | Purpose |
|--------|--------------|----------|---------|
| `H2` | registerKeyAction | chunks.68.mjs:1376 | Register keyboard shortcut handler |
| `J3` | getKeyDisplayText | chunks.67.mjs:2650 | Get display text for key binding |
| `yD1` | BackgroundShortcutHint | chunks.112.mjs:3291 | UI component for Ctrl+B hint |
| `vD1` | backgroundAllTasks | chunks.121.mjs:708 | Background all running foreground tasks |
| `M32` | triggerBackgroundTransition | chunks.91.mjs:1353 | Set task.isBackgrounded and resolve signal |
| `yZ1` | backgroundSignalMap | chunks.91.mjs:1483 | Map of taskId → resolve function |

---

## Deep Dive: How Sync Tasks Switch to Background

### The Key Insight

**A sync task's parameters are fixed at launch, but execution is NOT a single blocking call.**

Agent execution is an **iterative loop** where each iteration:
1. Makes an API call
2. Processes the response
3. Executes any tool calls
4. Repeats

Between each iteration, there's an opportunity to detect Ctrl+B.

### The Iterative Execution Loop

```javascript
// ============================================
// Agent execution loop with background detection
// Location: chunks.113.mjs:254-320
// ============================================

// ORIGINAL (for source lookup):
while (!0) {
  let MA = Date.now() - f;
  if (!nkA && !y && MA >= Qf5 && X.setToolJSX) y = !0, X.setToolJSX({
    jsx: dz0.createElement(yD1, null),  // Show "Ctrl+B to background" hint
    shouldHidePromptInput: !1,
    shouldContinueAnimation: !0,
    showSpinner: !0
  });
  let TA = p.next(),  // Get next message from agent iterator
    bA = n ? await Promise.race([
      TA.then((HA) => ({ type: "message", result: HA })),
      n.then(() => ({ type: "background" }))
    ]) : await TA.then((HA) => ({ type: "message", result: HA }));

  if (bA.type === "background" && AA) {
    let ZA = (await X.getAppState()).tasks[AA];
    if (Sr(ZA) && ZA.isBackgrounded) {
      // ... switch to background execution ...
      return { data: { status: "async_launched", ... } }
    }
  }
  if (bA.type !== "message") continue;
  // ... process message normally ...
}

// READABLE (for understanding):
while (true) {
  let elapsedTime = Date.now() - startTime;

  // After threshold, show "Ctrl+B to background" hint
  if (!DISABLE_BACKGROUND && !hintShown && elapsedTime >= BACKGROUND_HINT_DELAY) {
    hintShown = true;
    context.setToolJSX({
      jsx: <BackgroundShortcutHint />,
      shouldHidePromptInput: false,
      shouldContinueAnimation: true,
      showSpinner: true
    });
  }

  let nextMessage = agentIterator.next();

  // KEY: Promise.race between normal execution and background signal
  let raceResult = backgroundSignal
    ? await Promise.race([
        nextMessage.then((result) => ({ type: "message", result })),
        backgroundSignal.then(() => ({ type: "background" }))
      ])
    : await nextMessage.then((result) => ({ type: "message", result }));

  // If background signal won the race
  if (raceResult.type === "background" && taskId) {
    let task = (await context.getAppState()).tasks[taskId];
    if (isLocalAgentTask(task) && task.isBackgrounded) {
      // Switch to background: continue in detached async context
      executeInAgentContext(agentContext, async () => {
        // Continue processing remaining messages...
        for await (let message of runAgentLoop({...})) {
          // Track progress, update state...
        }
        markTaskCompleted(...);
        createTaskNotification(...);
      });

      // Return immediately to unblock main thread
      return { data: { status: "async_launched", outputFile: "..." } };
    }
  }

  if (raceResult.type !== "message") continue;

  // Normal message processing...
  let { result } = raceResult;
  if (result.done) break;
  // Process tools, update UI, etc.
}

// Mapping: nkA→DISABLE_BACKGROUND, y→hintShown, Qf5→BACKGROUND_HINT_DELAY,
// p→agentIterator, n→backgroundSignal, AA→taskId, Sr→isLocalAgentTask
```

### The backgroundSignal Promise Pattern

```javascript
// ============================================
// How backgroundSignal enables mid-execution switching
// ============================================

// Step 1: When sync task starts, create a "hanging" Promise
function createBackgroundableAgent({agentId, ...}) {
  let resolveBackground;  // Will hold the resolve function
  let backgroundSignal = new Promise((resolve) => {
    resolveBackground = resolve;  // Capture resolver, don't call it yet
  });

  // Store resolver in a Map for later access
  backgroundSignalMap.set(agentId, resolveBackground);

  return {
    taskId: agentId,
    backgroundSignal: backgroundSignal  // Promise that "hangs" until Ctrl+B
  };
}

// Step 2: User presses Ctrl+B
function triggerBackgroundTransition(taskId, getAppState, setAppState) {
  // Mark task as backgrounded
  setAppState((state) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: { ...state.tasks[taskId], isBackgrounded: true }
    }
  }));

  // Retrieve and call the stored resolver
  let resolveBackground = backgroundSignalMap.get(taskId);
  if (resolveBackground) {
    resolveBackground();  // NOW the Promise resolves!
    backgroundSignalMap.delete(taskId);
  }
}

// Step 3: Promise.race detects the resolution
// In the next iteration of the while loop, backgroundSignal wins the race
```

### Timeline Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Timeline: Sync Task with Mid-Execution Background Switch                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ T=0    Task starts (run_in_background: false)                               │
│        │                                                                     │
│        ├─ backgroundSignal Promise created (NOT resolved)                   │
│        ├─ resolver stored in backgroundSignalMap                            │
│        │                                                                     │
│        ▼                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Iteration 1                                                            │  │
│ │   Promise.race([API_call, backgroundSignal])                          │  │
│ │   → API_call wins (backgroundSignal still pending)                    │  │
│ │   → Process response, execute Read tool                               │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│        │                                                                     │
│        ▼                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Iteration 2                                                            │  │
│ │   Promise.race([API_call, backgroundSignal])                          │  │
│ │   → API_call wins (backgroundSignal still pending)                    │  │
│ │   → Process response, execute Edit tool                               │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│        │                                                                     │
│        │  ◄──── USER PRESSES Ctrl+B ────────────────────────────────────    │
│        │         │                                                           │
│        │         ├─ triggerBackgroundTransition() called                    │
│        │         ├─ task.isBackgrounded = true                              │
│        │         └─ backgroundSignalMap.get(taskId)() ← RESOLVES PROMISE   │
│        │                                                                     │
│        ▼                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ Iteration 3                                                            │  │
│ │   Promise.race([API_call, backgroundSignal])                          │  │
│ │   → backgroundSignal wins! (it's now resolved)                        │  │
│ │   → Check task.isBackgrounded === true ✓                              │  │
│ │   → Detach to async context, return async_launched                    │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│        │                                                                     │
│        ├───────────────────────┬────────────────────────────────────────    │
│        │                       │                                             │
│        ▼                       ▼                                             │
│   Main thread returns     Background async context                          │
│   User can continue       continues iterations 4, 5, 6...                   │
│   interacting             until task completes                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Design Works

| Design Decision | Benefit |
|-----------------|---------|
| **Iterative loop, not blocking call** | Each API round-trip is a checkpoint for background detection |
| **Promise.race with external resolver** | Zero overhead when not backgrounding; instant detection when Ctrl+B pressed |
| **Resolver stored in Map** | Decouples UI layer (Ctrl+B handler) from execution layer (agent loop) |
| **Double-check isBackgrounded** | Prevents race conditions; ensures user intent is confirmed |
| **Detached async context** | Background execution doesn't block; can outlive the original call stack |

### Key Insight: "Sync" Doesn't Mean "Uninterruptible"

```
Traditional blocking call:          Claude Code's approach:

┌─────────────┐                     ┌─────────────┐
│ start()     │                     │ start()     │
│             │                     │   │         │
│  blocking   │  ← Can't interrupt  │   ▼         │
│  execution  │                     │ ┌─────────┐ │
│             │                     │ │ iter 1  │◄├─ Can interrupt here
│             │                     │ └─────────┘ │
│             │                     │   │         │
│             │                     │   ▼         │
│             │                     │ ┌─────────┐ │
│             │                     │ │ iter 2  │◄├─ Or here
│             │                     │ └─────────┘ │
│             │                     │   │         │
│  end()      │                     │   ▼         │
└─────────────┘                     │  ...        │
                                    └─────────────┘
```

The "sync" parameter only determines **initial behavior** (wait vs return immediately), not **interruptibility**. The iterative nature of LLM agent execution naturally provides interruption points.

---

## Bash Tool Background Support

Bash Tool also supports background execution, with a different mechanism from Agent tasks.

### Two Ways to Background Bash Commands

| Method | Trigger | Mechanism |
|--------|---------|-----------|
| **Explicit** | `run_in_background: true` parameter | Immediate background, returns `backgroundTaskId` |
| **Interactive** | User presses Ctrl+B during execution | `shellCommand.background()` method |

### Explicit Background (`run_in_background: true`)

```javascript
// ============================================
// Bash Tool explicit background execution
// Location: chunks.124.mjs:1298-1308
// ============================================

// ORIGINAL (for source lookup):
if (D === !0 && !ZV1) {
  let x = await O();  // O() creates background task via es.spawn()
  return l("tengu_bash_command_explicitly_backgrounded", {
    command_type: Ld2(Y)
  }), {
    stdout: "",
    stderr: "",
    code: 0,
    interrupted: !1,
    backgroundTaskId: x
  }
}

// READABLE (for understanding):
if (runInBackground === true && !DISABLE_BACKGROUND_TASKS) {
  let taskId = await spawnBackgroundTask();
  logTelemetry("tengu_bash_command_explicitly_backgrounded", {
    command_type: getCommandType(command)
  });
  return {
    stdout: "",
    stderr: "",
    code: 0,
    interrupted: false,
    backgroundTaskId: taskId  // User can check progress via TaskOutput
  };
}

// Mapping: D→runInBackground, ZV1→DISABLE_BACKGROUND_TASKS, O→spawnBackgroundTask
```

### Interactive Background (Ctrl+B)

Bash Tool uses a **polling loop** with background detection:

```javascript
// ============================================
// Bash Tool polling loop with Ctrl+B support
// Location: chunks.124.mjs:1313-1359
// ============================================

// ORIGINAL (for source lookup):
let M = Date.now(),
  _ = M + Nd2,
  j = void 0;
while (!0) {
  let x = Date.now(),
    b = Math.max(0, _ - x),
    S = await Promise.race([$, new Promise((AA) => setTimeout(() => AA(null), b))]);
  if (S !== null) {
    if (j) Km2(j, B);
    return S
  }
  if (H) return { ..., backgroundTaskId: H };
  if (j) {
    if (z.status === "backgrounded") return {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: j,
      backgroundedByUser: !0
    }
  }
  // After threshold, show Ctrl+B hint and create task entry
  let u = Date.now() - M,
    f = Math.floor(u / 1000);
  if (!ZV1 && H === void 0 && f >= Nd2 / 1000 && G) {
    if (!j) j = Dm2({ command: Y, description: J || Y, shellCommand: z }, B);
    G({ jsx: oq0.createElement(yD1, null), ... })
  }
  yield { type: "progress", ... };
}

// READABLE (for understanding):
let startTime = Date.now();
let nextCheckTime = startTime + BACKGROUND_HINT_DELAY;
let taskId = undefined;

while (true) {
  let now = Date.now();
  let waitTime = Math.max(0, nextCheckTime - now);

  // Race between command completion and timeout
  let result = await Promise.race([
    commandResult,
    new Promise((resolve) => setTimeout(() => resolve(null), waitTime))
  ]);

  // Command completed
  if (result !== null) {
    if (taskId) removeTask(taskId, setAppState);  // Cleanup task entry
    return result;
  }

  // Already backgrounded by timeout handler
  if (backgroundTaskId) {
    return { ..., backgroundTaskId: backgroundTaskId };
  }

  // Check if user pressed Ctrl+B
  if (taskId) {
    if (shellCommand.status === "backgrounded") {
      return {
        stdout: "",
        stderr: "",
        code: 0,
        interrupted: false,
        backgroundTaskId: taskId,
        backgroundedByUser: true  // Indicates Ctrl+B was pressed
      };
    }
  }

  // After threshold, show Ctrl+B hint
  let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  if (!DISABLE_BACKGROUND && backgroundTaskId === undefined && elapsedSeconds >= THRESHOLD) {
    if (!taskId) {
      taskId = createLocalBashTask({ command, description, shellCommand }, setAppState);
    }
    setToolJSX({ jsx: <BackgroundShortcutHint />, ... });
  }

  yield { type: "progress", ... };
}

// Mapping: $→commandResult, Nd2→BACKGROUND_HINT_DELAY, j→taskId, H→backgroundTaskId,
// z→shellCommand, Dm2→createLocalBashTask, Km2→removeTask
```

### shellCommand.background() Method

The low-level shell process wrapper supports dynamic backgrounding:

```javascript
// ============================================
// Shell command wrapper with background support
// Location: chunks.85.mjs:1967-2011
// ============================================

// ORIGINAL (for source lookup):
let Y = "running";  // Status: running | backgrounded | killed | completed
let J;  // backgroundTaskId

let F = (z) => {  // background() method
  if (Y === "running") {
    J = z;  // Store task ID
    Y = "backgrounded";
    K();  // Clear timeout handler
    return {
      stdoutStream: X.asStream(),
      stderrStream: I.asStream()
    };
  }
  return null;
};

let E = {
  get status() { return Y },
  background: F,
  kill: () => D(),
  result: H
};

// READABLE (for understanding):
let status = "running";  // running | backgrounded | killed | completed
let backgroundTaskId;

let background = (taskId) => {
  if (status === "running") {
    backgroundTaskId = taskId;
    status = "backgrounded";
    clearTimeoutHandler();
    return {
      stdoutStream: stdoutBuffer.asStream(),  // Continue streaming output
      stderrStream: stderrBuffer.asStream()
    };
  }
  return null;  // Can't background if not running
};

let shellCommand = {
  get status() { return status },
  background: background,
  kill: () => killProcess(),
  result: resultPromise
};

// Mapping: Y→status, J→backgroundTaskId, F→background, X→stdoutBuffer, I→stderrBuffer
```

### backgroundShellTask (Li5)

When Ctrl+B is pressed, `Li5` backgrounds all shell tasks:

```javascript
// ============================================
// backgroundShellTask - Background a running shell task
// Location: chunks.121.mjs:637-698
// ============================================

// ORIGINAL (for source lookup):
function Li5(A, Q, B) {
  let Z = Q().tasks[A];
  if (!It(Z) || Z.isBackgrounded || !Z.shellCommand) return !1;
  let {
    shellCommand: Y,
    description: J
  } = Z, X = Y.background(A);  // Call shellCommand.background()
  if (!X) return !1;
  return B((I) => {
    let D = I.tasks[A];
    if (!It(D) || D.isBackgrounded) return I;
    return {
      ...I,
      tasks: { ...I.tasks, [A]: { ...D, isBackgrounded: !0 } }
    }
  }), X.stdoutStream.on("data", (I) => {
    let D = I.toString();
    g9A(A, D);  // Write to output file
    // ... update line counts
  }), X.stderrStream.on("data", (I) => {
    // ... similar handling for stderr
  }), Y.result.then((I) => {
    // ... handle completion
  }), !0
}

// READABLE (for understanding):
function backgroundShellTask(taskId, getAppState, setAppState) {
  let task = getAppState().tasks[taskId];

  // Validate: must be local_bash, not already backgrounded, has shellCommand
  if (!isShellTask(task) || task.isBackgrounded || !task.shellCommand) {
    return false;
  }

  let { shellCommand, description } = task;

  // Call the shell's background() method
  let streams = shellCommand.background(taskId);
  if (!streams) return false;  // Failed to background

  // Update task state
  setAppState((state) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: { ...state.tasks[taskId], isBackgrounded: true }
    }
  }));

  // Setup stream handlers to capture ongoing output
  streams.stdoutStream.on("data", (data) => {
    let text = data.toString();
    appendToOutputFile(taskId, text);  // g9A
    // Update line counts...
  });

  streams.stderrStream.on("data", (data) => {
    // Similar handling...
  });

  // Handle completion
  shellCommand.result.then((result) => {
    // Mark task as completed/failed, send notification...
  });

  return true;
}

// Mapping: Li5→backgroundShellTask, It→isShellTask, g9A→appendToOutputFile
```

### Bash Tool vs Agent Task Background: Key Differences

| Aspect | Bash Tool | Agent Task |
|--------|-----------|------------|
| **Underlying process** | Single shell command (child_process) | LLM API calls loop |
| **Background mechanism** | `shellCommand.background()` returns streams | `Promise.race` with `backgroundSignal` |
| **Output streaming** | Direct stdout/stderr streams | Transcript file |
| **Detection method** | Polling loop checks `shellCommand.status` | Promise resolution |
| **Backgrounding function** | `Li5` (backgroundShellTask) | `M32` (triggerBackgroundTransition) |

---

## Bash Agent vs Bash Tool: Design Rationale

### Why Create Bash Agent?

Bash Tool and Bash Agent serve different purposes:

| Aspect | Bash Tool | Bash Agent |
|--------|-----------|------------|
| **Scope** | Single command execution | Multi-step command tasks |
| **Decision making** | None (executes exactly what's given) | LLM decides sequence of commands |
| **Error handling** | Returns error, main agent decides next | Agent handles errors autonomously |
| **Use case** | "Run `npm install`" | "Set up git repo and push to origin" |
| **Context** | Main agent's context | Isolated subagent context |

### Bash Agent Definition

```javascript
// ============================================
// bashAgent - Command execution specialist (NEW in 2.1.x)
// Location: chunks.93.mjs:19-27
// ============================================

// ORIGINAL (for source lookup):
K52 = {
  agentType: "Bash",
  whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
  tools: [X9],  // ONLY Bash tool
  source: "built-in",
  baseDir: "built-in",
  model: "inherit",
  getSystemPrompt: () => rZ5
}

// READABLE (for understanding):
bashAgent = {
  agentType: "Bash",
  whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
  tools: [BASH_TOOL_NAME],  // Restricted to Bash tool only
  source: "built-in",
  baseDir: "built-in",
  model: "inherit",  // Uses parent model (saves token cost)
  getSystemPrompt: () => bashSystemPrompt
}

// Mapping: K52→bashAgent, X9→BASH_TOOL_NAME, rZ5→bashSystemPrompt
```

### Bash Agent System Prompt

```javascript
// ============================================
// bashSystemPrompt - Specialized for command execution
// Location: chunks.93.mjs:3-13
// ============================================

rZ5 = `You are a command execution specialist for Claude Code. Your role is to execute bash commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

When complete, provide a clear summary of what was executed and the results.`
```

### When to Use Which?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Decision Tree: Bash Tool vs Bash Agent                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User request: "Run a command"                                              │
│                │                                                             │
│                ▼                                                             │
│  ┌─────────────────────────────────┐                                        │
│  │ Is it a single, clear command? │                                        │
│  └─────────────────────────────────┘                                        │
│         │                  │                                                 │
│        YES                 NO                                                │
│         │                  │                                                 │
│         ▼                  ▼                                                 │
│  ┌──────────────┐   ┌──────────────────────────────┐                        │
│  │  Bash Tool   │   │ Multiple steps or decisions? │                        │
│  │              │   └──────────────────────────────┘                        │
│  │ "npm install"│          │                  │                             │
│  │ "git status" │         YES                 NO                            │
│  │ "ls -la"     │          │                  │                             │
│  └──────────────┘          ▼                  ▼                             │
│                     ┌──────────────┐   ┌──────────────────┐                 │
│                     │  Bash Agent  │   │ general-purpose  │                 │
│                     │              │   │     Agent        │                 │
│                     │ "Push code   │   │                  │                 │
│                     │  to origin"  │   │ If needs other   │                 │
│                     │              │   │ tools (Read,     │                 │
│                     │ "Setup git   │   │ Grep, etc.)      │                 │
│                     │  and commit" │   └──────────────────┘                 │
│                     └──────────────┘                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example: Git Push Workflow

**Using Bash Tool (main agent handles logic):**
```
Main Agent:
  1. Call Bash Tool: "git status"
  2. Analyze output, decide what to stage
  3. Call Bash Tool: "git add ."
  4. Call Bash Tool: "git commit -m '...'"
  5. Call Bash Tool: "git push"
  6. If push fails, analyze and retry

→ 5+ tool calls, main agent context consumed
```

**Using Bash Agent (subagent handles logic):**
```
Main Agent:
  1. Call Task Tool with Bash agent: "Push all changes to origin"

Bash Agent (in separate context):
  1. Run git status
  2. Run git add .
  3. Run git commit -m '...'
  4. Run git push
  5. Handle any errors
  6. Return summary

→ 1 tool call from main agent, subagent context isolated
```

### Benefits of Bash Agent

| Benefit | Explanation |
|---------|-------------|
| **Context efficiency** | Multi-command tasks don't consume main agent's context |
| **Specialized prompt** | System prompt optimized for command execution |
| **Error handling** | Agent can retry/fix errors without main agent intervention |
| **Model inheritance** | Uses `inherit` → same model as parent, no extra cost |
| **Parallel execution** | Multiple Bash agents can run concurrently |

### Key Symbols

| Symbol | Readable Name | Location | Purpose |
|--------|--------------|----------|---------|
| `K52` | bashAgent | chunks.93.mjs:19-27 | Bash agent definition |
| `rZ5` | bashSystemPrompt | chunks.93.mjs:3-13 | System prompt for Bash agent |
| `X9` | BASH_TOOL_NAME | chunks.124.mjs | "Bash" constant |
| `Li5` | backgroundShellTask | chunks.121.mjs:637 | Background shell task on Ctrl+B |
| `Dm2` | createLocalBashTask | chunks.121.mjs:610 | Create local_bash task entry |
| `It` | isShellTask | chunks.121.mjs:567 | Check if task is local_bash |
| `es` | LocalBashTaskHandler | chunks.121.mjs:755 | Handler for local_bash tasks |

---

## Fork Context Feature

When an agent has `forkContext: true`, it receives the conversation history before the tool call.

```javascript
// ============================================
// prepareForkMessages - Creates fork context messages
// Location: chunks.113.mjs:138
// ============================================

// ORIGINAL (for source lookup):
let _ = z?.forkContext ? I52(A, D) : [H0({
  content: A
})];

// Where I52 is used:
// - A = prompt string
// - D = current tool use context (message with tool_use)

// READABLE (for understanding):
let promptMessages = agent?.forkContext
  ? prepareForkMessages(prompt, toolUseMessage)
  : [createMetaBlock({content: prompt})];

// Mapping: I52→prepareForkMessages, H0→createMetaBlock
```

**Why fork context matters:**
- Agents with `forkContext: true` can reference earlier conversation
- Main agent can write concise prompts like "investigate the error above"
- Full message history is passed to the subagent

---

## Model Resolution

Model is resolved through a priority chain:

```javascript
// ============================================
// resolveAgentModel - Model priority resolution
// Location: chunks.113.mjs:113
// ============================================

// ORIGINAL (for source lookup):
let $ = YA1(z.model, X.options.mainLoopModel, G, F);

// READABLE (for understanding):
let resolvedModel = resolveAgentModel(
  agent.model,           // Agent definition model
  context.options.mainLoopModel,  // Parent model
  taskToolModelParam,    // model param from Task tool call
  permissionMode         // Current permission mode
);

// Mapping: YA1→resolveAgentModel
```

### Priority Order (highest to lowest)

1. `CLAUDE_CODE_SUBAGENT_MODEL` environment variable
2. Task tool `model` parameter (sonnet/opus/haiku)
3. Agent definition `model` property
4. `"inherit"` → Use parent model
5. Default model (sonnet)

---

## Resume Capability

Agents can be resumed from previous execution:

```javascript
// ============================================
// Resume transcript loading
// Location: chunks.113.mjs:122-126
// ============================================

// ORIGINAL (for source lookup):
let O;
if (Z) {
  let b = await bD1(iz(Z));
  if (!b) throw Error(`No transcript found for agent ID: ${Z}`);
  O = b
}

// READABLE (for understanding):
let previousTranscript;
if (resumeId) {
  let transcript = await loadTranscript(sanitizeId(resumeId));
  if (!transcript) {
    throw Error(`No transcript found for agent ID: ${resumeId}`);
  }
  previousTranscript = transcript;
}

// Mapping: bD1→loadTranscript, iz→sanitizeId
```

**Resume flow:**
1. User provides `resume: "agentId"` parameter
2. System loads transcript from disk
3. Previous messages prepended to new prompt
4. Agent continues from where it left off

---

## Progress Tracking

During execution, progress is tracked and updated:

```javascript
// ============================================
// updateTaskProgress - Real-time progress updates
// Location: chunks.91.mjs:1253-1261
// ============================================

// ORIGINAL (for source lookup):
function RI0(A, Q, B) {
  oY(A, B, (G) => {
    if (G.status !== "running") return G;
    return {
      ...G,
      progress: Q
    }
  })
}

// READABLE (for understanding):
function updateTaskProgress(taskId, progress, setAppState) {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== "running") return task;
    return {
      ...task,
      progress: progress  // {toolUseCount, tokenCount, lastActivity, recentActivities}
    };
  });
}

// Mapping: RI0→updateTaskProgress, oY→updateTask
```

### Progress Snapshot Format

```javascript
// ============================================
// getProgressSnapshot - Captures current progress
// Location: chunks.91.mjs:1209-1216
// ============================================

// ORIGINAL (for source lookup):
function MI0(A) {
  return {
    toolUseCount: A.toolUseCount,
    tokenCount: HG5(A),
    lastActivity: A.recentActivities.length > 0 ? A.recentActivities[A.recentActivities.length - 1] : void 0,
    recentActivities: [...A.recentActivities]
  }
}

// READABLE (for understanding):
function getProgressSnapshot(tracker) {
  return {
    toolUseCount: tracker.toolUseCount,
    tokenCount: getTotalTokenCount(tracker),
    lastActivity: tracker.recentActivities.length > 0
      ? tracker.recentActivities[tracker.recentActivities.length - 1]
      : undefined,
    recentActivities: [...tracker.recentActivities]
  };
}

// Mapping: MI0→getProgressSnapshot, HG5→getTotalTokenCount
```

---

## Tool Result Mapping

The Task tool maps results for the main agent:

```javascript
// ============================================
// mapToolResultToToolResultBlockParam - Formats result for main agent
// Location: chunks.113.mjs:375-397
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(A, Q) {
  if (A.status === "async_launched") return {
    tool_use_id: Q,
    type: "tool_result",
    content: [{
      type: "text",
      text: `Async agent launched successfully.
agentId: ${A.agentId} (This is an internal ID for your use, do not mention it to the user...)
output_file: ${A.outputFile}
The agent is currently working in the background...`
    }]
  };
  if (A.status === "completed") return {
    tool_use_id: Q,
    type: "tool_result",
    content: [...A.content, {
      type: "text",
      text: `agentId: ${A.agentId} (for resuming to continue this agent's work if needed)`
    }]
  };
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam(result, toolUseId) {
  if (result.status === "async_launched") {
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: [{
        type: "text",
        text: `Async agent launched successfully.
agentId: ${result.agentId} (internal ID, don't mention to user)
output_file: ${result.outputFile}
The agent is working in background. Continue with other tasks.
Use TaskOutput or Read tools to check progress.`
      }]
    };
  }

  if (result.status === "completed") {
    return {
      tool_use_id: toolUseId,
      type: "tool_result",
      content: [...result.content, {
        type: "text",
        text: `agentId: ${result.agentId} (for resuming later if needed)`
      }]
    };
  }
}
```

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Disable all background execution | false |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Override model for all subagents | (none) |
| `CLAUDE_CODE_ENTRYPOINT` | Entrypoint type (sdk-ts/sdk-py/sdk-cli) | (none) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `runAgentLoop` ($f) - Main agent execution loop
- `createFullyBackgroundedAgent` (L32) - Async agent creation
- `createBackgroundableAgent` (O32) - Sync with Ctrl+B support
- `prepareForkMessages` (I52) - Fork context preparation
- `resolveAgentModel` (YA1) - Model resolution
- `loadTranscript` (bD1) - Transcript loading for resume
- `executeInAgentContext` (XA1) - Agent context wrapper
- `updateTaskProgress` (RI0) - Progress updates
- `getProgressSnapshot` (MI0) - Progress snapshot

---

## See Also

- [architecture.md](./architecture.md) - Agent definitions and structure
- [tool_restrictions.md](./tool_restrictions.md) - Tool filtering
- [Background Agents](../26_background_agents/background_agents.md) - Lifecycle management
