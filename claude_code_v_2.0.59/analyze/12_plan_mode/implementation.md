# Plan Mode Implementation - Enhanced Analysis

## Overview

Plan Mode is a read-only exploration and planning phase in Claude Code where the assistant focuses on understanding the codebase and designing implementation strategies before writing code. It provides a structured workflow for complex tasks requiring upfront planning.

---

## 1. Plan Mode Architecture Overview

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLAN MODE STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    EnterPlanMode Tool    ┌───────────────────┐          │
│   │    Normal    │ ─────────────────────────>│    Plan Mode      │          │
│   │    Mode      │                           │    Active         │          │
│   │(mode=default)│                           │   (mode=plan)     │          │
│   └──────────────┘                           └─────────┬─────────┘          │
│         ^                                              │                     │
│         │                                              │                     │
│         │         ExitPlanMode Tool                    │                     │
│         │  ┌───────────────────────────────────────────┘                     │
│         │  │                                                                 │
│         │  ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │               Mode Selection on Exit                         │           │
│   │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │           │
│   │  │   default   │  │ acceptEdits  │  │ bypassPermissions │   │           │
│   │  │  (ask each) │  │(auto-approve │  │  (skip all asks)  │   │           │
│   │  │             │  │  file edits) │  │                   │   │           │
│   │  └─────────────┘  └──────────────┘  └───────────────────┘   │           │
│   └─────────────────────────────────────────────────────────────┘           │
│                                                                             │
│   RE-ENTRY DETECTION:                                                       │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │  if (hasExitedPlanMode && planFileExists) {                 │           │
│   │    → Generate "plan_mode_reentry" attachment                │           │
│   │    → Prompt to evaluate: same task vs different task        │           │
│   │  }                                                          │           │
│   └─────────────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Plan File Persistence

### 2.1 File Storage Location

**Directory:** `~/.claude/plans/`

**File Naming:** `{adjective}-{action}-{noun}.md`

```javascript
// ============================================
// Plan file path generation
// Location: chunks.88.mjs:770-825
// ============================================

// ORIGINAL:
function ueB() {
  let A = Yo1(feB),    // Random adjective
    Q = Yo1(geB),      // Random action verb
    B = Yo1(heB);      // Random noun
  return `${A}-${Q}-${B}`
}

// READABLE:
function generateRandomPlanSlug() {
  let adjective = randomSelect(adjectives);   // e.g., "bright", "eager", "calm"
  let action = randomSelect(actions);         // e.g., "exploring", "brewing", "dancing"
  let noun = randomSelect(nouns);             // e.g., "aurora", "phoenix", "cascade"
  return `${adjective}-${action}-${noun}`;    // e.g., "bright-exploring-aurora"
}

// Word lists contain 200+ options each:
// adjectives: ["abundant", "ancient", "bright", "calm", "cheerful", ...]
// actions: ["baking", "beaming", "bouncing", "brewing", "bubbling", ...]
// nouns: ["aurora", "avalanche", "blossom", "breeze", ...]
// Total combinations: ~8 million unique names
```

### 2.2 Plans Directory Initialization

```javascript
// ============================================
// kU - Get/create plans directory
// Location: chunks.88.mjs:810-817
// ============================================

// ORIGINAL:
function kU() {
  let A = gNA(MQ(), "plans");
  if (!RA().existsSync(A)) try {
    RA().mkdirSync(A)
  } catch (Q) {
    AA(Q instanceof Error ? Q : Error(String(Q)))
  }
  return A
}

// READABLE:
function getPlansDirectory() {
  // MQ() returns ~/.claude (or CLAUDE_CONFIG_DIR env var)
  let plansDir = pathJoin(getConfigDir(), "plans");

  if (!fs.existsSync(plansDir)) {
    try {
      fs.mkdirSync(plansDir);
    } catch (error) {
      logError(error);
    }
  }
  return plansDir;
}

// Result: ~/.claude/plans/
```

### 2.3 Plan File Path Resolution

```javascript
// ============================================
// yU - Get plan file path for agent/session
// Location: chunks.88.mjs:820-825
// ============================================

// ORIGINAL:
function yU(A) {
  let Q = A ?? e1(),           // agentId or sessionId
    B = e1(),                   // main session ID
    G = dA5(B);                 // unique plan slug for session
  if (Q === B) return gNA(kU(), `${G}.md`);
  return gNA(kU(), `${G}-agent-${Q}.md`)
}

// READABLE:
function getPlanFilePath(agentId) {
  let currentAgentId = agentId ?? getSessionId();
  let mainSessionId = getSessionId();
  let planSlug = getUniquePlanSlug(mainSessionId);

  // Main session: ~/.claude/plans/bright-exploring-aurora.md
  if (currentAgentId === mainSessionId) {
    return pathJoin(getPlansDirectory(), `${planSlug}.md`);
  }

  // Sub-agent: ~/.claude/plans/bright-exploring-aurora-agent-{agentId}.md
  return pathJoin(getPlansDirectory(), `${planSlug}-agent-${currentAgentId}.md`);
}
```

