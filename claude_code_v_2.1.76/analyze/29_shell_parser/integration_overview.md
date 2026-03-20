# Shell Parser Integration Overview (Claude Code 2.1.76)

> Analysis of how the shell parser module integrates with Tools, System Reminder, Compact, and Slash Commands.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell Parser section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key integration functions:
- `runSecurityChecksSync` (Rp6) - Main security validation entry point (sync, no tree-sitter)
- `runSecurityChecksAsync` (O01) - Main security validation entry point (async, with tree-sitter)
- `bashPreFlightCheck` (nGq) - LLM-based prefix extraction (via QGq factory)
- `extractPrefixCached` (pr6) - Memoized prefix extraction wrapper (via UGq factory)
- `checkBashPermissions` (Tn8) - Main Bash tool permission checker (async)
- `runBashSecurityChecks` - Security check function (called from Tn8)

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INTEGRATION OVERVIEW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      05_tools / Bash Tool                           │    │
│  │                                                                     │    │
│  │   LLM generates Bash tool_use { command }                          │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   checkBashPermissions (Tn8) ──────> Main permission pipeline      │    │
│  │       ├── runBashSecurityChecks ────> Security checks               │    │
│  │       ├── extractPrefixCached (pr6) > Prefix for permission        │    │
│  │       └── vfq() ───────────────────> Subcommand analysis           │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   runSecurityChecksAsync (O01) ────> "passthrough" / "ask"         │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   Tool execution ──> Progress callback ──> Progress events         │    │
│  │                                                                     │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                            │
│                                 │ Progress events                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   04_system_reminder / Attachments                  │    │
│  │                                                                     │    │
│  │   Progress handler (chunks.146.mjs:1162)                           │    │
│  │       ├── Throttle: yxY (30s interval)                             │    │
│  │       ├── Cache: Zi6 (Map, max ExY=100 entries)                    │    │
│  │       └── Remote/container only emission                           │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   Tool progress message ──> <system-reminder> tags                 │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      07_compact / Session Memory                    │    │
│  │                                                                     │    │
│  │   Compaction may need to:                                          │    │
│  │   - Extract commands from bash tool results                        │    │
│  │   - Parse compound commands for summarization                      │    │
│  │                                                                     │    │
│  │   Uses: parseShellCommand (bW6), extractSubcommands (EO)           │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    09_slash_command / Skills                        │    │
│  │                                                                     │    │
│  │   Skills invoked via /skill-name args                              │    │
│  │   Some skills may include shell command templates                  │    │
│  │                                                                     │    │
│  │   Integration: Shell parser validates skill-generated commands     │    │
│  │   when they use Bash tool internally                               │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration with 05_tools / Bash Tool

### Entry Point Flow

The Bash tool is the primary consumer of the shell parser. When the LLM generates a Bash tool use:

```javascript
// ============================================
// Bash Tool Permission Check Flow
// Location: chunks.172.mjs:1930-2080
// ============================================

// ORIGINAL (for source lookup):
async function Tn8(A, q, K = pr6) {
    let Y = q.getAppState(),
        _ = t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? {
            kind: "parse-unavailable"
        } : await Dfq(A.command),
        w = null, O, $;
    // ... security checks and permission decision logic ...
    let j = await vfq(A, (B) => Tn8(B, q, K), {
        isNormalizedCdCommand: Sn8,
        isNormalizedGitCommand: G01
    });
    // ... return behavior: "allow" | "ask" | "passthrough" ...
}

// READABLE (for understanding):
async function checkBashPermissions(input, sessionContext, prefixExtractor = extractPrefixCached) {
    let appState = sessionContext.getAppState();

    // Step 1: Parse command (tree-sitter or fallback to shell-quote)
    let parseResult = process.env.DISABLE_COMMAND_INJECTION_CHECK
        ? { kind: "parse-unavailable" }
        : await parseCommandTreeSitter(input.command);

    // Step 2: Handle parse failures / complex commands
    if (parseResult.kind === "too-complex") {
        // Request user approval with explanation
        return { behavior: "ask", decisionReason: {...} };
    }

    // Step 3: Security checks via runBashSecurityChecks
    let securityResult = await runBashSecurityChecks(input.command);

    // Step 4: Subcommand analysis for compound commands
    let subcommandResult = await analyzeSubcommands(input, recursiveChecker, {
        isNormalizedCdCommand: isCdCommand,
        isNormalizedGitCommand: isGitCommand
    });

    // Step 5: Permission decision
    return { behavior: "allow" | "ask" | "passthrough", ... };
}

// Mapping: Tn8→checkBashPermissions, A→input, q→sessionContext, K→prefixExtractor,
//          pr6→extractPrefixCached, Dfq→parseCommandTreeSitter, dr6→runSecurityChecks,
//          vfq→analyzeSubcommands, Sn8→isCdCommand, G01→isGitCommand
```

