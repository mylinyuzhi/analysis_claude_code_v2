# Shell Parser Integration Overview (Claude Code 2.1.76)

> Analysis of how the shell parser module integrates with Tools, System Reminder, Compact, and Slash Commands.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell Parser section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key integration functions:
- `runSecurityChecks` (lm) - Main security validation entry point
- `bashPreFlightCheck` (AYz) - LLM-based prefix extraction
- `checkReadOnlyBehavior` (Of6) - Read-only permission gate
- `bashProgressHandler` (ZhA) - Progress streaming for Bash tool
- `createToolProgressMessage` (U1q) - Attachment creation for progress

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
│  │   bashPreFlightCheck (AYz) ──────> Prefix for permission           │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   runSecurityChecks (lm) ─────────> "passthrough" / "ask"          │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   checkReadOnlyBehavior (Of6) ─────> Read-only auto-allow?         │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   Tool execution ──> bashProgressHandler (ZhA) ──> Progress events │    │
│  │                                                                     │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                            │
│                                 │ Progress events                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   04_system_reminder / Attachments                  │    │
│  │                                                                     │    │
│  │   createToolProgressMessage (U1q) ──> Progress attachments          │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │   normalizeAttachmentForAPI (K2z) ──> <system-reminder> tags        │    │
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
│  │   Uses: parseShellCommand (rZ1), extractSubcommands (AD)           │    │
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
// Bash Tool Execution Flow
// Location: chunks.149.mjs, chunks.150.mjs
// ============================================

// Step 1: Tool execution pipeline receives tool_use block
async function bashToolExecute(toolUseBlock, sessionContext) {
    let { command } = toolUseBlock.input;

    // Step 2: Pre-flight check for command prefix extraction
    // This uses an LLM call to extract the "prefix" for permission matching
    let prefixResult = await bashPreFlightCheck(command, abortSignal, isNonInteractive);

    // Step 3: Security validation
    let securityResult = runSecurityChecks(command);
    // Returns: { behavior: "passthrough" | "ask" | "allow", message: string }

    // Step 4: Read-only behavior check (speculative auto-allow)
    let readOnlyResult = checkReadOnlyBehavior({ command }, isCompoundCommand);
    // Returns: { behavior: "passthrough" | "ask" | "allow", updatedInput? }

    // Step 5: Permission decision
    if (securityResult.behavior === "ask" || readOnlyResult.behavior === "ask") {
        // Prompt user for approval
        let decision = await requestUserPermission(command, prefixResult.commandPrefix);
    }

    // Step 6: Execute command
    let result = await executeBashCommand(command, options);

    // Step 7: Progress streaming (via bashProgressHandler)
    // Yields progress events for long-running commands
    return result;
}

// Mapping: AYz→bashPreFlightCheck, lm→runSecurityChecks, Of6→checkReadOnlyBehavior, ZhA→bashProgressHandler
```

### Security Pipeline Integration

The security pipeline is called in the tool validation phase:

| Phase | Function | Purpose | Result |
|-------|----------|---------|--------|
| 1 | `bashPreFlightCheck` (AYz) | LLM-based prefix extraction | Command prefix for permission matching |
| 2 | `runSecurityChecks` (lm) | Static security analysis | "passthrough" / "ask" / "allow" |
| 3 | `checkReadOnlyBehavior` (Of6) | Read-only determination | Auto-allow for safe commands |

### Prefix Extraction for Permissions

**Why LLM-based?** Shell commands have complex syntax that's difficult to parse with regex:

```bash
# Examples of complex prefix extraction:
GOEXPERIMENT=synctest go test -v ./...   # Prefix: "GOEXPERIMENT=synctest go test"
npm run lint -- "foo"                     # Prefix: "npm run lint"
git diff $(cat secrets)                   # Injection detected!
```

The `bashPreFlightCheck` function returns:
- A prefix string (e.g., `"git commit"`) → match against user's allowed list
- `"none"` → command has no meaningful prefix
- `"command_injection_detected"` → force user approval

### Progress Streaming Integration

Long-running bash commands emit progress events through the reminder system:

```javascript
// ============================================
// bashProgressHandler - Progress event generator
// Location: chunks.150.mjs:2332-2401
// ============================================