### 2.4 Plan Slug Caching (Session-to-Slug Mapping)

```javascript
// ============================================
// dA5 - Generate unique plan slug with caching
// Location: chunks.88.mjs:790-803
// ============================================

// ORIGINAL:
function dA5(A) {
  let Q = A ?? e1(),
    B = qFA(),              // Get cache Map
    G = B.get(Q);           // Check if already generated
  if (!G) {
    let Z = kU();
    for (let I = 0; I < mA5; I++) {  // mA5 = 10 retries
      G = ueB();            // Generate random slug
      let Y = gNA(Z, `${G}.md`);
      if (!RA().existsSync(Y)) break  // Check no collision
    }
    B.set(Q, G)             // Cache the slug
  }
  return G
}

// READABLE (Pseudocode):
function getUniquePlanSlug(sessionId) {
  let cache = getPlanSlugCache();  // Map<sessionId, slugString>
  let cachedSlug = cache.get(sessionId);

  if (!cachedSlug) {
    let plansDir = getPlansDirectory();

    // Try up to 10 times to find unused name
    for (let attempt = 0; attempt < 10; attempt++) {
      cachedSlug = generateRandomPlanSlug();
      let planPath = `${plansDir}/${cachedSlug}.md`;

      if (!fs.existsSync(planPath)) {
        break;  // Found unused name
      }
    }

    cache.set(sessionId, cachedSlug);
  }

  return cachedSlug;
}
```

### 2.5 Plan File Read/Write

```javascript
// ============================================
// xU - Read plan file content
// Location: chunks.88.mjs:828-837
// ============================================

// ORIGINAL:
function xU(A) {
  let Q = yU(A);
  if (!RA().existsSync(Q)) return null;
  try {
    return RA().readFileSync(Q, { encoding: "utf-8" })
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), null
  }
}

// READABLE:
function readPlanFile(agentId) {
  let planPath = getPlanFilePath(agentId);

  if (!fs.existsSync(planPath)) {
    return null;  // No plan file yet
  }

  try {
    return fs.readFileSync(planPath, { encoding: "utf-8" });
  } catch (error) {
    logError(error);
    return null;
  }
}

// Writing is done via Write tool or Edit tool directly
// No special write function - uses standard file operations
```

---

## 3. State Management Deep Dive

### 3.1 Mode Storage in toolPermissionContext

```javascript
// ============================================
// UF - Permission context reducer
// Location: chunks.16.mjs:1122-1128
// ============================================

// ORIGINAL:
function UF(A, Q) {
  switch (Q.type) {
    case "setMode":
      return g(`Applying permission update: Setting mode to '${Q.mode}'`), {
        ...A,
        mode: Q.mode
      };
    // ... other cases
  }
}

// READABLE:
function applyPermissionContextAction(currentContext, action) {
  switch (action.type) {
    case "setMode":
      logDebug(`Applying permission update: Setting mode to '${action.mode}'`);
      return {
        ...currentContext,
        mode: action.mode  // "plan" | "default" | "acceptEdits" | "bypassPermissions"
      };
  }
}
```

### 3.2 EnterPlanMode State Transition

```javascript
// ============================================
// EnterPlanMode UI component - State change on approval
// Location: chunks.130.mjs:2401-2411
// ============================================

// ORIGINAL:
function Dd2({ toolUseConfirm: A, onDone: Q, onReject: B }) {
  function G(Z) {
    if (Z === "yes") Q(), A.onAllow({}, [{
      type: "setMode",
      mode: "plan",
      destination: "session"
    }]);
    else Q(), B(), A.onReject()
  }
  // ... UI rendering
}

// READABLE (Pseudocode):
function EnterPlanModeConfirmUI({ toolUseConfirm, onDone, onReject }) {
  function handleUserResponse(response) {
    if (response === "yes") {
      onDone();

      // Dispatch state change action
      toolUseConfirm.onAllow({}, [{
        type: "setMode",
        mode: "plan",              // Set mode to plan
        destination: "session"     // Session-scoped (not persisted)
      }]);
    } else {
      onDone();
      onReject();
      toolUseConfirm.onReject();
    }
  }
}
```

### 3.3 ExitPlanMode State Transitions