### Security Pipeline Integration

The security pipeline is called through `checkBashPermissions` (Tn8):

| Phase | Function | Purpose | Result |
|-------|----------|---------|--------|
| 1 | `Dfq` | Tree-sitter AST parsing | Parsed command structure |
| 2 | `dr6` | Security validation | "passthrough" / "ask" / "allow" |
| 3 | `extractPrefixCached` (pr6) | LLM-based prefix extraction | Command prefix for permission matching |
| 4 | `vfq` | Subcommand analysis | Per-subcommand permission decision |

### Prefix Extraction for Permissions

**Why LLM-based?** Shell commands have complex syntax that's difficult to parse with regex:

```bash
# Examples of complex prefix extraction:
GOEXPERIMENT=synctest go test -v ./...   # Prefix: "GOEXPERIMENT=synctest go test"
npm run lint -- "foo"                     # Prefix: "npm run lint"
git diff $(cat secrets)                   # Injection detected!
```

The `bashPreFlightCheck` (nGq) returns:
- A prefix string (e.g., `"git commit"`) → match against user's allowed list
- `"none"` → command has no meaningful prefix
- `"command_injection_detected"` → force user approval

The `extractPrefixCached` (pr6) wrapper provides memoization to avoid redundant LLM calls.

### Progress Streaming Integration

Long-running bash commands emit progress events through the reminder system:

```javascript
// ============================================
// Bash Progress Handler - Progress event generator
// Location: chunks.146.mjs:1162-1182
// ============================================

// ORIGINAL (for source lookup):
} else if (A.data.type === "bash_progress" || A.data.type === "powershell_progress") {
    if (!t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
    let q = A.parentToolUseID,
        K = Date.now(),
        Y = Zi6.get(q) || 0;
    if (K - Y >= yxY) {
        if (Zi6.size >= ExY) {
            let _ = Zi6.keys().next().value;
            if (_ !== void 0) Zi6.delete(_)
        }
        Zi6.set(q, K), yield {
            type: "tool_progress",
            tool_use_id: A.toolUseID,
            tool_name: A.data.type === "bash_progress" ? "Bash" : "PowerShell",
            parent_tool_use_id: A.parentToolUseID,
            elapsed_time_seconds: A.data.elapsedTimeSeconds,
            task_id: A.data.taskId,
            session_id: R1(),
            uuid: A.uuid
        }
    }
}

// READABLE (for understanding):
} else if (event.data.type === "bash_progress" || event.data.type === "powershell_progress") {
    // Only emit in remote/container environments
    if (!isRemoteEnv(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;

    let parentId = event.parentToolUseID;
    let now = Date.now();
    let lastEmitTime = progressCache.get(parentId) || 0;

    // Throttle: only emit every PROGRESS_THROTTLE_INTERVAL_MS (yxY = 30000ms = 30s)
    if (now - lastEmitTime >= PROGRESS_THROTTLE_INTERVAL_MS) {
        // LRU eviction when cache exceeds MAX_PROGRESS_CACHE_SIZE (ExY = 100)
        if (progressCache.size >= MAX_PROGRESS_CACHE_SIZE) {
            let oldestKey = progressCache.keys().next().value;
            if (oldestKey !== void 0) progressCache.delete(oldestKey);
        }
        progressCache.set(parentId, now);
        yield {
            type: "tool_progress",
            tool_use_id: event.toolUseID,
            tool_name: event.data.type === "bash_progress" ? "Bash" : "PowerShell",
            parent_tool_use_id: event.parentToolUseID,
            elapsed_time_seconds: event.data.elapsedTimeSeconds,
            task_id: event.data.taskId,
            session_id: getSessionId(),
            uuid: event.uuid
        };
    }
}

// Mapping: A→event, Zi6→progressCache, yxY→PROGRESS_THROTTLE_INTERVAL_MS (30000),
//          ExY→MAX_PROGRESS_CACHE_SIZE (100), t6→isRemoteEnv, R1→getSessionId
```

