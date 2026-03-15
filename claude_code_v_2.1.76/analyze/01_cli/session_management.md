# CLI-Session Management Integration

> How CLI flags control session persistence, resumption, and forking

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State Management
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind/Checkpointing

Key functions in this document:
- `resumeSession` (yt) - Resume a session by ID or picker
- `generateSessionId` (pcA) - Create new session UUID
- `createChildAbortController` (R61) - Session abort handling
- `getSessionsDir` - Get sessions storage directory

---

## Overview

The CLI provides comprehensive session management through multiple flags:

1. **`-c, --continue`** - Continue the most recent conversation
2. **`-r, --resume [value]`** - Resume by session ID or interactive picker
3. **`-n, --name <name>`** - Name the session (v2.1.76)
4. **`--fork-session`** - Create new session ID when resuming
5. **`--session-id <uuid>`** - Use a specific session ID
6. **`--from-pr [value]`** - Resume session linked to a PR
7. **`--rewind-files <message-id>`** - Restore files at message state
8. **`--no-session-persistence`** - Disable session saving

**Changes in v2.1.76:**
- Session name display on prompt bar (shows `--name` value)
- Session name preserved through compaction (name survives context compaction)
- `-n, --name <name>` flag added for explicit session naming at startup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → SESSION MANAGEMENT PIPELINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  --continue      │    │  --resume         │    │  --session-id    │     │
│  │  Most recent     │    │  By ID or picker  │    │  Specific UUID   │     │
│  │  session         │    │                   │    │                  │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   --fork-session?             │                       │
│                    │   Create new session ID?      │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                         YES                 NO                            │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────────┐               │
│           │ Generate new UUID       │   │ Use existing    │               │
│           │ Keep transcript link    │   │ session ID      │               │
│           └─────────────────────────┘   └─────────────────┘               │
│                                    │                                       │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   Load session transcript     │                       │
│                    │   Restore conversation state  │                       │
│                    │   Restore session name (v2.1.76) │                  │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   --rewind-files?             │                       │
│                    │   Restore files at message    │                       │
│                    └───────────────────────────────┘                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Definitions

### 1.1 Session Flags

**Source location:** `chunks.197.mjs:1023-1027`

```javascript
// ============================================
// Session management CLI flag definitions
// Location: chunks.197.mjs:1023-1027
// ============================================

// ORIGINAL (for source lookup):
.option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0)
.option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (w) => w || !0)
.option("-n, --name <name>", "Name this session", (w) => w)
.option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0)
.option("--from-pr [value]", "Resume a session linked to a PR by PR number/URL, or open interactive picker with optional search term", (w) => w || !0)
.option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)")
.addOption(new J5("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp())
.addOption(new J5("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp())
.option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)")

// READABLE (for understanding):
.option("-c, --continue", "Continue most recent conversation", () => true)
.option("-r, --resume [value]", "Resume by session ID or picker", (value) => value || true)
.option("-n, --name <name>", "Name this session", (value) => value)
.option("--fork-session", "Create new session ID on resume", () => true)
.option("--from-pr [value]", "Resume session linked to PR", (value) => value || true)
.option("--no-session-persistence", "Disable session saving (print mode only)", () => true)
.addOption(new Option("--resume-session-at <message id>", "Resume at specific message").hideHelp())
.addOption(new Option("--rewind-files <user-message-id>", "Restore files at message state").hideHelp())
.option("--session-id <uuid>", "Use specific session UUID")

// Mapping: J5→Option, w→value
```

### 1.2 Flag Extraction

**Source location:** `chunks.197.mjs:1046-1054`

```javascript
// ============================================
// Session flag extraction - Action handler
// Location: chunks.197.mjs:1046-1054
// ============================================

// ORIGINAL (for source lookup):
let {
    ...
    sessionId: N,
    name: e1,
    ...
} = H
...
let r = H.continue,
    s = H.resume,
    ...

// READABLE (for understanding):
let sessionId = options.sessionId;
let sessionName = options.name;
let continueSession = options.continue;
let resumeSession = options.resume;
let forkSession = options.forkSession;
let prNumber = undefined;  // Extracted from --from-pr

// Mapping: N→sessionId, e1→sessionName, r→continueSession, s→resumeSession
```