```javascript
// ============================================
// ExitPlanMode confirmation UI - Three exit paths
// Location: chunks.130.mjs:2065-2085
// ============================================

// ORIGINAL:
if (w === "yes-bypass-permissions")
  GA("tengu_plan_exit", {planLengthChars: K.length, outcome: w}),
  ou(!0), Q(), A.onAllow(N, [{
    type: "setMode",
    mode: "bypassPermissions",
    destination: "session"
  }]);
else if (w === "yes-accept-edits")
  GA("tengu_plan_exit", {planLengthChars: K.length, outcome: w}),
  ou(!0), Q(), A.onAllow(N, [{
    type: "setMode",
    mode: "acceptEdits",
    destination: "session"
  }]);
else if (w === "yes-default")
  GA("tengu_plan_exit", {planLengthChars: K.length, outcome: w}),
  ou(!0), Q(), A.onAllow(N, [{
    type: "setMode",
    mode: "default",
    destination: "session"
  }]);

// READABLE (Pseudocode):
function handleExitPlanModeResponse(response) {
  if (response === "yes-bypass-permissions") {
    analytics("tengu_plan_exit", { outcome: response });
    setHasExitedPlanMode(true);  // ou(!0) - Mark that we exited plan mode

    dispatchAction({
      type: "setMode",
      mode: "bypassPermissions",  // Auto-approve ALL tools
      destination: "session"
    });
  }
  else if (response === "yes-accept-edits") {
    setHasExitedPlanMode(true);

    dispatchAction({
      type: "setMode",
      mode: "acceptEdits",        // Auto-approve file edits only
      destination: "session"
    });
  }
  else if (response === "yes-default") {
    setHasExitedPlanMode(true);

    dispatchAction({
      type: "setMode",
      mode: "default",            // Ask for each action
      destination: "session"
    });
  }
}
```

### 3.4 Global State Flag: hasExitedPlanMode

```javascript
// ============================================
// Global state tracking for plan mode exit
// Location: chunks.1.mjs:2807-2812
// ============================================

// ORIGINAL:
function Jz0() {
  return WQ.hasExitedPlanMode    // Getter
}

function ou(A) {
  WQ.hasExitedPlanMode = A       // Setter
}

// READABLE:
// WQ = global state object
// hasExitedPlanMode = boolean flag

function hasExitedPlanMode() {
  return globalState.hasExitedPlanMode;
}

function setHasExitedPlanMode(value) {
  globalState.hasExitedPlanMode = value;
}

// This flag is used to detect "re-entry" into plan mode
// If true AND plan file exists, show "plan_mode_reentry" attachment
```

---

## 4. "New Plan" Detection Mechanism (Context Switching)

### 4.1 Detection is Prompt-Based, NOT Code-Based

The "new plan" vs "same task" detection is **NOT an automatic algorithm**. It's a prompt instruction for the LLM to evaluate.

### 4.2 Plan Mode Re-entry Detection Flow

```javascript
// ============================================
// VH5 - Generate plan mode attachments
// Location: chunks.107.mjs:1886-1908
// ============================================

// ORIGINAL:
async function VH5(A, Q) {
  // Check if in plan mode
  if ((await Q.getAppState()).toolPermissionContext.mode !== "plan") return [];

  // Throttle attachments (avoid spam)
  if (A && A.length > 0) {
    let { turnCount: J, foundPlanModeAttachment: W } = XH5(A);
    if (W && J < IH5.TURNS_BETWEEN_ATTACHMENTS) return []  // IH5 = 5 turns
  }

  let Z = yU(Q.agentId),    // Plan file path
    I = xU(Q.agentId),      // Plan content (null if not exists)
    Y = [];

  // KEY: Re-entry detection
  if (Jz0() && I !== null) {  // hasExitedPlanMode() && planExists
    Y.push({
      type: "plan_mode_reentry",
      planFilePath: Z
    });
    ou(!1);  // Reset flag: setHasExitedPlanMode(false)
  }

  // Always add plan_mode attachment
  return Y.push({
    type: "plan_mode",
    isSubAgent: Q.isSubAgent,
    planFilePath: Z,
    planExists: I !== null
  }), Y
}

// READABLE (Pseudocode):
async function getPlanModeAttachments(conversationHistory, agentContext) {
  // Only generate if in plan mode
  let appState = await agentContext.getAppState();
  if (appState.toolPermissionContext.mode !== "plan") {
    return [];
  }

  // Throttle: Don't send attachment if recently sent
  if (conversationHistory?.length > 0) {
    let { turnCount, foundAttachment } = countTurnsSincePlanAttachment(history);
    if (foundAttachment && turnCount < 5) {
      return [];  // Too soon
    }
  }

  let planFilePath = getPlanFilePath(agentContext.agentId);
  let planContent = readPlanFile(agentContext.agentId);
  let attachments = [];

  // CRITICAL: Re-entry detection
  if (hasExitedPlanMode() && planContent !== null) {
    // User previously exited plan mode, but re-entered
    // AND a plan file still exists from before
    attachments.push({
      type: "plan_mode_reentry",
      planFilePath: planFilePath
    });

    setHasExitedPlanMode(false);  // Reset for next cycle
  }

  // Standard plan mode attachment
  attachments.push({
    type: "plan_mode",
    isSubAgent: agentContext.isSubAgent,
    planFilePath: planFilePath,
    planExists: planContent !== null
  });

  return attachments;
}
```