**Key design decisions:**
1. **Remote-only emission**: Progress only sent in `CLAUDE_CODE_REMOTE` or `CLAUDE_CODE_CONTAINER_ID` environments
2. **Time-based throttling**: 30-second interval (`yxY = 30000`) prevents message flooding
3. **LRU cache eviction**: Max 100 entries (`ExY = 100`) bounds memory for progress tracking
4. **Per-tool tracking**: `Zi6` Map stores last emit time per parent tool use ID

---

## Integration with 04_system_reminder / Attachments

### Progress Attachment Creation

Progress events from bash commands flow through the message processing pipeline:

```javascript
// ============================================
// Progress Event Generation
// Location: chunks.172.mjs:247-266
// ============================================

// ORIGINAL (for source lookup):
z({
    toolUseID: `bash-progress-${M++}`,
    data: {
        type: "bash_progress",
        output: Q.output,
        fullOutput: Q.fullOutput,
        elapsedTimeSeconds: Q.elapsedTimeSeconds,
        totalLines: Q.totalLines,
        totalBytes: Q.totalBytes,
        taskId: Q.taskId,
        timeoutMs: Q.timeoutMs
    }
})

// READABLE (for understanding):
progressCallback({
    toolUseID: `bash-progress-${counter++}`,
    data: {
        type: "bash_progress",
        output: chunk.output,
        fullOutput: chunk.fullOutput,
        elapsedTimeSeconds: chunk.elapsedTimeSeconds,
        totalLines: chunk.totalLines,
        totalBytes: chunk.totalBytes,
        taskId: chunk.taskId,
        timeoutMs: chunk.timeoutMs
    }
});

// Mapping: z→progressCallback, M→counter, Q→chunk
```

### Attachment Flow to LLM

```
Bash tool executes
    │
    ├── Progress callback fires (chunks.172.mjs:247)
    │       │
    │       ▼
    ├── Progress type check (chunks.146.mjs:1162)
    │       │ Check: bash_progress or powershell_progress
    │       │ Remote/container environment check
    │       │ Throttle check (30s interval)
    │       ▼
    ├── Yield tool_progress event
    │       │
    │       ▼
    ├── Message stream enqueue
    │       │
    │       ▼
    └── <system-reminder> injected into LLM conversation
```

**Why this matters:** The LLM can see that a long-running command is still executing, enabling it to wait appropriately or inform the user of progress.

---

## Integration with 07_compact / Session Memory

### Command Extraction for Summarization

When compacting conversations, the system may need to extract and summarize bash commands:

```javascript
// ============================================
// Command extraction utilities
// Location: chunks.171.mjs
// ============================================

// extractSubcommands (EO) - Split compound commands
// Input: "npm test && git push"
// Output: ["npm test", "git push"]

// ORIGINAL (for source lookup):
function EO(A) {
    let q = bW6(A),
        K = [];
    for (let Y of q)
        if (Y.type === "word") K.push(Y.value);
        else if (Y.type === "operator" && !["|", "&&", "||", ";"].includes(Y.value)) {
            // Skip redirection operators
        }
    return K
}

// READABLE (for understanding):
function extractSubcommands(command) {
    let tokens = parseShellCommand(command);
    let subcommands = [];
    for (let token of tokens) {
        if (token.type === "word") {
            subcommands.push(token.value);
        } else if (token.type === "operator") {
            // Skip redirection operators like >, >>, 2>&1
            // Keep separator operators: &&, ||, ;, |
        }
    }
    return subcommands;
}

// Mapping: EO→extractSubcommands, A→command, bW6→parseShellCommand

// parseShellCommand (bW6) - Full tokenization with heredoc safety
// Location: chunks.171.mjs:1139
function parseShellCommand(command) {
    // 1. Generate random hex sentinels
    let sentinels = generateSentinels();

    // 2. Extract heredocs → placeholders
    let { processedCommand, heredocs } = extractHeredocs(command, sentinels);

    // 3. Handle line continuations
    // 4. Replace quotes with sentinels
    // 5. Tokenize with external shell parser
    // 6. Restore heredocs and quotes

    return tokens;
}

// Mapping: bW6→parseShellCommand, iGq→generateSentinels, ca→extractHeredocs
```