---

## 2. Session Naming (New in v2.1.76)

### 2.1 Name Flag Behavior

**What it does:** The `-n`/`--name` flag assigns a human-readable label to the session. Unlike the session ID (a UUID), the name is a free-form string intended for human identification.

**How it works:**
1. User provides `--name "my-feature-work"` at startup
2. The name is stored in session metadata alongside the session ID
3. The prompt bar displays the session name (e.g., `[my-feature-work]`)
4. The name persists through compaction — when context is compacted, the name is preserved in the session metadata and restored in the new message state

**Key design decisions:**

**Why display in prompt bar:** In multi-session environments (e.g., multiple Claude Code windows), the name provides immediate visual identification without opening a session picker.

**Why preserve through compaction:** Compaction replaces message history with a summary. If the session name were stored only in message content, it would be lost. By storing it in session metadata separately, it survives the compaction operation.

### 2.2 Name Persistence Through Compaction

**What it does:** When auto-compaction runs, the session name is extracted from state before compaction and re-injected after the new message history is created.

```javascript
// ============================================
// Session name preservation during compaction
// Location: chunks.147.mjs (compaction handler)
// ============================================

// READABLE (for understanding):
async function performCompaction(messages, sessionContext) {
    // Extract session name before compaction
    let sessionName = sessionContext.sessionName;

    // ... perform compaction ...

    // Re-inject session name into new session context
    return {
        ...compactionResult,
        sessionName: sessionName  // Name survives compaction
    };
}
```

**Why this matters:** Without explicit preservation, a named session that exceeded the context window would become "unnamed" after compaction, breaking the user's organizational workflow.

---

## 3. Session ID Generation and Validation

### 3.1 UUID Validation

**Source location:** `chunks.197.mjs:1100-1109`

```javascript
// ============================================
// Session ID validation
// Location: chunks.197.mjs:1100-1109
// ============================================

// ORIGINAL (for source lookup):
if (N) {
    if ((H.continue || H.resume) && !H.forkSession)
        process.stderr.write(H6.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.
`)), process.exit(1);
    if (!D1) {
        let TA = xv(N);
        if (!TA) process.stderr.write(H6.red(`Error: Invalid session ID. Must be a valid UUID.
`)), process.exit(1);
        if (zm1(TA)) process.stderr.write(H6.red(`Error: Session ID ${TA} is already in use.
`)), process.exit(1)
    }
}

// READABLE (for understanding):
if (sessionId) {
    // Cannot use --session-id with --continue/--resume without --fork-session
    if ((options.continue || options.resume) && !options.forkSession) {
        console.error("Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.");
        process.exit(1);
    }

    // Validate UUID format
    if (!isSdkMode) {
        let parsedUuid = validateUuid(sessionId);
        if (!parsedUuid) {
            console.error("Error: Invalid session ID. Must be a valid UUID.");
            process.exit(1);
        }

        // Check if session ID is already in use
        if (isSessionIdInUse(parsedUuid)) {
            console.error(`Error: Session ID ${parsedUuid} is already in use.`);
            process.exit(1);
        }
    }
}

// Mapping: N→sessionId, xv→validateUuid, zm1→isSessionIdInUse, D1→isSdkMode
```

### 3.2 Session ID Generation

**Source location:** `chunks.1.mjs:2340`

```javascript
// ============================================
// generateSessionId - Create new session UUID
// Location: chunks.1.mjs:2340
// ============================================

// ORIGINAL (for source lookup):
function pcA() {
    return gL9()
}

// READABLE (for understanding):
function generateSessionId() {
    return generateUUID();
}

// Mapping: pcA→generateSessionId, gL9→generateUUID
```

---

## 4. PR Session Resolution

### 4.1 PR Number Extraction

**Source location:** `chunks.197.mjs:1055-1059`

```javascript
// ============================================
// PR number extraction from --from-pr
// Location: chunks.197.mjs:1055-1059
// ============================================