### 4.3 The "plan_mode_reentry" Prompt (Context Switching Instruction)

```javascript
// ============================================
// Plan mode re-entry message generation
// Location: chunks.154.mjs:146-163
// ============================================

// ORIGINAL:
case "plan_mode_reentry": {
  let B = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${gq.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
  return NG([R0({
    content: B,
    isMeta: !0
  })])
}
```

### 4.4 Key Insight: LLM-Based Context Evaluation

The phrase "This is a different task from the previous plan" is generated by the **LLM itself** after reading and evaluating:

1. The existing plan file content
2. The user's new request
3. Semantic similarity between old plan and new request

**There is NO code-based detection algorithm.** The system:
1. Detects that we're *re-entering* plan mode (via `hasExitedPlanMode` flag)
2. Detects that an old plan file exists
3. Prompts Claude to *decide* if it's a new task or continuation
4. Claude then writes its reasoning (like "This is a different task...")

---

## 5. Todo List Integration

### 5.1 Todo File Storage (Separate from Plans)

```javascript
// ============================================
// Todo file path generation
// Location: chunks.106.mjs:1847-1856
// ============================================

// ORIGINAL:
function x00() {
  let A = G91(MQ(), "todos");
  if (!RA().existsSync(A)) RA().mkdirSync(A);
  return A
}

function Ri(A) {
  let Q = `${e1()}-agent-${A}.json`;
  return G91(x00(), Q)
}

// READABLE:
function getTodosDirectory() {
  // ~/.claude/todos/
  let todosDir = pathJoin(getConfigDir(), "todos");
  if (!fs.existsSync(todosDir)) {
    fs.mkdirSync(todosDir);
  }
  return todosDir;
}

function getTodoFilePath(agentId) {
  // ~/.claude/todos/{sessionId}-agent-{agentId}.json
  let filename = `${getSessionId()}-agent-${agentId}.json`;
  return pathJoin(getTodosDirectory(), filename);
}
```

### 5.2 Todo Persistence Functions

```javascript
// ============================================
// Todo file read/write
// Location: chunks.106.mjs:1858-1903
// ============================================

// ORIGINAL:
function Nh(A) {
  return hZ2(Ri(A))
}

function UYA(A, Q) {
  gZ2(A, Ri(Q))
}

function hZ2(A) {
  if (!RA().existsSync(A)) return [];
  try {
    let Q = JSON.parse(RA().readFileSync(A, { encoding: "utf-8" }));
    return V7A.parse(Q)  // Validate with Zod schema
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error(String(Q))), []
  }
}

function gZ2(A, Q) {
  try {
    L_(Q, JSON.stringify(A, null, 2))  // Atomic write
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)))
  }
}

// READABLE:
function readTodosFromFile(agentId) {
  return parseJsonTodoFile(getTodoFilePath(agentId));
}

function writeTodosToFile(todos, agentId) {
  writeJsonTodoFile(todos, getTodoFilePath(agentId));
}

function parseJsonTodoFile(filePath) {
  if (!fs.existsSync(filePath)) return [];

  try {
    let content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return TodoArraySchema.parse(content);  // Validate
  } catch (error) {
    logError(error);
    return [];
  }
}

function writeJsonTodoFile(todos, filePath) {
  try {
    atomicWriteFile(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    logError(error);
  }
}
```

### 5.3 Todo Migration Between Sessions