### Use Cases in Compaction

1. **Command summarization**: Extract the base command for summary
2. **Compound command handling**: Identify all subcommands in `cmd1 && cmd2`
3. **Heredoc content handling**: Preserve heredoc boundaries during summarization

---

## Integration with 09_slash_command / Skills

### Skill-Generated Commands

Skills may generate bash commands as part of their execution. These commands go through the same security pipeline:

```
User invokes skill: /deploy production
        │
        ▼
Skill execution generates: "npm run build && npm run deploy"
        │
        ▼
Bash tool checkPermissions() called
        │
        ├── checkBashPermissions (Tn8)
        │       ├── dr6() - Security checks
        │       ├── extractPrefixCached (pr6) - Prefix extraction
        │       └── vfq() - Subcommand analysis
        │
        ▼
Permission prompt or auto-allow
```

### No Direct Shell Parser Integration

The slash command system does not directly call shell parser functions. Instead:
1. Skills generate bash commands via the Bash tool
2. The Bash tool internally uses the shell parser for security
3. This indirection ensures all commands are validated consistently

---

## Deep Analysis: Progress Throttling Mechanism

### Architecture Overview

The progress throttling system ensures that long-running bash commands don't flood the message stream with progress events. It uses a time-based throttle with LRU cache eviction.

### Constants

```javascript
// ============================================
// Progress Throttling Constants
// Location: chunks.146.mjs:1321-1325
// ============================================

// ORIGINAL (for source lookup):
kxY = 10    // LRU cache max size (unused, kept for compatibility)
ExY = 100   // Maximum cache entries
yxY = 30000 // Throttle interval in milliseconds (30 seconds)
Zi6 = new Map()  // Cache: toolUseID → lastEmitTime

// READABLE (for understanding):
const MAX_PROGRESS_CACHE_SIZE = 100;        // ExY
const PROGRESS_THROTTLE_INTERVAL_MS = 30000; // yxY (30 seconds)
let progressCache = new Map();               // Zi6

// Mapping: ExY→MAX_PROGRESS_CACHE_SIZE, yxY→PROGRESS_THROTTLE_INTERVAL_MS,
//          Zi6→progressCache
```

### Progress Handler Logic

**Location:** chunks.146.mjs:1162-1182

```javascript
// ============================================
// Progress Event Handler - Throttled progress event generator
// Location: chunks.146.mjs:1162-1182
// ============================================

// ORIGINAL (for source lookup):
} else if (A.data.type === "bash_progress" || A.data.type === "powershell_progress") {
    if (!t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
    let q = A.parentToolUseID,
        K = Date.now(),
        Y = Zi6.get(q) || 0;
    if (K - Y >= yxY) {
        if (Zi6.size >= ExY) {
            let _ = Zi6.keys().next().value;
            if (_ !== void 0) Zi6.delete(_)
        }
        Zi6.set(q, K), yield {
            type: "tool_progress",
            tool_use_id: A.toolUseID,
            tool_name: A.data.type === "bash_progress" ? "Bash" : "PowerShell",
            parent_tool_use_id: A.parentToolUseID,
            elapsed_time_seconds: A.data.elapsedTimeSeconds,
            task_id: A.data.taskId,
            session_id: R1(),
            uuid: A.uuid
        }
    }
}

// READABLE (for understanding):
} else if (event.data.type === "bash_progress" || event.data.type === "powershell_progress") {
    // STEP 1: Environment check - only emit in remote/container environments
    if (!isRemoteEnv(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) {
        break;  // Skip progress event entirely
    }

    // STEP 2: Get tracking data
    let parentId = event.parentToolUseID;
    let now = Date.now();
    let lastEmitTime = progressCache.get(parentId) || 0;

    // STEP 3: Throttle check - only emit every 30 seconds
    if (now - lastEmitTime >= PROGRESS_THROTTLE_INTERVAL_MS) {

        // STEP 4: LRU eviction when cache exceeds max size
        if (progressCache.size >= MAX_PROGRESS_CACHE_SIZE) {
            let oldestKey = progressCache.keys().next().value;
            if (oldestKey !== void 0) {
                progressCache.delete(oldestKey);
            }
        }

        // STEP 5: Update cache and emit event
        progressCache.set(parentId, now);
        yield {
            type: "tool_progress",
            tool_use_id: event.toolUseID,
            tool_name: event.data.type === "bash_progress" ? "Bash" : "PowerShell",
            parent_tool_use_id: event.parentToolUseID,
            elapsed_time_seconds: event.data.elapsedTimeSeconds,
            task_id: event.data.taskId,
            session_id: getSessionId(),
            uuid: event.uuid
        };
    }
}

// Mapping: A→event, Zi6→progressCache, yxY→PROGRESS_THROTTLE_INTERVAL_MS,
//          ExY→MAX_PROGRESS_CACHE_SIZE, t6→isRemoteEnv, R1→getSessionId
```