// ORIGINAL (for source lookup):
if (N1) {
    let TA = N1.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)\/?(?:[?#].*)?$/i),
        F7 = N1.match(/^#(\d+)$/),
        f8 = TA?.[1] ?? F7?.[1];
    if (f8) q1 = parseInt(f8, 10), N1 = void 0
}

// READABLE (for understanding):
if (fromPrValue) {
    // Match GitHub PR URL: https://github.com/owner/repo/pull/123
    let urlMatch = fromPrValue.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)\/?(?:[?#].*)?$/i);

    // Match shorthand: #123
    let shorthandMatch = fromPrValue.match(/^#(\d+)$/);

    // Extract PR number
    let prNumberStr = urlMatch?.[1] ?? shorthandMatch?.[1];
    if (prNumberStr) {
        prNumber = parseInt(prNumberStr, 10);
        fromPrValue = undefined;  // Clear the raw value
    }
}

// Mapping: N1→fromPrValue, TA→urlMatch, F7→shorthandMatch, f8→prNumberStr, q1→prNumber
```

---

## 5. Fork Session Logic

### 5.1 Fork Session Behavior

**What it does:** When `--fork-session` is specified with `--resume` or `--continue`, a new session ID is generated while preserving the transcript link to the original session.

**Key design decisions:**

**Why fork instead of reuse:**
- Allows parallel development from a common starting point
- Preserves original session for reference
- Creates independent conversation history
- Useful for testing alternative approaches

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FORK SESSION DECISION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  --resume abc-123 --fork-session                                            │
│  │                                                                          │
│  ├─► Load session abc-123                                                   │
│  │                                                                          │
│  ├─► Generate new session ID: def-456                                       │
│  │                                                                          │
│  ├─► Copy transcript from abc-123                                           │
│  │                                                                          │
│  ├─► Set forkedFrom: abc-123 in new session                                │
│  │                                                                          │
│  └─► Continue with new session def-456                                      │
│                                                                              │
│  Result:                                                                     │
│  - Original session abc-123 unchanged                                       │
│  - New session def-456 has same history                                     │
│  - Future messages go to def-456 only                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Rewind Files Feature

### 6.1 Rewind Files Flag

**What it does:** Restores files to their state at a specific user message, then exits. Useful for reverting changes made during a conversation.

**Source location:** `chunks.197.mjs:1027` (hidden flag)

```javascript
// ============================================
// --rewind-files flag definition
// Location: chunks.197.mjs:1027
// ============================================

// ORIGINAL (for source lookup):
.addOption(new J5("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp())

// READABLE (for understanding):
.addOption(new Option("--rewind-files <user-message-id>",
    "Restore files to state at the specified user message and exit (requires --resume)")
    .hideHelp())

// Mapping: J5→Option
```

### 6.2 Rewind Files Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REWIND FILES EXECUTION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  claude --resume abc-123 --rewind-files msg_456                             │
│  │                                                                          │
│  ├─► Load session abc-123                                                   │
│  │                                                                          │
│  ├─► Find user message msg_456 in transcript                                │
│  │                                                                          │
│  ├─► Identify all file operations up to msg_456                            │
│  │                                                                          │
│  ├─► Restore each file to its state at msg_456                             │
│  │   - Read, Edit, Write operations reversed                               │
│  │   - Uses file history tracking                                          │
│  │                                                                          │
│  └─► Exit (no session started)                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Session Persistence Control

### 7.1 No Session Persistence Flag

**Source location:** `chunks.197.mjs:1023`

```javascript
// ============================================
// --no-session-persistence flag
// Location: chunks.197.mjs:1023
// ============================================

// ORIGINAL (for source lookup):
.option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)", () => !0)

// READABLE (for understanding):
.option("--no-session-persistence",
    "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)",
    () => true)

// Mapping: Direct boolean flag
```

### 7.2 Validation

**Source location:** `chunks.197.mjs:1305`

```javascript
// ============================================
// No session persistence validation
// Location: chunks.197.mjs:1305
// ============================================

// ORIGINAL (for source lookup):
if (H.sessionPersistence === !1 && !z1) yl("Error: --no-session-persistence can only be used with --print mode."), process.exit(1);

// READABLE (for understanding):
if (options.sessionPersistence === false && !isPrintMode) {
    console.error("Error: --no-session-persistence can only be used with --print mode.");
    process.exit(1);
}

// Mapping: z1→isPrintMode, yl→console.error
```

---

## 8. Session Storage

### 8.1 Session Directory Structure

```
~/.claude/projects/
└── <project-hash>/
    └── sessions/
        ├── abc-123.jsonl      # Session transcript
        ├── abc-123.meta.json  # Session metadata (includes name)
        └── def-456.jsonl      # Another session
```

### 8.2 Session Metadata

```json
{
  "sessionId": "abc-123-def-456",
  "name": "my-feature-work",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:45:00Z",
  "forkedFrom": "parent-session-id",
  "model": "claude-sonnet-4-6-20250514",
  "messageCount": 42
}
```

The `name` field is stored in metadata so it persists independently of the conversation transcript and survives compaction.

---

## 9. Use Cases

### 9.1 Continue Most Recent Session

```bash
# Continue where you left off
claude -c

# Equivalent to
claude --continue
```

### 9.2 Resume Specific Session

```bash
# Resume by session ID
claude -r abc-123-def-456

# Resume with search term (opens picker)
claude -r "bug fix"

# Resume with fork (new session ID)
claude -r abc-123 --fork-session
```

### 9.3 Named Sessions (New in v2.1.76)

```bash
# Start a named session
claude -n "auth-refactor"

# Continue a named session (name shows in prompt bar)
claude -c  # name is restored from metadata

# Name + specific model
claude -n "opus-analysis" --model opus
```

### 9.4 Resume from PR

```bash
# Resume session linked to PR #42
claude --from-pr 42

# Resume session from PR URL
claude --from-pr https://github.com/owner/repo/pull/42
```

### 9.5 Use Specific Session ID

```bash
# Start with specific session ID (must be UUID)
claude --session-id 550e8400-e29b-41d4-a716-446655440000

# Combine with fork
claude -c --fork-session --session-id 550e8400-e29b-41d4-a716-446655440000
```

### 9.6 Rewind Files

```bash
# Restore files at specific message, then exit
claude --resume abc-123 --rewind-files msg_42_user
```

### 9.7 Non-Persistent Session

```bash
# Run without saving session (print mode only)
claude -p --no-session-persistence "Quick analysis"
```

---

## 10. Flag Combination Rules

### 10.1 Valid Combinations

| Combination | Valid | Behavior |
|-------------|-------|----------|
| `--continue` | Yes | Resume most recent |
| `--resume <id>` | Yes | Resume specific |
| `--continue --fork-session` | Yes | New ID from recent |
| `--resume <id> --fork-session` | Yes | New ID from specific |
| `--name <name>` | Yes | Start named session |
| `--continue --name <name>` | Yes | Resume with new name override |
| `--session-id <uuid>` | Yes | Start with UUID |
| `--session-id <uuid> --fork-session` | Yes | Requires --continue or --resume |
| `--continue --session-id <uuid>` | No | Requires --fork-session |
| `--no-session-persistence` | Yes | Print mode only |

### 10.2 Error Messages

| Error | Cause |
|-------|-------|
| `--session-id can only be used with --continue or --resume if --fork-session is also specified` | Missing `--fork-session` |
| `Invalid session ID. Must be a valid UUID` | Bad UUID format |
| `Session ID already in use` | Collision with active session |
| `--no-session-persistence can only be used with --print mode` | Wrong mode |

---

## 11. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag definitions | `chunks.197.mjs:1023` | Commander options |
| UUID validation | `chunks.197.mjs:1100` | Session ID check |
| PR resolution | `chunks.197.mjs:1055` | Extract PR number |
| Session ID generation | `chunks.1.mjs:2340` | `generateSessionId` |
| Resume handling | `chunks.142.mjs:379` | `resumeSession` |
| Rewind files | Various | File history module |
| Persistence check | `chunks.197.mjs:1305` | Print mode validation |
| Session name storage | Session metadata | Survives compaction |