```javascript
// ============================================
// vK5 - Migrate todos when resuming session
// Location: chunks.106.mjs:1873-1883
// ============================================

// ORIGINAL:
function vK5(A, Q) {
  let B = G91(x00(), `${A}-agent-${A}.json`),
    G = G91(x00(), `${Q}-agent-${Q}.json`);
  try {
    let Z = hZ2(B);
    if (Z.length === 0) return !1;
    return gZ2(Z, G), !0
  } catch (Z) {
    return AA(Z instanceof Error ? Z : Error(String(Z))), !1
  }
}

// READABLE:
function migrateTodosBetweenSessions(oldSessionId, newSessionId) {
  let oldTodoPath = `${getTodosDirectory()}/${oldSessionId}-agent-${oldSessionId}.json`;
  let newTodoPath = `${getTodosDirectory()}/${newSessionId}-agent-${newSessionId}.json`;

  try {
    let todos = parseJsonTodoFile(oldTodoPath);
    if (todos.length === 0) return false;

    writeJsonTodoFile(todos, newTodoPath);
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
}
```

### 5.4 Todos in Post-Compaction Context

```javascript
// ============================================
// fD5 - Restore todos after conversation compaction
// Location: chunks.107.mjs:1271-1280
// ============================================

// ORIGINAL:
function fD5(A) {
  let Q = Nh(A);
  if (Q.length === 0) return null;
  return l9({
    type: "todo",
    content: Q,
    itemCount: Q.length,
    context: "post-compact"
  })
}

// READABLE:
function createPostCompactTodoAttachment(agentId) {
  let todos = readTodosFromFile(agentId);

  if (todos.length === 0) {
    return null;  // No todos to restore
  }

  return createAttachment({
    type: "todo",
    content: todos,
    itemCount: todos.length,
    context: "post-compact"  // Indicates this is a restore after compaction
  });
}

// This ensures todos survive conversation compaction
// Todos are stored on disk, read back, and re-injected into context
```

### 5.5 TodoWrite Tool Availability in Plan Mode

**Key Finding:** `TodoWrite` is NOT in the disallowed tools list for plan mode.

```javascript
// ============================================
// Disallowed tools in Plan/Explore agents
// Location: chunks.125.mjs:1407, 1477
// ============================================

disallowedTools: [
  A6,      // "Task" tool - can't spawn more agents
  P51,     // Another variant
  $5,      // "Edit" tool - can't edit files
  wX,      // "Write" tool - can't create files
  JS       // "NotebookEdit" - can't edit notebooks
]

// NOTE: TodoWrite (QEB) is NOT listed
// Therefore: TodoWrite IS available during plan mode
```

### 5.6 Interaction Between Plan Mode and Todos

```
┌─────────────────────────────────────────────────────────────────┐
│                  PLAN MODE + TODO INTERACTION                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  During Plan Mode:                                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ TodoWrite Tool: AVAILABLE (can track planning tasks)      │ │
│  │ Todos Storage: ~/.claude/todos/{sessionId}-agent-*.json   │ │
│  │ Plan Storage: ~/.claude/plans/{slug}.md                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  On ExitPlanMode:                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Message: "Start with updating your todo list if applicable"│ │
│  │ Todos: NOT automatically migrated or cleared              │ │
│  │ Plan: Read from file, shown to user for approval          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  On Context Compaction:                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ fD5(): Reads todos from disk, injects as attachment       │ │
│  │ XQ0(): Reads plan from disk, injects as attachment        │ │
│  │ Both survive compaction via file persistence              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Plan Mode System Prompt Generation

### 6.1 Main Agent Plan Mode Prompt

```javascript
// ============================================
// Sb3 - Generate main agent plan mode instructions
// Location: chunks.153.mjs:2890-2964
// ============================================

function Sb3(A) {
  if (A.isSubAgent) return [];

  let Q = uE9(),  // getPlanAgentCount() - default 1
    B = mE9();    // getExploreAgentCount() - default 3

  let Z = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${A.planExists
  ? `A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${lD.name} tool.`
  : `No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${QV.name} tool.`}
...`;

  return wrapInSystemReminder([createMetaBlock({ content: Z, isMeta: true })]);
}
```

### 6.2 Sub-agent Plan Mode Prompt (Simplified)

```javascript
// ============================================
// _b3 - Generate sub-agent plan mode instructions
// Location: chunks.153.mjs:2966-2977
// ============================================

function _b3(A) {
  let B = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${A.planExists
  ? `A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${lD.name} tool if you need to.`
  : `No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${QV.name} tool if you need to.`}
...`;

  return wrapInSystemReminder([createMetaBlock({ content: B, isMeta: true })]);
}
```

---

## 7. Plan Mode Workflow

### Phase 1: Entering Plan Mode

Plan mode is entered via the **EnterPlanMode** tool.

#### EnterPlanMode Tool Description (Id2)

**Location:** `chunks.130.mjs:2199-2272`

```javascript
// ============================================
// Id2 - EnterPlanMode tool description prompt
// Location: chunks.130.mjs:2199-2272
// ============================================