### Why Remote/Container Only?

The progress throttling only emits events in `CLAUDE_CODE_REMOTE` or `CLAUDE_CODE_CONTAINER_ID` environments. This is because:

1. **Local terminal doesn't need progress**: The user can see the command executing in their terminal
2. **Remote sessions need progress**: The LLM needs to know the command is still running
3. **Container sessions need progress**: VS Code / IDE integrations need status updates

**Environment variable checks:**
- `CLAUDE_CODE_REMOTE` — Set when running in remote mode (SSH, cloud)
- `CLAUDE_CODE_CONTAINER_ID` — Set when running in a container

### LRU Cache Eviction Strategy

The cache uses a simple LRU (Least Recently Used) eviction:

```
When cache.size >= MAX_PROGRESS_CACHE_SIZE (100):
    1. Get the first key (oldest entry, since Map maintains insertion order)
    2. Delete that entry
    3. Add new entry
```

**Why 100 entries?** This bounds memory usage while allowing tracking of up to 100 concurrent long-running commands.

**Why Map maintains insertion order?** JavaScript Maps iterate in insertion order, so `keys().next().value` returns the oldest entry.

### Throttle Interval Design

The 30-second throttle interval (`yxY = 30000`) balances:

1. **User awareness**: The LLM sees progress every 30 seconds
2. **Message budget**: Progress events consume tokens in the conversation
3. **Network efficiency**: Fewer events = less bandwidth

**Why 30 seconds?** Long enough to avoid spamming, short enough to provide useful feedback for multi-minute commands.

---

## Deep Analysis: checkBashPermissions Flow

### Complete Decision Tree

