# Claude Code v2.0.59 - Architecture Analysis (Part 1: Core Modules)

> **Split Documentation:**
> - **Part 1 (this file):** Entry/UI, LLM Core, Tool System (Modules 01-06)
> - **Part 2:** [architecture_ext.md](./architecture_ext.md) - Context, Extensibility, Infrastructure (Modules 07-18)

> **Symbol References:**
> - [symbol_index_core.md](./symbol_index_core.md) - Core execution modules
> - [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Module Summary](#module-summary)
3. [Entry & UI Layer (Modules 01-02)](#entry--ui-layer-modules-01-02)
4. [LLM Core & System Prompts (Modules 03-04)](#llm-core--system-prompts-modules-03-04)
5. [Tool System (Modules 05-06)](#tool-system-modules-05-06)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 ENTRY LAYER                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                         CLI Entry Point (mu3)                                   ││
│  │                       chunks.158.mjs:1438-1462                                  ││
│  │  Fast Paths: --version | --mcp-cli | --ripgrep | Normal → Main Entry (hu3)     ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                        │                                             │
│                    ┌───────────────────┴───────────────────┐                        │
│                    ▼                                       ▼                        │
│  ┌─────────────────────────────────┐    ┌─────────────────────────────────────┐    │
│  │     INTERACTIVE MODE (VG)       │    │    NON-INTERACTIVE MODE (Rw9)       │    │
│  │   React/Ink.js Terminal UI      │    │      Stream JSON I/O / SDK          │    │
│  │   chunks.67/68.mjs              │    │      chunks.156.mjs                 │    │
│  └─────────────────┬───────────────┘    └─────────────────┬───────────────────┘    │
│                    │                                       │                        │
│                    └───────────────────┬───────────────────┘                        │
└────────────────────────────────────────┼────────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────┼────────────────────────────────────────────┐
│                               CORE EXECUTION LAYER                                   │
│                                        ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                         AGENT LOOP (O$) - chunks.146.mjs                        ││
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 ││
│  │  │ LLM API ($E9)   │→│ Tool Executor   │→│ Result Handler  │                 ││
│  │  │ chunks.153.mjs  │  │ EV0/mk3         │  │ Context Mods    │                 ││
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                 ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                        │                                             │
│  ┌─────────────────────────────────────┴─────────────────────────────────────────┐  │
│  │                          TOOL REGISTRY (28+ Built-in)                          │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────────┐ ┌─────────────────┐ │  │
│  │  │ Read │ │ Edit │ │Write │ │ Bash │ │ Glob │ │  Grep   │ │   Task (jn)     │ │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └─────────┘ │  Subagent Tool  │ │  │
│  │  ┌──────┐ ┌──────┐ ┌──────────┐ ┌───────────┐ ┌─────────┐ └─────────────────┘ │  │
│  │  │WebFetch│WebSearch│TodoWrite │ │NotebookEdit│ │ Skill │ ┌─────────────────┐ │  │
│  │  └──────┘ └──────┘ └──────────┘ └───────────┘ └─────────┘ │ EnterPlanMode   │ │  │
│  │                                                             │ ExitPlanMode    │ │  │
│  │                                                             └─────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────┼────────────────────────────────────────────┐
│                                 SUPPORT LAYER                                        │
│         ┌──────────────────────────────┼──────────────────────────────┐              │
│         ▼                              ▼                              ▼              │
│  ┌─────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐  │
│  │   MCP SYSTEM    │    │    HOOK SYSTEM (qa)     │    │   SKILL SYSTEM (ln)     │  │
│  │  D1A, v10, y32  │    │  12 Event Types         │    │  3-Tier Loading         │  │
│  │  - stdio/sse/http    │  PreToolUse, PostToolUse │    │  Token Budget           │  │
│  │  - Tool Integration  │  UserPromptSubmit...     │    │  SKILL.md Files         │  │
│  └─────────────────┘    └─────────────────────────┘    └─────────────────────────┘  │
│         │                              │                              │              │
│  ┌─────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐  │
│  │ SLASH COMMANDS  │    │   SUBAGENT SYSTEM       │    │   PLAN MODE             │  │
│  │ _P2, nf5, kP2   │    │   jn (TaskTool), XY1    │    │   cTA, gq, xq, kWA      │  │
│  │ Serial Queue    │    │   Stateless Subprocesses│    │   State Machine         │  │
│  └─────────────────┘    └─────────────────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────┼────────────────────────────────────────────┐
│                           STATE & PERSISTENCE LAYER                                  │
│         ┌──────────────────────────────┼──────────────────────────────┐              │
│         ▼                              ▼                              ▼              │
│  ┌─────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐  │
│  │ STATE MGMT (yG) │    │   COMPACT SYSTEM        │    │    TODO SYSTEM          │  │
│  │ 18 State Fields │    │   sI2 (dispatcher)      │    │    BY (TodoWriteTool)   │  │
│  │ React Context   │    │   Si (micro), j91 (full)│    │    5-Layer Enforcement  │  │
│  │ Yu (persistence)│    │   Context Restoration   │    │    Hidden Reminders     │  │
│  └─────────────────┘    └─────────────────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────┼────────────────────────────────────────────┐
│                              INFRASTRUCTURE LAYER                                    │
│         ┌──────────────────────────────┼──────────────────────────────┐              │
│         ▼                              ▼                              ▼              │
│  ┌─────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐  │
│  │  CODE INDEXING  │    │     TELEMETRY           │    │      SANDBOX            │  │
│  │  Q05 (TreeSitter)│   │    GA, eu, Hz0, M9      │    │   $44 (init)            │  │
│  │  NO3 (FileIndex) │   │    Multi-Destination    │    │   Tm0 (macOS)           │  │
│  │  WASM + Fuse.js  │   │    429+ Events          │    │   qm0 (Linux)           │  │
│  └─────────────────┘    └─────────────────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Summary

| Module | Category | Key Functions | Primary Responsibility |
|--------|----------|--------------|------------------------|
| **01_cli** | Entry | `mu3`, `hu3`, `VG`, `Rw9` | CLI parsing, mode selection |
| **02_ui** | Entry | `BsA`, Provider chain | Terminal UI, raw mode, focus |
| **03_llm_core** | Core | `$E9`, `t61`, `Kq` | API calls, streaming, retry |
| **04_system_reminder** | Core | `JH5`, `aY`, `kb3` | Attachments, context injection |
| **05_tools** | Core | `wY1`, `EV0`, `mk3` | Tool registry, execution |
| **06_mcp** | Support | `D1A`, `v10`, `y32` | External server integration |
| **07_compact** | State | `sI2`, `Si`, `j91` | Context window management |
| **08_subagent** | Extensibility | `jn`, `XY1` | Spawning child agents |
| **09_slash_command** | Extensibility | `_P2`, `nf5`, `kP2` | Command parsing/execution |
| **10_skill** | Extensibility | `ln`, `XK0`, `OWA` | Custom skill loading |
| **11_hook** | Extensibility | `qa`, `ek3`, `tk3` | Event handlers |
| **12_plan_mode** | Extensibility | `cTA`, `gq`, `xq`, `kWA` | Planning workflow |
| **13_todo_list** | State | `BY`, `_H5`, `Nh` | Task tracking |
| **14_code_indexing** | Infrastructure | `Q05`, `NO3`, `MO3` | File search, Bash parsing |
| **15_state_management** | State | `f0`, `yG`, `OQ`, `Yu` | Global state, persistence |
| **16_file_system** | Infrastructure | (under development) | File operations |
| **17_telemetry** | Infrastructure | `GA`, `eu`, `Hz0`, `M9` | Analytics, error logging |
| **18_sandbox** | Infrastructure | `$44`, `Tm0`, `qm0` | Security isolation |

---

## Entry & UI Layer (Modules 01-02)

### Module 01: CLI Entry Points

#### Entry Point Architecture

**Fast-Path Routing Pattern** - The CLI implements performance-optimized routing to avoid loading heavy modules for simple commands.

```javascript
// ============================================
// mu3() - CLI Entry Point Bootstrap
// Location: chunks.158.mjs:1438-1462
// ============================================

// ORIGINAL (for source lookup):
async function mu3() {
  let A = process.argv.slice(2);
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v")) {
    M9("cli_version_fast_path");
    console.log(`${VERSION} (Claude Code)`);
    return;
  }
  if (bZ() && A[0] === "--mcp-cli") {
    let B = A.slice(1);
    process.exit(await iz9(B));
  }
  if (A[0] === "--ripgrep") {
    M9("cli_ripgrep_path");
    let B = A.slice(1);
    let { ripgrepMain: Q } = await Promise.resolve().then(() => (sz9(), az9));
    process.exitCode = Q(B);
    return;
  }
  M9("cli_before_main_import");
  let { main: Q } = await Promise.resolve().then(() => (tw9(), ow9));
  M9("cli_after_main_import");
  await Q();
  M9("cli_after_main_complete");
}

// READABLE (for understanding):
async function mainEntry() {
  let cliArgs = process.argv.slice(2);

  // Fast path 1: Version (saves ~200ms)
  if (cliArgs.length === 1 && (cliArgs[0] === "--version" || cliArgs[0] === "-v")) {
    emitTelemetry("cli_version_fast_path");
    console.log(`${VERSION} (Claude Code)`);
    return;
  }

  // Fast path 2: MCP CLI server mode
  if (isMcpEnabled() && cliArgs[0] === "--mcp-cli") {
    let mcpArgs = cliArgs.slice(1);
    process.exit(await mcpCliHandler(mcpArgs));
  }

  // Fast path 3: Ripgrep code search
  if (cliArgs[0] === "--ripgrep") {
    emitTelemetry("cli_ripgrep_path");
    let ripgrepArgs = cliArgs.slice(1);
    let { ripgrepMain } = await dynamicImport("ripgrep-module");
    process.exitCode = ripgrepMain(ripgrepArgs);
    return;
  }

  // Normal path: Full application
  emitTelemetry("cli_before_main_import");
  let { main: commandHandler } = await dynamicImport("main-module");
  emitTelemetry("cli_after_main_import");
  await commandHandler();
  emitTelemetry("cli_after_main_complete");
}

// Mapping: mu3→mainEntry, A→cliArgs, Q→commandHandler, M9→emitTelemetry
```

**Why This Design:**
- Dynamic imports prevent loading 10MB+ of modules for simple commands
- Version check completes in <100ms vs ~500ms for full initialization
- Telemetry markers enable startup performance profiling

#### CLI Option Categories (35+ Options)

| Category | Options | Purpose |
|----------|---------|---------|
| **Debug** | `--debug`, `--verbose`, `--quiet` | Development & logging |
| **Mode** | `--print`, `--output-format`, `--input-format` | Interactive vs non-interactive |
| **Model** | `--model`, `--fallback-model`, `--agent` | LLM selection |
| **Session** | `--continue`, `--resume`, `--fork-session` | Conversation persistence |
| **Tools** | `--tools`, `--allowed-tools`, `--disallowed-tools` | Tool filtering |
| **Permissions** | `--permission-mode`, `--dangerously-skip-permissions` | Security controls |
| **MCP** | `--mcp-config`, `--strict-mcp-config` | Server configuration |
| **Prompts** | `--system-prompt`, `--append-system-prompt` | Prompt customization |

#### Configuration Merge Priority

```
CLI Flags (--model, --tools)          ← Highest Priority
    ↓
Environment Variables (ANTHROPIC_MODEL)
    ↓
Local Settings (.claude/settings.local.json)
    ↓
Project Settings (.claude/settings.json)
    ↓
User Settings (~/.config/claude/settings.json)
    ↓
Built-in Defaults                     ← Lowest Priority
```

---

### Module 02: UI Components (Ink-based React)

#### Provider Chain Architecture

The UI implements a 6-layer React provider chain for comprehensive terminal UI management:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Terminal Provider (Q$A)                                     │
│     └── columns, rows from stdout                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. Ink2 Provider (k_)                                   │  │
│  │     └── v2 compatibility layer                           │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │  3. Exit Provider (daA)                           │   │  │
│  │  │     └── handleExit callback                       │   │  │
│  │  │  ┌────────────────────────────────────────────┐   │   │  │
│  │  │  │  4. Theme Provider (og1)                   │   │   │  │
│  │  │  │     └── setTheme, currentTheme             │   │   │  │
│  │  │  │  ┌─────────────────────────────────────┐   │   │   │  │
│  │  │  │  │  5. Stdin Provider (caA)            │   │   │   │  │
│  │  │  │  │     └── stdin, setRawMode           │   │   │   │  │
│  │  │  │  │  ┌──────────────────────────────┐   │   │   │   │  │
│  │  │  │  │  │  6. Focus Provider (paA)     │   │   │   │   │  │
│  │  │  │  │  │     └── activeId, focusables │   │   │   │   │  │
│  │  │  │  │  │     <App Component Tree />   │   │   │   │   │  │
│  │  │  │  │  └──────────────────────────────┘   │   │   │   │  │
│  │  │  │  └─────────────────────────────────────┘   │   │   │  │
│  │  │  └────────────────────────────────────────────┘   │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### Raw Mode Reference Counting

**Key Insight:** Multiple components can enable raw mode simultaneously without conflicts.

```javascript
// ============================================
// Raw Mode Reference Counting Pattern
// Location: chunks.68.mjs (InternalApp)
// ============================================

// READABLE (for understanding):
class RawModeManager {
  private referenceCount: number = 0;
  private stdin: NodeJS.ReadStream;

  setRawMode(enable: boolean): void {
    if (enable) {
      this.referenceCount++;
      if (this.referenceCount === 1) {
        // First enable request - actually enable
        this.stdin.setRawMode(true);
        // Enable bracketed paste mode
        process.stdout.write('\x1B[?2004h');
      }
    } else {
      this.referenceCount = Math.max(0, this.referenceCount - 1);
      if (this.referenceCount === 0) {
        // Last disable request - actually disable
        this.stdin.setRawMode(false);
        // Disable bracketed paste mode
        process.stdout.write('\x1B[?2004l');
      }
    }
  }
}
```

#### Focus Navigation System

```javascript
// Focus state machine
const focusHandlers = {
  Tab: () => focusNext(),           // HF6
  'Shift+Tab': () => focusPrevious(), // CF6
  Escape: () => deactivateFocus()    // EF6
};

// Only active when: isFocusEnabled && focusables.length > 0
```

#### Keyboard Input State Machine

```
Normal Mode (S$B = 0)
    │
    ├── Regular character → Process immediately
    │
    └── ESC received → Enter Escape Mode
                           │
                           ├── Timeout (50ms) → Single ESC
                           │
                           └── More chars → Parse sequence
                                   │
                                   ├── [A → Arrow Up
                                   ├── [B → Arrow Down
                                   ├── [C → Arrow Right
                                   └── [D → Arrow Left
```

---

## LLM Core & System Prompts (Modules 03-04)

### Module 03: LLM API Calling

#### 5-Phase API Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: PRE-PROCESSING                       │
│  1. Check tengu off-switch                                       │
│  2. Build tool schemas from registry                             │
│  3. Normalize messages (merge consecutive user messages)         │
│  4. Apply prompt caching breakpoints                             │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2: CLIENT CREATION                      │
│  Provider detection: Anthropic | Bedrock | Vertex | Foundry      │
│  Create appropriate API client (Kq)                              │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 3: RETRY WRAPPER (t61)                  │
│  Exponential backoff: 500ms × 2^(attempt-1), max 32s + jitter   │
│  Max retries: 10 | Retryable: 401, 408, 409, 429, 5xx           │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 4: STREAMING RESPONSE                   │
│  Events: message_start → content_block_delta → message_stop     │
│  Yield assistant messages to caller as they complete            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 5: ANALYTICS & CLEANUP                  │
│  Track: usage tokens, cost, latency, TTFT                       │
│  Cleanup stream on abort/error                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Prompt Caching Strategy

**Critical Algorithm** - Strategic cache_control placement for optimal performance:

```javascript
// ============================================
// applyMessageCacheBreakpoints - Prompt Caching
// Location: chunks.153.mjs:406-413
// ============================================

// READABLE (for understanding):
function applyPromptCaching(messages) {
  const KEEP_UNCACHED = 3; // Last 3 messages stay dynamic

  return messages.map((message, index) => {
    const isRecentMessage = index >= messages.length - KEEP_UNCACHED;

    if (isRecentMessage) {
      // Recent messages: NO cache_control (allow dynamic updates)
      return message;
    }

    // Earlier messages: ADD cache_control for caching
    return {
      ...message,
      content: addCacheControlToContent(message.content, "ephemeral")
    };
  });
}

// System prompts: ALL get ephemeral cache_control
function applySystemCaching(systemPrompts) {
  return systemPrompts.map(prompt => ({
    ...prompt,
    cache_control: { type: "ephemeral" }
  }));
}
```

**Why 3 Messages Uncached:**
1. Room for next user message without immediate cache invalidation
2. Space for dynamic system reminders
3. Margin for token estimation inaccuracies

#### Model-Specific Max Output Tokens

```javascript
const MAX_OUTPUT_TOKENS = {
  'claude-3-opus': 4096,
  'claude-3-5-sonnet': 8192,
  'claude-3-sonnet': 8192,
  'claude-sonnet-4': 64000,
  'claude-opus-4-5': 64000,  // Highest
  'claude-haiku-4': 64000,
  'default': 32000
};
```

#### Retry Logic with Exponential Backoff

```javascript
// ============================================
// t61 - Retry Wrapper with Exponential Backoff
// Location: chunks.121.mjs:1988-2046
// ============================================

// READABLE (for understanding):
async function* withRetry(operation, options) {
  const MAX_RETRIES = 10;
  const BASE_DELAY_MS = 500;
  const MAX_DELAY_MS = 32000;
  const JITTER_FACTOR = 0.25;

  let overloadCount = 0;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      yield* operation();
      return; // Success
    } catch (error) {
      if (!isRetryable(error)) throw error;

      // Track overload errors for fallback model
      if (isOverloadError(error)) {
        overloadCount++;
        if (overloadCount >= 3) {
          throw new FallbackTriggeredError("Model overloaded");
        }
      }

      // Calculate delay with exponential backoff + jitter
      const baseDelay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), MAX_DELAY_MS);
      const jitter = baseDelay * JITTER_FACTOR * Math.random();
      const delay = baseDelay + jitter;

      await sleep(delay);
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} retries`);
}

// Retryable status codes
function isRetryable(error) {
  const retryableCodes = [401, 408, 409, 429, 500, 502, 503, 504, 529];
  return retryableCodes.includes(error.status);
}
```

#### Context Window Overflow Auto-Recovery

```javascript
// Auto-recovery when hitting context limits
if (errorMessage.includes("input length and `max_tokens` exceed context limit")) {
  // Recalculate available tokens
  const availableForOutput = contextLimit - inputTokens - 1000; // 1000 buffer

  // Retry with adjusted max_tokens
  options.maxTokensOverride = availableForOutput;
  continue; // Retry loop
}
```

---

### Module 04: System Reminder Mechanism

#### 3-Tier Attachment Generation System

```javascript
// ============================================
// JH5 - generateAllAttachments
// Location: chunks.107.mjs:1813-1829
// ============================================

// READABLE (for understanding):
async function* generateAllAttachments(context, options) {
  const TIMEOUT_MS = 1000; // 1 second max

  // Tier 1: User Prompt Attachments (if user input exists)
  if (context.hasUserInput) {
    yield* withTimeout([
      generateMentionedFiles(context),      // @file mentions
      generateMcpResources(context),        // MCP resources
      generateAgentMentions(context)        // Agent references
    ], TIMEOUT_MS);
  }

  // Tier 2: Core Attachments (always checked)
  yield* withTimeout([
    generateChangedFiles(context),          // wH5 - file modifications
    generateNestedMemory(context),          // qH5 - session memory
    generatePlanMode(context),              // VH5 - workflow guidance
    generateTodoReminders(context),         // _H5 - periodic nudges
    generateTeammateMailbox(context),       // vH5 - async messages
    generateCriticalReminder(context)       // FH5 - always-on reminders
  ], TIMEOUT_MS);

  // Tier 3: Main Agent Only (if primary agent)
  if (context.isMainAgent) {
    yield* withTimeout([
      generateIdeSelection(context),
      generateDiagnostics(context),
      generateBackgroundShells(context),
      generateAsyncHookResponses(context),
      generateMemory(context),
      generateTokenUsage(context),
      generateBudget(context),
      generateAsyncAgents(context)
    ], TIMEOUT_MS);
  }
}
```

#### Error Handling Wrapper (aY)

```javascript
// ============================================
// aY - wrapWithErrorHandling
// Location: chunks.107.mjs:1832-1856
// ============================================

// READABLE (for understanding):
function wrapWithErrorHandling(generators) {
  return generators.map(generator => async function* () {
    try {
      yield* generator();
    } catch (error) {
      // Log error at 5% sampling rate
      if (Math.random() < 0.05) {
        logTelemetry("attachment_generator_error", { error: error.message });
      }

      // Return empty array instead of throwing
      // One failing generator doesn't cascade
      return [];
    }
  });
}
```

**Key Design Principles:**
1. **Graceful Failure** - Returns empty array instead of throwing
2. **Performance Telemetry** - 5% sampling rate
3. **Timeout Protection** - 1 second max for all attachments
4. **Isolation** - One failing generator doesn't cascade

#### Changed Files Detection (wH5)

```javascript
// Track modification time of previously-read files
// Generate unified diffs with line numbers
function* generateChangedFiles(context) {
  for (const [filePath, originalContent] of context.readFiles) {
    if (hasBeenModified(filePath)) {
      const currentContent = await readFile(filePath);
      const diff = generateUnifiedDiff(originalContent, currentContent, filePath);

      yield createAttachment({
        type: "edited_text_file",
        path: filePath,
        diff: diff
      });
    }
  }
}
```

#### Todo Reminders Timing Logic

```javascript
// ============================================
// _H5 - generateTodoReminders
// Location: chunks.107.mjs:2379-2394
// ============================================

const TODO_TURNS_SINCE_WRITE = 7;    // Min turns before reminder
const TODO_TURNS_BETWEEN_REMINDERS = 3; // Min turns between reminders

function* generateTodoReminders(context) {
  const turnsSinceLastWrite = countTurnsSinceTodoWrite(context.messages);
  const turnsSinceLastReminder = countTurnsSinceLastReminder(context.messages);

  // Only show if:
  // 1. 7+ turns since last TodoWrite use AND
  // 2. 3+ turns since last reminder
  if (turnsSinceLastWrite >= TODO_TURNS_SINCE_WRITE &&
      turnsSinceLastReminder >= TODO_TURNS_BETWEEN_REMINDERS) {
    yield createAttachment({
      type: "todo",
      content: formatCurrentTodoList(context.todos),
      isMeta: true  // Hidden from user
    });
  }
}
```

---

## Tool System (Modules 05-06)

### Module 05: Tool Calling System

#### Tool Registry (28+ Built-in Tools)

```javascript
// ============================================
// wY1 - getBuiltinTools
// Location: chunks.146.mjs:891-893
// ============================================

const BUILTIN_TOOLS = {
  // File Operations
  Read: { concurrencySafe: true, requiresApproval: false },
  Edit: { concurrencySafe: false, requiresApproval: true },
  Write: { concurrencySafe: false, requiresApproval: true },
  Glob: { concurrencySafe: true, requiresApproval: false },
  Grep: { concurrencySafe: true, requiresApproval: false },

  // Execution
  Bash: { concurrencySafe: 'conditional', requiresApproval: true },
  BashOutput: { concurrencySafe: true, requiresApproval: false },
  KillShell: { concurrencySafe: false, requiresApproval: false },

  // Agent System
  Task: { concurrencySafe: false, requiresApproval: false },
  Skill: { concurrencySafe: false, requiresApproval: false },
  SlashCommand: { concurrencySafe: false, requiresApproval: false },
  AgentOutput: { concurrencySafe: true, requiresApproval: false },

  // Web
  WebFetch: { concurrencySafe: true, requiresApproval: false },
  WebSearch: { concurrencySafe: true, requiresApproval: false },

  // Planning
  EnterPlanMode: { concurrencySafe: false, requiresApproval: true },
  ExitPlanMode: { concurrencySafe: false, requiresApproval: false },

  // Notebooks
  NotebookEdit: { concurrencySafe: false, requiresApproval: true },

  // Task Management
  TodoWrite: { concurrencySafe: true, requiresApproval: false },

  // User Interaction
  AskUserQuestion: { concurrencySafe: false, requiresApproval: false }
};
```

#### Concurrency Grouping Algorithm (mk3)

**Key Algorithm** - O(1) single pass to determine parallel vs serial execution:

```javascript
// ============================================
// mk3 - groupToolsByConcurrency
// Location: chunks.146.mjs:2154-2166
// ============================================

// READABLE (for understanding):
function groupToolsByConcurrency(toolUseBlocks) {
  const groups = [];
  let currentGroup = { safe: true, tools: [] };

  for (const toolUse of toolUseBlocks) {
    const tool = getToolDefinition(toolUse.name);
    const parsedInput = parseWithZod(toolUse.input, tool.inputSchema);
    const isSafe = tool.isConcurrencySafe(parsedInput);

    if (isSafe && currentGroup.safe) {
      // Add to current safe group
      currentGroup.tools.push(toolUse);
    } else {
      // Flush current group and start new one
      if (currentGroup.tools.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = { safe: isSafe, tools: [toolUse] };
    }
  }

  // Flush final group
  if (currentGroup.tools.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

// Concurrency-Safe Tools:
// - Read, Glob, Grep, WebFetch, WebSearch
// - Bash (only if read-only command)
// - TodoWrite

// Non-Safe Tools (create execution boundaries):
// - Write, Edit, Bash (write), NotebookEdit
```

#### Parallel Execution with Bounded Concurrency

```javascript
// ============================================
// SYA - parallelGeneratorWithLimit
// Location: chunks.107.mjs:2626-2659
// ============================================

// READABLE (for understanding):
async function* parallelGeneratorWithLimit(generators, maxConcurrency = 10) {
  const activePromises = new Map();
  let nextId = 0;

  // Fill initial concurrency window
  for (let i = 0; i < Math.min(maxConcurrency, generators.length); i++) {
    const id = nextId++;
    activePromises.set(id, wrapGenerator(generators[i], id));
  }

  // Process as they complete
  while (activePromises.size > 0) {
    // Wait for first to complete
    const { id, result, done } = await Promise.race(
      Array.from(activePromises.values())
    );

    if (done) {
      activePromises.delete(id);

      // Add next generator if available
      if (nextId < generators.length) {
        const newId = nextId++;
        activePromises.set(newId, wrapGenerator(generators[newId], newId));
      }
    } else {
      yield result;  // Stream result to caller
    }
  }
}

// Default max: 10 concurrent tools
// Configurable via CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY
```

#### Serial vs Parallel Execution Difference

```
PARALLEL EXECUTION:
┌─────────────────────────────────────────────────────────────┐
│  [Tool A] ─────▶ Result A                                   │
│  [Tool B] ─────▶ Result B     } All modifiers collected     │
│  [Tool C] ─────▶ Result C     } then applied after batch    │
└─────────────────────────────────────────────────────────────┘

SERIAL EXECUTION:
┌─────────────────────────────────────────────────────────────┐
│  [Tool A] ─▶ Result A ─▶ Apply Modifiers                   │
│                              ↓                              │
│  [Tool B] ─▶ Result B ─▶ Apply Modifiers (sees A's result) │
│                              ↓                              │
│  [Tool C] ─▶ Result C ─▶ Apply Modifiers (sees A+B)        │
└─────────────────────────────────────────────────────────────┘
```

---

### Module 06: MCP (Model Context Protocol)

#### MCP Client Architecture

```javascript
// ============================================
// D1A - connectSingleMcpServer
// Location: chunks.101.mjs:2309-2341
// ============================================

// READABLE (for understanding):
async function connectSingleMcpServer(serverConfig, options) {
  // Step 1: Initialize server (pre-connection setup)
  const initializedServer = await initializeMcpServer(serverConfig);

  // Step 2: Establish transport connection
  const transport = createTransport(serverConfig.transportType, serverConfig);
  await transport.connect({ timeout: getMCPConnectionTimeout() }); // Default: 30s

  // Step 3: Check capabilities
  const capabilities = await client.getCapabilities();
  const hasTools = capabilities.includes('tools');
  const hasPrompts = capabilities.includes('prompts');
  const hasResources = capabilities.includes('resources');

  // Step 4: Fetch all capabilities in parallel
  const [tools, prompts, resources] = await Promise.all([
    hasTools ? client.listTools() : [],
    hasPrompts ? client.listPrompts() : [],
    hasResources ? client.listResources() : []
  ]);

  // Step 5: Add resource helper tools if needed
  if (hasResources && !options.resourceToolsAdded) {
    tools.push(readResourceTool, refreshResourcesTool);
    options.resourceToolsAdded = true;
  }

  return { client, tools, prompts, resources };
}
```

#### Configuration Scopes Priority

```
1. Enterprise (system policy)    ← OVERRIDES ALL if exists
   ↓
2. Local (.claude.local.json)
   ↓
3. Project (.mcp.json)           ← Walks up directory tree
   ↓
4. User (~/.config/claude/settings.json)
   ↓
5. Dynamic (--mcp-config CLI flag)
```

**Key Decision:** Enterprise config ONLY uses enterprise servers - all other scopes ignored when enterprise exists.

#### Transport Types

| Type | Use Case | Config Fields |
|------|----------|---------------|
| `stdio` | Local processes | `command`, `args`, `env` |
| `sse` | HTTP server | `url`, `headers` |
| `http` | Request-response | `url`, `headers` |
| `sse-ide` | IDE integration | `url` + IDE config |
| `ws-ide` | WebSocket IDE | `url` + IDE config |

#### MCP Tool Calling with Progress Monitoring

```javascript
// ============================================
// y32 - callMcpTool
// Location: chunks.101.mjs:2523-2568
// ============================================

// READABLE (for understanding):
async function callMcpTool(client, toolName, args, abortSignal) {
  const PROGRESS_INTERVAL_MS = 30000; // Log every 30 seconds

  logMcpDebug(`Calling MCP tool: ${toolName}`);

  // Setup progress monitoring for long-running tools
  const progressInterval = setInterval(() => {
    logMcpDebug(`Still waiting for ${toolName}...`);
  }, PROGRESS_INTERVAL_MS);

  try {
    const result = await client.callTool(toolName, args, {
      timeout: getMCPToolTimeout(), // Default: ~27 hours
      signal: abortSignal
    });

    // Check for tool-level errors
    if (result.isError) {
      const errorText = result.content?.[0]?.text || result.error || "Unknown error";
      throw new McpToolError(errorText);
    }

    // Process and potentially truncate result
    return processMcpResult(result);

  } finally {
    clearInterval(progressInterval);
  }
}
```

#### Large Result Handling

**Two-Tier Token Check:**

```javascript
// ============================================
// $e1 - exceedsTokenLimit
// Location: chunks.94.mjs:341-356
// ============================================

// READABLE (for understanding):
async function exceedsTokenLimit(content) {
  const MAX_TOKENS = 25000;
  const THRESHOLD = MAX_TOKENS * 0.5; // 50% = 12,500 tokens

  // Tier 1: Quick approximation (chars / 4)
  const approximateTokens = countCharacters(content) / 4;

  if (approximateTokens < THRESHOLD) {
    return false; // Definitely under
  }

  if (approximateTokens > MAX_TOKENS * 1.5) {
    return true; // Definitely over
  }

  // Tier 2: Precise API token counting for edge cases
  try {
    const preciseCount = await apiCountTokens(content);
    return preciseCount > MAX_TOKENS;
  } catch (error) {
    // On error, don't truncate (fail open)
    return false;
  }
}
```

#### Dynamic Tool Naming

```javascript
// Pattern: mcp__{serverName}__{toolName}
// Example: mcp__github__create_issue (original: "create-issue")

function normalizeToolName(serverName, toolName) {
  const normalized = toolName.replace(/-/g, '_');
  return `mcp__${serverName}__${normalized}`;
}

// Benefits:
// - Prevents conflicts between servers with same tool names
// - Clear provenance in logs and telemetry
// - Enables server-specific permission rules
```

---

> **Continue to Part 2:** [architecture_ext.md](./architecture_ext.md) for Context Management, Extensibility, and Infrastructure modules.