Id2 = `Use this tool when you encounter a complex task that requires careful planning and exploration before implementation. This tool transitions you into plan mode where you can thoroughly explore the codebase and design an implementation approach.

## When to Use This Tool

Use EnterPlanMode when ANY of these conditions apply:

1. **Multiple Valid Approaches**: The task can be solved in several different ways, each with trade-offs
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

2. **Significant Architectural Decisions**: The task requires choosing between architectural patterns
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

3. **Large-Scale Changes**: The task touches many files or systems
   - Example: "Refactor the authentication system"
   - Example: "Migrate from REST to GraphQL"

4. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

5. **User Input Needed**: You'll need to ask clarifying questions before starting
   - If you would use AskUserQuestion to clarify the approach, consider EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Do NOT use EnterPlanMode for:
- Simple, straightforward tasks with obvious implementation
- Small bug fixes where the solution is clear
- Adding a single function or small feature
- Tasks you're already confident how to implement
- Research-only tasks (use the Task tool with explore agent instead)

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use AskUserQuestion if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- This requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- Be thoughtful about when to use it - unnecessary plan mode slows down simple tasks
- If unsure whether to use it, err on the side of starting implementation
- You can always ask the user "Would you like me to plan this out first?"
`
```

#### EnterPlanMode Tool Implementation

**From chunks.130.mjs:2336-2398:**
```javascript
// ============================================
// cTA - EnterPlanMode tool object
// Location: chunks.130.mjs:2336-2398
// ============================================