```
checkBashPermissions(input, sessionContext, prefixExtractor)
│
├── STEP 1: Parse command
│   ├── CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK?
│   │   └── YES → { kind: "parse-unavailable" }
│   └── NO → parseCommandTreeSitter(input.command)
│       ├── Result: { kind: "too-complex" }
│       │   └── Return: { behavior: "ask", reason: "AST too complex" }
│       ├── Result: { kind: "simple", commands: [...] }
│       │   └── Extract subcommands and redirections
│       └── Result: { kind: "parse-unavailable" }
│           └── Fall back to shell-quote parser
│
├── STEP 2: Sandboxing check (if enabled)
│   ├── isSandboxingEnabled() && isAutoAllowBashIfSandboxedEnabled()
│   └── If sandboxed command is safe → return early
│
├── STEP 3: Deny/Ask rules (prompt-based permissions)
│   ├── Get deny rules from permission context
│   ├── Get ask rules from permission context
│   ├── Check deny rules (via NN1)
│   │   └── If high-confidence match → return { behavior: "deny" }
│   ├── Check ask rules (via NN1)
│   │   └── If high-confidence match → extract prefix, return { behavior: "ask" }
│   └── Continue if no rules match
│
├── STEP 4: Subcommand analysis
│   └── analyzeSubcommands(input, recursiveChecker, {...})
│       ├── For each subcommand:
│       │   ├── Is it a cd command?
│       │   ├── Is it a git command?
│       │   └── Recursively check permissions
│       └── Return combined result
│
├── STEP 5: Security checks (if not already run)
│   ├── runBashSecurityChecks(input.command)
│   │   └── Full static security pipeline (see implementation.md)
│   └── If security check fails → return { behavior: "ask" }
│
├── STEP 6: Subcommand count check
│   ├── If subcommands.length > MAX_SUBCOMMANDS (Rfq)
│   │   └── Return { behavior: "ask", reason: "Too many subcommands" }
│   └── Continue
│
├── STEP 7: Multiple cd check
│   ├── Count cd commands
│   └── If > 1 → Return { behavior: "ask", reason: "Multiple directory changes" }
│
├── STEP 8: cd + git compound check
│   ├── Has cd && Has git command?
│   └── If yes → May require additional approval
│
├── STEP 9: Prefix extraction (via prefixExtractor)
│   ├── Default: extractPrefixCached (pr6)
│   │   └── Calls bashPreFlightCheck (nGq) with caching
│   └── Result:
│       ├── commandPrefix: "git diff"
│       ├── commandPrefix: null (none detected)
│       └── commandPrefix: null (injection detected)
│
└── STEP 10: Final permission decision
    ├── Check against allowed commands list
    ├── Check against auto-allow rules
    └── Return: { behavior: "allow" | "ask" | "passthrough" }
```

### Key Decision Points

**1. Tree-sitter vs Shell-quote Fallback:**

```javascript
// If tree-sitter unavailable, use shell-quote
if (_.kind === "parse-unavailable") {
    k("bashToolHasPermission: tree-sitter unavailable, using legacy shell-quote path");
    let B = Fz(A.command);  // Shell-quote tokenizer
    if (!B.success) {
        // Malformed syntax → ask user
        return { behavior: "ask", reason: "Malformed syntax" };
    }
}
```

**2. Compound cd + git Protection:**

```javascript
// Multiple cd commands require approval
let cdCommands = X.filter((B) => Sn8(B));
if (cdCommands.length > 1) {
    return { behavior: "ask", reason: "Multiple directory changes" };
}

// cd + git combination
if (hasCdCommand) {
    if (X.some((b) => G01(b.trim()))) {
        // cd followed by git - may be navigating to unsafe repo
        // Apply additional scrutiny
    }
}
```

**3. Subcommand Count Cap:**

```javascript
// Rfq = MAX_SUBCOMMANDS (defined elsewhere)
if (w === null && X.length > Rfq) {
    k(`bashPermissions: ${X.length} subcommands exceeds cap (${Rfq})`);
    return { behavior: "ask", reason: "Too many subcommands" };
}
```

**Why this cap?** Each subcommand requires permission checking, prefix extraction, and security analysis. With hundreds of subcommands, this could take too long or miss edge cases.

### analyzeSubcommands (vfq) Deep Dive

The `analyzeSubcommands` function recursively checks each subcommand in a compound command:

```javascript
// ============================================
// analyzeSubcommands - Per-subcommand permission analysis
// Location: chunks.172.mjs
// ============================================

// READABLE (for understanding):
async function analyzeSubcommands(input, recursiveChecker, helpers) {
    let { isNormalizedCdCommand, isNormalizedGitCommand } = helpers;
    let subcommands = extractSubcommands(input.command);

    for (let subcommand of subcommands) {
        // Skip empty
        if (!subcommand.trim()) continue;

        // cd commands - track but don't block
        if (isNormalizedCdCommand(subcommand)) {
            // cd is generally allowed
            continue;
        }

        // git commands - check prefix
        if (isNormalizedGitCommand(subcommand)) {
            let prefix = await extractPrefix(subcommand);
            if (prefix === "git push" || prefix === "git push --force") {
                // These need explicit approval
                return { behavior: "ask", reason: "Destructive git operation" };
            }
        }

        // Other commands - recursive check
        let result = await recursiveChecker({ command: subcommand }, ...);
        if (result.behavior !== "passthrough") {
            return result;
        }
    }

    return { behavior: "passthrough" };
}
```