function* bashProgressHandler(event) {
    if (event.type === "progress" && event.data.type === "bash_progress") {
        // Throttle: only emit every PROGRESS_THROTTLE_INTERVAL_MS
        if (now - lastEmitTime >= PROGRESS_THROTTLE_INTERVAL_MS) {
            yield {
                type: "tool_progress",
                tool_use_id: event.toolUseID,
                tool_name: "Bash",
                parent_tool_use_id: event.parentToolUseID,
                elapsed_time_seconds: event.data.elapsedTimeSeconds,
                session_id: getSessionId(),
                uuid: event.uuid
            };
        }
    }
}
```

**Key design decisions:**
1. **Remote-only emission**: Progress only sent in remote/container environments
2. **Time-based throttling**: Prevents message flooding
3. **LRU cache eviction**: Bounds memory for progress tracking

---

## Integration with 04_system_reminder / Attachments

### Progress Attachment Creation

Progress events from bash commands are converted to attachments:

```javascript
// ============================================
// createToolProgressMessage - Attachment factory
// Location: chunks.172.mjs:2943-2954
// ============================================

function createToolProgressMessage({
    toolUseID,
    parentToolUseID,
    data
}) {
    return {
        type: "progress",
        data: data,                // Progress data (type, elapsed time)
        toolUseID: toolUseID,
        parentToolUseID: parentToolUseID,
        uuid: generateUuid(),
        timestamp: new Date().toISOString()
    };
}
```

### Attachment Flow to LLM

```
Bash tool executes
    │
    ├── Progress callback fires
    │       │
    │       ▼
    ├── bashProgressHandler (ZhA)
    │       │
    │       ▼ (throttled)
    ├── createToolProgressMessage (U1q)
    │       │
    │       ▼
    ├── Enqueue into message stream
    │       │
    │       ▼
    ├── normalizeAttachmentForAPI (K2z)
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
// Location: chunks.169.mjs
// ============================================

// extractSubcommands (AD) - Split compound commands
// Input: "npm test && git push"
// Output: ["npm test", "git push"]

function extractSubcommands(command) {
    let tokens = parseShellCommand(command);
    // Split on operators: &&, ||, |, ;
    return splitByOperators(tokens);
}

// parseShellCommand (rZ1) - Full tokenization with heredoc safety
function parseShellCommand(command) {
    // 1. Extract heredocs → placeholders
    let { processedCommand, heredocs } = extractHeredocs(command);

    // 2. Handle line continuations
    // 3. Replace quotes with sentinels
    // 4. Tokenize with bash-parser
    // 5. Restore heredocs and quotes

    return tokens;
}
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
Bash tool validateInput() called
        │
        ├── runSecurityChecks (lm)
        │
        ├── bashPreFlightCheck (AYz)
        │
        └── checkReadOnlyBehavior (Of6)
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

## Data Flow Summary

| Source | Calls Shell Parser For | Result |
|--------|------------------------|--------|
| Bash Tool | Security validation, prefix extraction | Permission decision |
| Bash Tool | Progress streaming | Tool progress attachments |
| Compact | Command extraction | Summarization context |
| Skills | Indirect (via Bash tool) | Secure command execution |

---

## Key Integration Points

### 1. Security Validation Entry Point

```javascript
// All bash commands pass through this pipeline:
runSecurityChecks(command) → { behavior, message }
```

### 2. Permission Matching

```javascript
// LLM-based prefix extraction for permission lists:
await bashPreFlightCheck(command) → { commandPrefix }
```

### 3. Read-Only Auto-Allow

```javascript
// Fast-path for safe read-only commands:
checkReadOnlyBehavior({ command }) → { behavior: "allow" | "passthrough" | "ask" }
```

### 4. Progress Streaming

```javascript
// Generator for throttled progress events:
bashProgressHandler(event) → yields { type: "tool_progress", ... }
```

---

## Cross-Module Dependencies

```
29_shell_parser/
    │
    ├── Depends on ─────────────────────────────────────────
    │   ├── chunks.10.mjs (hasSingleQuotedBackslashBypass)
    │   └── External: bash-parser (shell tokenizer)
    │
    └── Used by ────────────────────────────────────────────
        ├── 05_tools/bash_tool.md (security + progress)
        ├── 04_system_reminder/attachment_producers.md (progress attachments)
        └── 07_compact/ (command extraction)
```

---

## Related Documents

- [implementation.md](./implementation.md) - Full implementation reference
- [heredoc_security.md](./heredoc_security.md) - Heredoc handling deep dive
- [command_validation.md](./command_validation.md) - Security architecture overview
- [../05_tools/bash_tool.md](../05_tools/bash_tool.md) - Bash tool analysis
- [../05_tools/tool_reminder_integration.md](../05_tools/tool_reminder_integration.md) - Tool-reminder integration