cTA = {
  name: "EnterPlanMode",  // A71
  async description() {
    return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
  },
  async prompt() {
    return Id2  // Full description shown above
  },
  inputSchema: j.strictObject({}),     // No parameters
  outputSchema: j.object({
    message: j.string().describe("Confirmation that plan mode was entered")
  }),
  userFacingName() {
    return ""
  },
  isEnabled() {
    return true
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true  // Read-only tool
  },
  async checkPermissions(input) {
    return {
      behavior: "ask",
      message: "Enter plan mode?",
      updatedInput: input
    }
  },
  async call(A, Q) {
    let sessionId = e1();
    if (Q.agentId !== sessionId) {
      throw Error("EnterPlanMode tool cannot be used in agent contexts");
    }
    return {
      data: {
        message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
      }
    }
  },
  mapToolResultToToolResultBlockParam({ message }, toolUseId) {
    return {
      type: "tool_result",
      content: `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
      tool_use_id: toolUseId
    }
  }
}
```

**Key Properties:**
- **Read-only**: Tool is marked as `isReadOnly() { return !0 }`
- **Main thread only**: Cannot be used in agent contexts (subagents)
- **Permission required**: Uses `checkPermissions` with "ask" behavior
- **Mode transition**: Sets session mode to "plan"

### Phase 2: User Confirmation

**From chunks.130.mjs:2401-2449:**
```javascript
function Dd2({
  toolUseConfirm: A,
  onDone: Q,
  onReject: B
}) {
  function G(Z) {
    if (Z === "yes") Q(), A.onAllow({}, [{
      type: "setMode",
      mode: "plan",
      destination: "session"
    }]);
    else Q(), B(), A.onReject()
  }

  return C$.default.createElement(uJ, {
    color: "planMode",
    title: "Enter plan mode?"
  }, /* UI elements */
    C$.default.createElement($, null, "Claude wants to enter plan mode to explore and design an implementation approach."),
    C$.default.createElement($, {
      dimColor: !0
    }, "In plan mode, Claude will:"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Explore the codebase thoroughly"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Identify existing patterns"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Design an implementation strategy"),
    C$.default.createElement($, {
      dimColor: !0
    }, " · Present a plan for your approval"),
    C$.default.createElement($, {
      dimColor: !0
    }, "No code changes will be made until you approve the plan.")
  )
}
```

### Phase 3: Planning Activities

During plan mode, Claude operates with restrictions:

**Disallowed Tools:**
```javascript
disallowedTools: [A6, P51, $5, wX, JS]
// A6 = Task (limited)
// P51 = ExitPlanMode (in some contexts)
// $5 = Edit
// wX = Write
// JS = NotebookEdit
```

**Allowed Activities:**
- Read files (Read tool)
- Search code (Grep tool)
- Find files (Glob tool)
- Read-only Bash commands (ls, cat, git status, git diff, etc.)
- Ask user questions (AskUserQuestion tool)
- TodoWrite (for tracking planning tasks)

### Phase 4: Exiting Plan Mode

#### ExitPlanMode Tool Description - Simple Variant (TXZ)

**Location:** `chunks.130.mjs:1702-1717`

```javascript
// ============================================
// TXZ - ExitPlanMode simple variant (inline plan)
// Location: chunks.130.mjs:1702-1717
// ============================================

TXZ = `Use this tool when you are in plan mode and have finished presenting your plan and are ready to code. This will prompt the user to exit plan mode.

IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the AskUserQuestion tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Only proceed with ExitPlanMode after resolving ambiguities

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.
`
```

#### ExitPlanMode Tool Description - File-Based Variant (am2)

**Location:** `chunks.130.mjs:1717-1741`

```javascript
// ============================================
// am2 - ExitPlanMode file-based variant (plan in file)
// Location: chunks.130.mjs:1717-1741
// ============================================

am2 = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Handling Ambiguity in Plans
Before using this tool, ensure your plan is clear and unambiguous. If there are multiple valid approaches or unclear requirements:
1. Use the AskUserQuestion tool to clarify with the user
2. Ask about specific implementation choices (e.g., architectural patterns, which library to use)
3. Clarify any assumptions that could affect the implementation
4. Edit your plan file to incorporate user feedback
5. Only proceed with ExitPlanMode after resolving ambiguities and updating the plan file

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.
`
```

#### ExitPlanMode Tool Implementation

**Location:** `chunks.130.mjs:1850-1928`

```javascript
// ============================================
// gq - ExitPlanMode tool object
// Location: chunks.130.mjs:1850-1928
// ============================================

gq = {
  name: "ExitPlanMode",  // rRA
  inputSchema: j.strictObject({}).passthrough(),  // Accepts any properties (future extensibility)
  outputSchema: j.object({
    plan: j.string().describe("The plan that was presented to the user"),
    isAgent: j.boolean(),
    filePath: j.string().optional().describe("The file path where the plan was saved")
  }),
  async call(A, Q) {
    let sessionId = e1(),
      isAgent = Q.agentId !== sessionId,
      planFilePath = yU(Q.agentId),
      planContent = xU(Q.agentId);

    // CRITICAL: Plan file must exist
    if (!planContent) {
      throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
    }

    return {
      data: {
        plan: planContent,     // Read plan from file
        isAgent: isAgent,      // Is this being called from agent (vs main conversation)
        filePath: planFilePath
      }
    }
  },
  mapToolResultToToolResultBlockParam({ isAgent, plan, filePath }, toolUseId) {
    if (isAgent) {
      // Sub-agent context - just confirm approval
      return {
        type: "tool_result",
        content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: toolUseId
      };
    }

    // Main conversation context - start implementing
    return {
      type: "tool_result",
      content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.

## Approved Plan:
${plan}`,
      tool_use_id: toolUseId
    }
  }
}
```

**Note:** The `inputSchema: j.strictObject({}).passthrough()` allows any properties to be passed, enabling future extensions like `launchSwarm` or `teammateCount` parameters (currently NOT implemented).

---

## 8. Integration with Explore and Plan Agents

### Explore Agent

#### Explore Agent System Prompt (li5)

**Location:** `chunks.125.mjs:1370-1404`

```javascript
// ============================================
// li5 - Explore agent system prompt
// Location: chunks.125.mjs:1370-1404
// ============================================

li5 = `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use Glob for broad file pattern matching
- Use Grep for searching file contents with regex
- Use Read when you know the specific file path you need to read
- Use Bash ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.`
```

#### Explore Agent Definition (xq)

**From chunks.125.mjs:1404-1413:**
```javascript
// ============================================
// xq - Explore agent definition object
// Location: chunks.125.mjs:1404-1413
// ============================================

xq = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
  disallowedTools: [
    "Task",          // A6 - Can't spawn sub-agents
    "ExitPlanMode",  // P51 - Not needed for exploration
    "Edit",          // $5 - Can't modify files
    "Write",         // wX - Can't create files
    "NotebookEdit"   // JS - Can't edit notebooks
  ],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",    // Fast, lightweight model
  getSystemPrompt: () => li5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}
```

**Purpose**: Fast codebase exploration for plan mode
- Uses Haiku model for speed
- Read-only tools (Grep, Glob, Read, Bash)
- Optimized for parallel tool usage
- Lightweight for quick searches

### Plan Agent

#### Plan Agent System Prompt (ii5)

**Location:** `chunks.125.mjs:1425-1474`

```javascript
// ============================================
// ii5 - Plan agent system prompt
// Location: chunks.125.mjs:1425-1474
// ============================================

ii5 = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using Glob, Grep, and Read
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use Bash ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason: e.g., "Core logic to modify"]
- path/to/file2.ts - [Brief reason: e.g., "Interfaces to implement"]
- path/to/file3.ts - [Brief reason: e.g., "Pattern to follow"]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`
```

#### Plan Agent Definition (kWA)

**From chunks.125.mjs:1474-1484:**
```javascript
// ============================================
// kWA - Plan agent definition object
// Location: chunks.125.mjs:1474-1484
// ============================================

kWA = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
  disallowedTools: [
    "Task",          // A6 - Can't spawn sub-agents
    "ExitPlanMode",  // P51 - Not needed for planning
    "Edit",          // $5 - Can't modify files
    "Write",         // wX - Can't create files
    "NotebookEdit"   // JS - Can't edit notebooks
  ],
  source: "built-in",
  tools: xq.tools,   // Same tools as Explore agent
  baseDir: "built-in",
  model: "inherit",  // Uses session model (often Sonnet/Opus)
  getSystemPrompt: () => ii5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}
```

**Purpose**: Software architecture and planning
- Inherits session model (usually more capable than Haiku)
- Same read-only tool restrictions as Explore
- Structured planning system prompt
- Outputs critical files list

### Agent Count Configuration

**From chunks.153.mjs:2062-2080:**
```javascript
function uE9() {  // getPlanAgentCount
  if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
    let B = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
    if (!isNaN(B) && B > 0 && B <= 10) return B
  }
  let A = f4(),              // Get user tier
    Q = yc();                // Get model config
  if (A === "max" && Q === "default_claude_max_20x") return 3;
  if (A === "enterprise" || A === "team") return 3;
  return 1                   // Default: 1 agent
}

function mE9() {  // getExploreAgentCount
  if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) {
    let A = parseInt(process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT, 10);
    if (!isNaN(A) && A > 0 && A <= 10) return A
  }
  return 3                   // Default: 3 Explore agents
}
```

---

## 9. Symbol Mapping Reference

> Full mappings in [../00_overview/symbol_index.md](../00_overview/symbol_index.md)

Key symbols used in this document:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `VH5` | getPlanModeAttachment | chunks.107.mjs:1886 | function |
| `Jz0` | hasExitedPlanMode | chunks.1.mjs:2807 | function |
| `ou` | setHasExitedPlanMode | chunks.1.mjs:2811 | function |
| `yU` | getPlanFilePath | chunks.88.mjs:820 | function |
| `xU` | readPlanFile | chunks.88.mjs:828 | function |
| `kU` | getPlansDirectory | chunks.88.mjs:810 | function |
| `dA5` | getUniquePlanSlug | chunks.88.mjs:790 | function |
| `ueB` | generateRandomPlanSlug | chunks.88.mjs:770 | function |
| `Sb3` | generateMainAgentPlanMode | chunks.153.mjs:2890 | function |
| `_b3` | generateSubAgentPlanMode | chunks.153.mjs:2966 | function |
| `fD5` | postCompactTodoRestore | chunks.107.mjs:1271 | function |
| `vK5` | migrateTodosBetweenSessions | chunks.106.mjs:1873 | function |
| `gq` | ExitPlanModeTool | chunks.130.mjs:1850 | object |
| `XH5` | checkPlanModeThrottle | chunks.107.mjs:~1860 | function |
| `IH5` | PLAN_MODE_THROTTLE_CONFIG | chunks.107.mjs | constant |
| `uE9` | getPlanAgentCount | chunks.153.mjs:2062 | function |
| `mE9` | getExploreAgentCount | chunks.153.mjs:2074 | function |

---

## 10. Summary

Plan Mode provides a structured workflow for complex implementation tasks:

1. **Entry**: EnterPlanMode tool with user confirmation
2. **Exploration**: Read-only codebase analysis using Explore agents
3. **Planning**: Architectural design using Plan agents
4. **Documentation**: Plan written to `~/.claude/plans/` directory
5. **Exit**: ExitPlanMode tool presents plan for user approval
6. **Implementation**: On approval, exit plan mode and begin coding

**Key Benefits:**
- Forces upfront thinking before code changes
- Prevents premature implementation
- Encourages exploration of existing patterns
- Supports parallel exploration via multiple agents
- Maintains plan context through conversation compaction
- Clear separation between planning and implementation phases

**Key Technical Details:**
- **Plan Persistence**: Files stored at `~/.claude/plans/{adjective}-{action}-{noun}.md`
- **State Management**: `mode: "plan"` in `toolPermissionContext`, session-scoped
- **Re-entry Detection**: Uses `hasExitedPlanMode` flag + plan file existence
- **"New Plan" Decision**: Prompt-based (LLM decides), NOT code-based detection
- **Todo Integration**: TodoWrite available during plan mode; todos persist via file system
- **Compaction Survival**: Both plans and todos re-injected via attachments after compaction