### Tree-sitter vs Shell-quote Divergence Telemetry

When tree-sitter is available, the system compares its quote context analysis against the shell-quote parser:

```javascript
// Location: chunks.91.mjs:2300-2306 (in O01)
if (!Y.dangerousPatterns.hasHeredoc) {
    if (w.fullyUnquoted !== O.fullyUnquoted || w.withDoubleQuotes !== O.withDoubleQuotes)
        if (q) q();
        else d("tengu_tree_sitter_security_divergence", {
            quoteContextDivergence: true
        })
}
```

**Why this matters:**
- Tree-sitter's AST-based parsing is more accurate for complex commands
- Shell-quote is a fallback that may disagree on edge cases
- Divergence telemetry helps identify commands that need special handling

---

## Data Flow Summary

| Source | Calls Shell Parser For | Result |
|--------|------------------------|--------|
| Bash Tool | Security validation, prefix extraction | Permission decision |
| Bash Tool | Progress streaming | Tool progress attachments |
| Compact | Command extraction | Summarization context |
| Skills | Indirect (via Bash tool) | Secure command execution |

---

## Key Integration Points

### 1. Permission Check Entry Point

```javascript
// All bash commands pass through this pipeline:
async function checkBashPermissions(input, sessionContext, prefixExtractor) {
    // Tn8 in chunks.172.mjs:1930
}
```

### 2. Security Validation

```javascript
// Static security analysis:
runSecurityChecks(command) → { behavior, message }
// zg9 in chunks.91.mjs:1104
```

### 3. Prefix Extraction for Permissions

```javascript
// LLM-based prefix extraction for permission lists:
await extractPrefixCached(command) → { commandPrefix }
// pr6 in chunks.171.mjs:1758 (memoized wrapper)
// nGq in chunks.171.mjs:1750 (actual LLM call)
```

### 4. Progress Streaming

```javascript
// Throttled progress event generation:
// Location: chunks.146.mjs:1162-1182
// - Throttle interval: yxY = 30000ms (30 seconds)
// - Max cache size: ExY = 100 entries
// - Cache: Zi6 = new Map()
// - Remote/container only
```

### 5. Subcommand Extraction

```javascript
// Split compound commands for analysis:
extractSubcommands(command) → ["cmd1", "cmd2"]
// EO in chunks.171.mjs
```

---

## Cross-Module Dependencies

```
29_shell_parser/
    │
    ├── Depends on ─────────────────────────────────────────
    │   ├── chunks.10.mjs (hasSingleQuotedBackslashBypass / CY8)
    │   └── External: tree-sitter-bash (AST parsing)
    │
    └── Used by ────────────────────────────────────────────
        ├── 05_tools/bash_tool.md (checkBashPermissions / Tn8)
        ├── 04_system_reminder/ (progress handling)
        └── 07_compact/ (command extraction via EO, bW6)
```

## Source File Summary

| File | Content | Line Range |
|------|---------|------------|
| chunks.91.mjs | Security pipeline: runSecurityChecks (zg9), all check functions, SECURITY_CHECK_IDS (w3) | ~1100-2500 |
| chunks.171.mjs | Shell tokenizer (bW6), extractSubcommands (EO), prefix extraction (nGq, pr6) | ~1100-1800 |
| chunks.56.mjs | extractHeredocs (ca) | ~945-1100 |
| chunks.172.mjs | checkBashPermissions (Tn8), permission integration | ~1930-2100 |
| chunks.146.mjs | Progress handling (throttle via Zi6, yxY, ExY) | ~1162-1182, 1321-1340 |
| chunks.10.mjs | Pre-check (hasSingleQuotedBackslashBypass / CY8) | - |

---

## Related Documents

- [implementation.md](./implementation.md) - Full implementation reference
- [heredoc_security.md](./heredoc_security.md) - Heredoc handling deep dive
- [command_validation.md](./command_validation.md) - Security architecture overview
- [../05_tools/bash_tool.md](../05_tools/bash_tool.md) - Bash tool analysis
- [../05_tools/tool_reminder_integration.md](../05_tools/tool_reminder_integration.md) - Tool-reminder integration