# Resume Flow Deep Analysis

> Source-level reverse engineering of session resume: CLI flags, transcript loading, state restoration, teleport resume, wrong-directory handling, and the complete resume lifecycle.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `sessionOrchestrator` (ot8) - Main REPL component that handles in-session resume
- `resumeSession` (aN) - Core resume callback within the session orchestrator
- `ConversationPicker` (avz) - Interactive session selection UI for --continue/--resume
- `loadTranscript` (h66) - Core transcript loading and processing function
- `restoreSession` (Ia8) - Finalizes session restoration (state, agent, metadata)
- `processResumedMessages` (Nn4) - Validates and normalizes resumed messages
- `TeleportSessionPicker` (Qgq) - Remote session picker for Teleport
- `useTeleportResume` (dgq) - Hook for resuming remote sessions
- `WrongDirectoryDialog` (evz) - Dialog shown when resuming from wrong directory
- `OVz` - CLI entry point with all session flags

---

## CLI Session Flags

### Flag Definitions (chunks.198.mjs:25-36)

| Flag | Type | Purpose |
|------|------|---------|
| `-c, --continue` | boolean | Resume most recent conversation in current directory |
| `-r, --resume [value]` | string/boolean | Resume by session ID, name, or open interactive picker |
| `--fork-session` | boolean | Create new session ID when resuming (use with --resume/--continue) |
| `--session-id <uuid>` | string | Use specific session UUID for new session |
| `-n, --name <name>` | string | Display name for session (shown in /resume, terminal title) |
| `--no-session-persistence` | boolean | Disable saving sessions to disk (print mode only) |
| `--rewind-files <message-id>` | string (hidden) | Restore files to state at specified user message |
| `--from-pr [value]` | string/boolean | Resume session linked to PR by number/URL |
| `--resume-session-at <message-id>` | string (hidden) | Only load messages up to specified assistant message ID |

### Session ID Validation (chunks.198.mjs:122-132)

```javascript
// ============================================
// Session ID validation logic
// Location: chunks.198.mjs:122-132
// ============================================

// READABLE (for understanding):
if (options.sessionId) {
    // --session-id can only combine with --continue/--resume if --fork-session is also present
    if ((options.continue || options.resume) && !options.forkSession) {
        exitWithError("--session-id can only be used with --continue/--resume if --fork-session is also specified");
    }

    if (!sdkUrl) {
        // Validate UUID format: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!validateUuid(options.sessionId)) {
            exitWithError("Invalid session ID format");
        }
        // Check session file doesn't already exist
        if (sessionFileExists(options.sessionId)) {
            exitWithError("Session ID already in use");
        }
    }
}

// Mapping: nk→validateUuid, fU6→sessionFileExists
```

**Key decision:** `--session-id` with `--continue`/`--resume` requires `--fork-session` because resuming into a specific ID would conflict with the original session's ID. Forking creates a new session with the specified ID while carrying the old conversation.

---

## Resume Entry Points

There are three distinct entry points for session resume:

### 1. CLI --continue Flow (chunks.198.mjs:868-907)

```javascript
// ============================================
// CLI --continue flow - Resume most recent conversation
// Location: chunks.198.mjs:868-907
// ============================================

// READABLE (for understanding):
if (options.continue) {
    let resumed = false;
    try {
        let startTime = performance.now();
        clearSessionCaches();

        // loadTranscript with no args → getMostRecentSession(0)
        let transcript = await loadTranscript(undefined, undefined);

        if (!transcript) {
            trackEvent("tengu_continue", { success: false });
            await showError(root, "No conversation found to continue");
            return;
        }

        let result = await restoreSession(transcript, {
            forkSession: !!options.forkSession,
            includeAttribution: true
        }, appContext);

        if (result.restoredAgentDef) agentDef = result.restoredAgentDef;
        if (hasDiffToolUse(result.messages)) initSyntaxHighlighting();

        trackEvent("tengu_continue", {
            success: true,
            resume_duration_ms: Math.round(performance.now() - startTime)
        });
        resumed = true;

        // Render REPL with restored messages
        await renderApp(root, createElement(App, null,
            createElement(REPL, {
                initialMessages: result.messages,
                initialFileHistorySnapshots: result.fileHistorySnapshots,
                initialContentReplacements: result.contentReplacements,
                initialAgentName: result.agentName,
                initialAgentColor: result.agentColor,
                mainThreadAgentDefinition: result.restoredAgentDef
            })
        ));
    } catch (err) {
        if (!resumed) trackEvent("tengu_continue", { success: false });
        reportError(err);
        process.exit(1);
    }
}
```

**Flow summary:**
1. Clear session caches (any stale in-memory state)
2. Load the most recent transcript (no args = most recent)
3. If no transcript found, show error and exit
4. Restore session state (agent definition, metadata)
5. Render the REPL with restored messages as `initialMessages`

### 2. CLI --resume Flow (chunks.198.mjs:908-1123)

The `--resume` flag supports multiple resolution strategies, processed in priority order:

```
--resume (no value)
  │
  ▼
Interactive session picker
  │
--resume <uuid>
  │
  ▼
Direct UUID lookup
  │
--resume <string>
  │
  ▼
Search by session name (exact match first)
  ├── Single match → direct resume
  └── Multiple/no matches → picker with search pre-filled
  │
--from-pr <number|url>
  │
  ▼
Filter sessions by PR number/URL
```

```javascript
// ============================================
// Session resolution strategy
// Location: chunks.198.mjs:908-1048
// ============================================

// READABLE (for understanding):

// Strategy 1: --from-pr with PR number/URL
if (options.fromPr) {
    filterByPr = typeof options.fromPr === "string"
        ? parsePrFilter(options.fromPr)  // Parse "123" or "https://github.com/.../pull/123"
        : true;  // Just enable PR filtering in picker
}

// Strategy 2: --resume with non-UUID string → name search
if (typeof options.resume === "string" && !validateUuid(options.resume)) {
    let searchTerm = options.resume;
    let matches = await searchSessionsByName(searchTerm, { exact: true });

    if (matches.length === 1) {
        // Exact single match → extract session ID and resume directly
        sessionUuid = getSessionId(matches[0]);
        existingMatch = matches[0];
    } else {
        // No/multiple matches → pass as search query to interactive picker
        initialSearchQuery = searchTerm;
    }
}

// Strategy 3: --resume with valid UUID
if (typeof options.resume === "string" && validateUuid(options.resume)) {
    sessionUuid = options.resume;
}

// Strategy 4: Direct session ID resume (from any strategy above)
if (sessionUuid) {
    let transcript = await loadTranscript(existingMatch ?? sessionUuid, undefined);
    if (!transcript) exitWithError(`No conversation found with session ID: ${sessionUuid}`);

    let result = await restoreSession(transcript, {
        forkSession: !!options.forkSession,
        sessionIdOverride: sessionUuid,
        transcriptPath: existingMatch?.fullPath ?? transcript.fullPath
    }, appContext);
    // ... render REPL with restored messages
}

// Strategy 5: Interactive picker fallback
else {
    renderApp(root, createElement(ConversationPicker, {
        worktreePaths, initialSearchQuery, forkSession: options.forkSession,
        filterByPr, ...otherProps
    }));
}
```

### 3. In-Session Resume (chunks.196.mjs:332-372)

The `resumeSession` callback (`aN`) handles resume triggered from within a running REPL (e.g., via `/resume` slash command):

```javascript
// ============================================
// resumeSession - In-session resume callback
// Location: chunks.196.mjs:332-372
// ============================================

// READABLE (for understanding):
async function resumeSession(sessionId, sessionData, entrypoint) {
    let startTime = performance.now();
    try {
        // 1. Deep-copy messages to avoid mutation
        let messages = deepCopyMessages(sessionData.messages);

        // 2. Run "resume" hooks (e.g., SessionStart hooks from plugins)
        let hookMessages = await runHooks("resume", {
            sessionId, agentType: currentAgentDef?.agentType, model: currentModel
        });
        messages.push(...hookMessages);

        // 3. Session file management: fork vs resume
        if (entrypoint === "fork") {
            forkSessionFile(sessionData, getSessionPath(sessionId));
        } else {
            setSessionFile(sessionData, getSessionPath(sessionId));
        }

        // 4. Restore stored context
        restoreStoredContext(sessionData, setAppState);
        if (sessionData.fileHistorySnapshots) {
            restoreFileHistory(sessionData);
        }

        // 5. Resolve agent definition
        let { agentDefinition } = resolveAgentSetting(
            sessionData.agentSetting, mainThreadAgentDef, agentDefinitions
        );
        setAgentDefinition(agentDefinition);
        setAppState(s => ({ ...s, agent: agentDefinition?.agentType }));
        setAppState(s => ({
            ...s, standaloneAgentContext: makeStandaloneAgentContext(sessionData.agentName, sessionData.agentColor)
        }));

        // 6. Rebuild read file state from all messages
        updateReadFileState(messages, sessionData.projectPath ?? cwd());

        // 7. Reset UI state
        resetLoadingState();
        setAbortController(null);
        setConversationId(sessionId);

        // 8. Session path management
        let sessionMetadata = getSessionMetadata(sessionId);
        resetHistoryPointer();
        resetUndoStack();
        setCurrentSessionPath(
            getSessionPath(sessionId),
            sessionData.fullPath ? resolveFullPath(sessionData.fullPath) : null
        );

        // 9. Recordings & hooks
        let { renameRecordingForSession } = await import(recordingModule);
        await renameRecordingForSession();
        await runPostResumeHooks();
        triggerAutoIndex();
        restoreLocalSettings(sessionData);
        if (sessionMetadata) restoreSessionMetadata(sessionMetadata);

        // 10. Content replacement state (skip for forks)
        if (contentReplacementState.current && entrypoint !== "fork") {
            contentReplacementState.current = rebuildContentReplacements(
                messages, sessionData.contentReplacements ?? []
            );
        }

        // 11. Set messages, clear UI state
        setMessages(() => messages);
        setToolJSX(null);
        setInputValue("");

        // 12. Telemetry
        trackEvent("tengu_session_resumed", {
            entrypoint, success: true,
            resume_duration_ms: Math.round(performance.now() - startTime)
        });
    } catch (error) {
        trackEvent("tengu_session_resumed", { entrypoint, success: false });
        throw error;
    }
}
```

**Key insight: Fork vs Resume semantics**

| Aspect | Resume | Fork |
|--------|--------|------|
| Session ID | Keeps original | Gets new UUID |
| Session file | Continues original `.jsonl` | Creates new `.jsonl` |
| Parent tracking | `parentSessionId` unchanged | Sets `parentSessionId` to original |
| Content replacements | Rebuilt from original | Skipped (starts fresh) |
| Messages | Exact copy of original | Exact copy of original |
| File history | Restored from snapshots | Restored from snapshots |

---

## Transcript Loading Pipeline

### loadTranscript (`h66`) - Core Loading Function

```javascript
// ============================================
// loadTranscript - Core transcript loading and processing
// Location: chunks.135.mjs:2588
// ============================================

// READABLE (for understanding):
async function loadTranscript(sessionOrId, remoteEvents) {
    let transcript = null, messages = null, sessionId;

    // Branch 1: No args (--continue) → get most recent
    if (sessionOrId === undefined) {
        transcript = await getMostRecentSession(0);
    }
    // Branch 2: Remote events provided (teleport/remote resume)
    else if (remoteEvents) {
        messages = [];
        for (let event of await readRemoteEvents(remoteEvents)) {
            if (event.type === "assistant" || event.type === "user") {
                let msg = convertRemoteEvent(event);
                if (msg) messages.push(msg);
            }
            sessionId = event.session_id;
        }
    }
    // Branch 3: String session ID → load by ID
    else if (typeof sessionOrId === "string") {
        transcript = await loadSessionById(sessionOrId);
        sessionId = sessionOrId;
    }
    // Branch 4: Already a transcript object → use directly
    else {
        transcript = sessionOrId;
    }

    if (!transcript && !messages) return null;

    if (transcript) {
        // Hydrate lazy transcripts (metadata-only → full content)
        if (isLazyTranscript(transcript)) {
            transcript = await hydrateLazyTranscript(transcript);
        }

        // Extract and set session ID
        if (!sessionId) sessionId = getSessionId(transcript);
        if (sessionId) await setTelemetrySessionId(transcript, formatSessionId(sessionId));

        // Validate transcript structure
        validateTranscript(transcript);
        messages = transcript.messages;
    }

    // Clean up messages for display
    sanitizeMessages(messages);

    // Process messages: fix interrupted turns, add resume marker
    let processed = processResumedMessages(messages);
    messages = processed.messages;

    // Run resume hooks
    let hookMessages = await runHooks("resume", { sessionId });
    messages.push(...hookMessages);

    return {
        messages,
        turnInterruptionState: processed.turnInterruptionState,
        fileHistorySnapshots: transcript?.fileHistorySnapshots,
        attributionSnapshots: transcript?.attributionSnapshots,
        contentReplacements: transcript?.contentReplacements,
        sessionId,
        agentName: transcript?.agentName,
        agentColor: transcript?.agentColor,
        agentSetting: transcript?.agentSetting,
        customTitle: transcript?.customTitle,
        tag: transcript?.tag,
        mode: transcript?.mode,
        prNumber: transcript?.prNumber,
        prUrl: transcript?.prUrl,
        prRepository: transcript?.prRepository,
        fullPath: transcript?.fullPath
    };
}
```

### processResumedMessages (`Nn4`)

**What it does:** Processes loaded messages for resume: validates permission modes, deduplicates, and handles interrupted turns.

**How it works:**

```
Input: Raw messages array from transcript
  │
  ▼
Step 1: Normalize each message (JVY converter)
  │
  ▼
Step 2: Strip invalid permission modes from user messages
  │
  ▼
Step 3: Deduplication pipeline (_V1 → $l6 → Ol6)
  │
  ▼
Step 4: Interrupted turn detection (MVY)
  │
  ├── Last non-system message is assistant with pending tool_use?
  │   YES → state = "interrupted_turn"
  │   │     Add "Continue from where you left off." meta message
  │   │
  │   NO → state = "normal"
  │
  ▼
Step 5: Add assistant "session resumed" marker message
  │
  ▼
Output: { messages, turnInterruptionState }
```

**Key algorithm: Interrupted turn detection**

When Claude was in the middle of using a tool (e.g., writing code) and the session was interrupted (e.g., user closed terminal), the last assistant message will have pending `tool_use` blocks without corresponding `tool_result` blocks. The resume system detects this and:
1. Marks the state as `interrupted_turn`
2. Injects a meta message instructing Claude to continue from where it left off
3. This allows Claude to seamlessly resume multi-step operations

---

## restoreSession (`Ia8`)

```javascript
// ============================================
// restoreSession - Finalizes session restoration
// Location: chunks.180.mjs:2390
// ============================================

// READABLE (for understanding):
async function restoreSession(transcript, options, context) {
    // If not forking: restore session ID and persistence
    if (!options.forkSession) {
        let sessionId = options.sessionIdOverride ?? transcript.sessionId;
        if (sessionId) {
            setSessionId(formatSessionId(sessionId),
                options.transcriptPath ? getProjectDir(options.transcriptPath) : null);
            await resetTelemetryUuids();
            await resetSessionFile();
            reconnectSessionFile(sessionId);
        }
    }
    // If forking with content replacements: persist to new session
    else if (transcript.contentReplacements?.length) {
        await insertContentReplacement(transcript.contentReplacements);
    }

    // Restore session metadata to persistence singleton
    restoreSessionMetadata(transcript);

    // If not forking, re-append metadata to session file
    if (!options.forkSession) reconnectSessionPersistence();

    // Resolve agent definition from saved agentSetting
    let { agentDefinition, agentType } = resolveAgent(
        transcript.agentSetting, context.mainThreadAgentDefinition, context.agentDefinitions
    );

    // Restore attribution if requested
    let attribution = options.includeAttribution ? restoreAttribution(transcript) : undefined;

    // Restore standalone agent context
    let agentContext = buildAgentContext(transcript.agentName, transcript.agentColor);

    return {
        messages: transcript.messages,
        fileHistorySnapshots: transcript.fileHistorySnapshots,
        contentReplacements: transcript.contentReplacements,
        agentName: transcript.agentName,
        agentColor: transcript.agentColor === "default" ? undefined : transcript.agentColor,
        restoredAgentDef: agentDefinition,
        initialState: {
            ...context.initialState,
            ...agentType && { agent: agentType },
            ...attribution && { attribution },
            ...agentContext && { standaloneAgentContext: agentContext },
            agentDefinitions: context.agentDefinitions
        }
    };
}
```

---

## Interactive Session Picker (ConversationPicker - `avz`)

### Component Overview (chunks.196.mjs:2627-2783)

The `ConversationPicker` is rendered when `--resume` is used without a specific UUID, or when the name search returns multiple matches.

### Session Loading

```javascript
// READABLE:
useEffect(() => {
    initializeSessionIndex();
    loadSessionLogs(worktreePaths).then((result) => {
        allLogsRef.current = result;    // { logs, allStatLogs, nextIndex }
        setVisibleLogs(result.logs);
        setLoading(false);
    });
}, [worktreePaths]);
```

### Cross-Project Detection

When a user selects a session that was created in a different directory:

```javascript
// READABLE:
async function selectSession(sessionLog) {
    setResuming(true);
    let crossProjectInfo = detectCrossProject(sessionLog, showAllProjects, worktreePaths);

    if (crossProjectInfo.isCrossProject) {
        if (!crossProjectInfo.isSameRepoWorktree) {
            // Show command to run in the correct directory
            await copyToClipboard(crossProjectInfo.command);
            setExternalCommand(crossProjectInfo.command);
            return;  // Don't resume - user must cd to correct directory first
        }
        // Same repo worktree → can resume directly
    }

    // Load the conversation
    let sessionData = await loadConversation(sessionLog, undefined);
    if (!sessionData) throw Error("Failed to load conversation");

    // Set session path (unless forking)
    if (sessionData.sessionId && !forkSession) {
        setCurrentSessionPath(getSessionPath(sessionData.sessionId),
            sessionLog.fullPath ? resolveFullPath(sessionLog.fullPath) : null);
        await postResumeHooks();
        await runSessionStartHooks();
        recordSessionResume(sessionData.sessionId);
    }

    // Transition to main REPL
    setLoadedSession({
        messages: sessionData.messages,
        fileHistorySnapshots: sessionData.fileHistorySnapshots,
        contentReplacements: sessionData.contentReplacements,
        agentName: sessionData.agentName,
        agentColor: sessionData.agentColor,
        mainThreadAgentDefinition: resolvedAgentDef
    });
}
```

**Key decision: Cross-project safety**

When resuming a session from a different project directory, Claude Code does NOT silently change directories. Instead, it:
1. Copies the correct `cd ... && claude --resume <id>` command to clipboard
2. Shows the `WrongDirectoryDialog` component
3. Exits after 100ms, letting the user paste and run the command

This prevents accidentally running commands in the wrong project context.

### WrongDirectoryDialog (`evz` - chunks.197.mjs:3-35)

```javascript
// ============================================
// WrongDirectoryDialog - Shown when resuming from wrong directory
// Location: chunks.197.mjs:3-35
// ============================================

// READABLE (for understanding):
function WrongDirectoryDialog({ command }) {
    useEffect(() => {
        // Auto-exit after 100ms
        setTimeout(() => process.exit(0), 100);
    }, []);

    return Column([
        Text("This conversation is from a different directory."),
        Text(`To resume, run: ${command}`),
        Text("(Command copied to clipboard)", { dimColor: true })
    ]);
}
```

---

## Teleport Resume (Remote Session Resume)

### TeleportSessionPicker (`Qgq` - chunks.196.mjs:1999-2152)

Fetches remote sessions via `fetchCodeSessions()`, filters by current repository, and presents a sorted list.

### useTeleportResume (`dgq` - chunks.196.mjs:2223-2267)

```javascript
// READABLE:
function useTeleportResume(source) {
    async function resumeSession(session) {
        setIsResuming(true);
        trackEvent("tengu_teleport_resume_session", { source, session_id: session.id });
        try {
            let result = await fetchTeleportSession(session.id);
            setTeleportSessionId({ sessionId: session.id });
            return result;
        } catch (error) {
            setError({ message, formattedMessage, isOperationError });
            return null;
        }
    }
    return { resumeSession, isResuming, error, selectedSession, clearError };
}
```

### Async Teleport with Progress (`nvz` - chunks.196.mjs:2565-2586)

Shows a step-by-step progress UI during remote session resume:

```
Step 1: "Validating session..."     → validate remote session exists
Step 2: "Fetching session logs..."  → download transcript from cloud
Step 3: "Fetching branch..."        → identify git branch
Step 4: "Checking out branch..."    → git checkout locally
Step 5: Transition to REPL          → render with loaded messages
```

---

## Complete Resume Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Entry Point                        │
│  --continue / --resume / --fork-session / --from-pr      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│               Session ID Resolution                      │
│  1. Most recent session (--continue)                     │
│  2. UUID lookup (--resume <uuid>)                        │
│  3. Name search (--resume <string>)                      │
│  4. PR filter (--from-pr)                                │
│  5. Interactive picker (no match / no value)              │
│  6. Teleport (--teleport)                                │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Cross-Project Validation                    │
│  Is session from same directory?                         │
│  YES → continue                                          │
│  NO  → Same worktree? YES → continue                    │
│                        NO  → WrongDirectoryDialog + exit │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              loadTranscript(sessionId)                    │
│  1. Load JSONL file → parseTranscriptFile                │
│  2. Walk parent chain from leaf → message array          │
│  3. Hydrate lazy transcripts if needed                   │
│  4. processResumedMessages:                              │
│     a. Normalize messages                                │
│     b. Deduplicate                                       │
│     c. Detect interrupted turns                          │
│     d. Add resume marker                                 │
│  5. Run resume hooks                                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              restoreSession(transcript)                   │
│  1. Set session ID (resume) or keep new (fork)           │
│  2. Reset telemetry UUIDs                                │
│  3. Reconnect session file handle                        │
│  4. Restore session metadata (title, tag, agent)         │
│  5. Resolve agent definition                             │
│  6. Restore attribution state                            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Session Orchestrator (ot8)                   │
│  1. Receive initialMessages → set messages state         │
│  2. Rebuild readFileState from all messages              │
│  3. Load CLAUDE.md files                                 │
│  4. Initialize tools, MCP, remote sessions               │
│  5. Process initialMessage if present (--message flag)   │
│  6. Ready for user input                                 │
└─────────────────────────────────────────────────────────┘
```

### State Restored on Resume

| State | Source | How Restored |
|-------|--------|-------------|
| Messages | JSONL transcript | Deep copy via `zV1()` |
| Session ID | Transcript metadata | `setSessionId()` on InternalState |
| Agent definition | `agentSetting` metadata | `resolveAgentSetting()` |
| Agent name/color | `agent-name`/`agent-color` metadata | `setAppState()` |
| File history | `file-history-snapshot` entries | `restoreFileHistory()` |
| Content replacements | `content-replacement` entries | `rebuildContentReplacements()` |
| Read file state | Scanned from all messages | `updateReadFileState()` |
| Session title | `custom-title` metadata | `setSessionTitle()` |
| PR association | `pr-link` metadata | `restoreSessionMetadata()` |
| Permission mode | `mode` metadata | `restoreSessionMetadata()` |

### State NOT Restored (Reset to Defaults)

| State | Why Not Restored |
|-------|-----------------|
| AppState (full) | Reconstructed from defaults + messages |
| InternalState metrics | Cost/tokens are session-specific |
| MCP connections | Re-established on mount |
| Plugin state | Re-loaded from disk |
| Permission decisions | Security: stale grants should not carry over |
| Thinking/effort config | Follows current settings, not session settings |

---

## Cross-Module Integration

### Resume <-> System Reminders (04_system_reminder)

Resume hooks can inject system reminder content that provides context about the resumed session. The `tengu_session_resumed` event is available to attachment producers for generating context-aware system reminders.

### Resume <-> Compaction (07_compact)

Compacted sessions have a summary entry. On resume:
- Pre-compaction messages are included in the transcript but may be abbreviated
- The summary provides context for messages that were compacted
- Session title is preserved through compaction via `reAppendSessionMetadata()`

### Resume <-> Background Agents (26_background_agents)

Background agent transcripts are stored in separate subagent files. On resume, only the main thread transcript is loaded. Subagent results that were already integrated into the main thread messages are available through the resumed messages.

### Resume <-> Remote Sessions (33_remote_sessions)

When resuming a remote session (teleport), the transcript is fetched from the cloud rather than local disk. The resume flow converges at `loadTranscript()` which handles both local and remote sources.

### Resume <-> File History (Rewind)

The `--rewind-files` flag works with resume to restore files to a previous state:
1. Load transcript up to the specified message ID
2. Find the `file-history-snapshot` closest to that message
3. Restore files from the snapshot
4. Exit (rewind is a one-shot operation, not a continued session)

---

## Deep Dive: Missing Detail Coverage

### Rewind Files Implementation (`thq` - chunks.187.mjs:1271-1303)

```javascript
// ============================================
// rewindFiles - Restores files to state at a specific message
// Location: chunks.187.mjs:1271-1303
// ============================================

// READABLE (for understanding):
async function rewindFiles(messages, messageId, fileHistorySnapshots) {
    // 1. Validate rewind target exists
    let targetMessage = messages.find(m => m.uuid === messageId);
    if (!targetMessage) {
        return { success: false, error: "Message not found" };
    }

    // 2. Find the file checkpoint closest to (and before) the target message
    let checkpoint = findCheckpointBefore(fileHistorySnapshots, messageId);
    if (!checkpoint) {
        return { success: false, error: "No file checkpoint found" };
    }

    // 3. Restore files from checkpoint
    let result = await restoreFilesFromCheckpoint(checkpoint);

    // 4. Return rewind stats
    return {
        success: true,
        filesChanged: result.filesChanged,
        filesRestored: result.filesRestored
    };
}

// Mapping: thq→rewindFiles, sN1→restoreFilesFromCheckpoint
```

**Key constraint:** `--rewind-files` requires `--resume` flag. It cannot be used with a prompt (error if `--message` also specified). This is a **one-shot** operation: restore files and exit immediately.

### File History Snapshot Restoration (`qV1`, `KV1` - chunks.135.mjs:2315-2389)

```javascript
// ============================================
// restoreFileHistorySnapshots - Converts and applies file history from old session
// Location: chunks.135.mjs:2315-2337
// ============================================

// READABLE (for understanding):
function restoreFileHistorySnapshots(sessionData, setAppState) {
    let snapshots = sessionData.fileHistorySnapshots;
    if (!snapshots || snapshots.length === 0) return;

    // Convert backup file references from old session ID to current session ID
    let convertedSnapshots = snapshots.map(snapshot => ({
        ...snapshot,
        backups: snapshot.backups.map(backup => ({
            ...backup,
            // Remap paths: file-history/{oldSessionId}/ → file-history/{newSessionId}/
            path: backup.path.replace(oldSessionId, getSessionId())
        }))
    }));

    // Update tracked files set
    let trackedFiles = new Set();
    for (let snapshot of convertedSnapshots) {
        for (let backup of snapshot.backups) {
            trackedFiles.add(backup.originalPath);
        }
    }

    setAppState(s => ({
        ...s,
        fileHistory: { snapshots: convertedSnapshots, trackedFiles }
    }));
}

// Mapping: qV1→restoreFileHistorySnapshots
```

```javascript
// ============================================
// copyFileHistoryBackups - Hard-links or copies backup files from old session
// Location: chunks.135.mjs:2337-2389
// ============================================

// READABLE (for understanding):
async function copyFileHistoryBackups(sessionData) {
    let snapshots = sessionData.fileHistorySnapshots;
    if (!snapshots) return;

    let oldSessionDir = join(getClaudeHome(), "file-history", sessionData.sessionId);
    let newSessionDir = join(getClaudeHome(), "file-history", getSessionId());

    await mkdir(newSessionDir, { recursive: true });

    for (let snapshot of snapshots) {
        for (let backup of snapshot.backups) {
            let oldPath = join(oldSessionDir, backup.fileName);
            let newPath = join(newSessionDir, backup.fileName);
            try {
                // Prefer hard link (efficient, no copy needed)
                await link(oldPath, newPath);
            } catch {
                // Fall back to copy if hard link fails (cross-device, etc.)
                await copyFile(oldPath, newPath);
            }
        }
    }
}

// Mapping: KV1→copyFileHistoryBackups
```

**Key insight:** Hard links are preferred over copies for file history backup transfer. This is both faster and saves disk space since the old and new session share the same underlying file data. Copy is only used as a fallback (e.g., when old and new directories are on different filesystems).

### Cache Clearing on Resume (`VQ8` - chunks.150.mjs:1164-1178)

```javascript
// ============================================
// clearSessionCaches - Comprehensive cache clearing before resume
// Location: chunks.150.mjs:1164-1178
// ============================================

// READABLE (for understanding):
function clearSessionCaches() {
    // 1. Clear memoized function caches
    getClaudeMdFiles.cache.clear();
    getProjectConfig.cache.clear();
    getGitInfo.cache.clear();

    // 2. Clear module-level state
    clearMcpToolCache();
    clearToolSearchIndex();

    // 3. Reset state pointers
    setHistoryPointer(null);
    setLastEmittedDate(null);
    resetUndoStack();
    resetLocalSettingsCache();
    clearSystemPromptSectionCache();

    // 4. Clear specialized caches
    clearWebFetchCache();
    clearToolSearchCache();
    clearAgentDefinitionsCache();
    clearPromptCache();

    // 5. Clear internal session state
    clearPlanSlugCache();
}

// Mapping: VQ8→clearSessionCaches
```

**Why comprehensive clearing matters:** When resuming a different session, stale caches could cause:
- Wrong CLAUDE.md content (old project's instructions)
- Wrong tool permissions (old project's config)
- Wrong git state (old repo's branch)
- Wrong prompt cache (old conversation's context)

### Session Metadata Restoration (`LF` - chunks.174.mjs:2206-2222)

```javascript
// ============================================
// setSessionMetadata - Restores all session metadata to persistence singleton
// Location: chunks.174.mjs:2206-2222
// ============================================

// ORIGINAL (for source lookup):
function LF(A) {
    let q = Jz();
    q.currentSessionTitle = A.customTitle ?? null;
    q.currentSessionTag = A.tag ?? null;
    q.currentSessionAgentName = A.agentName ?? null;
    q.currentSessionAgentColor = A.agentColor ?? null;
    q.currentSessionAgentSetting = A.agentSetting ?? null;
    q.currentSessionMode = A.mode ?? null;
    q.currentSessionPrNumber = A.prNumber ?? null;
    q.currentSessionPrUrl = A.prUrl ?? null;
    q.currentSessionPrRepository = A.prRepository ?? null;
}

// READABLE (for understanding):
function setSessionMetadata(transcript) {
    let persistence = getSessionPersistence();
    persistence.currentSessionTitle = transcript.customTitle ?? null;
    persistence.currentSessionTag = transcript.tag ?? null;
    persistence.currentSessionAgentName = transcript.agentName ?? null;
    persistence.currentSessionAgentColor = transcript.agentColor ?? null;
    persistence.currentSessionAgentSetting = transcript.agentSetting ?? null;
    persistence.currentSessionMode = transcript.mode ?? null;
    persistence.currentSessionPrNumber = transcript.prNumber ?? null;
    persistence.currentSessionPrUrl = transcript.prUrl ?? null;
    persistence.currentSessionPrRepository = transcript.prRepository ?? null;
}

// Mapping: LF→setSessionMetadata, Jz→getSessionPersistence
```

This ensures all 9 metadata fields are restored to the `SessionPersistence` singleton so they can be re-appended to the session file on exit.

### Interrupted Turn Detection Algorithm (`MVY` - chunks.135.mjs:2519-2560)

```javascript
// ============================================
// detectInterruptionState - Determines if last turn was interrupted
// Location: chunks.135.mjs:2519-2560
// ============================================

// READABLE (for understanding):
function detectInterruptionState(messages) {
    // Find last non-system, non-meta message
    let lastRealMessage = null;
    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];
        if (msg.type !== "system" && !msg.isMeta) {
            lastRealMessage = msg;
            break;
        }
    }

    if (!lastRealMessage) return { kind: "normal" };

    // Case 1: Last real message is assistant with pending tool_use
    if (lastRealMessage.type === "assistant") {
        let content = lastRealMessage.message?.content;
        if (Array.isArray(content)) {
            let hasToolUse = content.some(block => block.type === "tool_use");
            let hasToolResult = messages.some(m =>
                m.type === "user" && m.message?.content?.some?.(
                    block => block.type === "tool_result"
                )
            );
            if (hasToolUse && !hasToolResult) {
                return { kind: "interrupted_turn" };
            }
        }
    }

    // Case 2: Last real message is user with attachment
    if (lastRealMessage.type === "user" && lastRealMessage.attachmentType) {
        return { kind: "interrupted_prompt" };
    }

    return { kind: "normal" };
}

// Mapping: MVY→detectInterruptionState
```

**Three possible states:**

| State | Condition | Action on Resume |
|-------|-----------|-----------------|
| `normal` | Last message completed normally | No special handling |
| `interrupted_turn` | Assistant had pending `tool_use` without `tool_result` | Inject "Continue from where you left off." meta message |
| `interrupted_prompt` | User had an attachment-type message pending | Inject continuation hint |

**Why this matters:** Without interrupted turn detection, resuming a session where Claude was mid-tool-use would cause Claude to restart from scratch. The detection + continuation message allows Claude to seamlessly pick up multi-step operations (e.g., a partially completed code refactoring).

### Headless (Print Mode) Resume (`QXz` - chunks.187.mjs:1376-1465)

```javascript
// ============================================
// resumeInPrintMode - Resume session in non-interactive mode
// Location: chunks.187.mjs:1376-1465
// ============================================

// READABLE pseudocode:
async function resumeInPrintMode(options) {
    let { continue: shouldContinue, resume, forkSession,
          resumeSessionAt, rewindFiles } = options;

    // 1. Determine session to resume
    let sessionId = null;
    if (shouldContinue) {
        sessionId = undefined;  // → getMostRecentSession
    } else if (resume) {
        sessionId = typeof resume === "string" ? resume : undefined;
    }

    // 2. Load transcript
    let transcript = await loadTranscript(sessionId, undefined);
    if (!transcript) throw Error("No conversation to resume");

    // 3. Handle --rewind-files (exit after rewind)
    if (rewindFiles) {
        let result = await rewindFilesToMessage(transcript.messages, rewindFiles,
                                                 transcript.fileHistorySnapshots);
        process.exit(result.success ? 0 : 1);
    }

    // 4. Handle --resume-session-at (truncate messages)
    if (resumeSessionAt) {
        let idx = transcript.messages.findIndex(m => m.uuid === resumeSessionAt);
        if (idx >= 0) transcript.messages = transcript.messages.slice(0, idx + 1);
    }

    // 5. Restore metadata
    setSessionMetadata(transcript);

    // 6. Fork or resume session file
    if (!forkSession && transcript.sessionId) {
        setSessionId(transcript.sessionId);
        resetSessionFile();
        reconnectSessionFile(transcript.sessionId);
    }

    // 7. Return loaded messages for the headless loop
    return transcript;
}
```

**Key difference from interactive resume:** Print mode resume skips the UI components (ConversationPicker, WrongDirectoryDialog) and directly loads + processes the transcript. It supports additional flags like `--resume-session-at` (truncate to specific message) that are not available in interactive mode.

### Startup Hook Skipping on Resume (chunks.198.mjs:517)

```javascript
// When resuming, startup hooks are skipped because the session already ran them:
if (sdkUrl || sdkStdin || fromPr || teleport || options.continue || options.resume) {
    // Skip startup hooks - they ran in the original session
} else {
    await runStartupHooks();
}
```

**Why skip:** Startup hooks (e.g., project setup scripts) should only run once per session, not on every resume. Running them again could cause duplicate side effects.

### Agent Definition Resolution on Resume (`K26`)

```javascript
// ============================================
// resolveAgentSetting - Resolves saved agent definition
// Location: chunks.180.mjs:2365-2384
// ============================================

// READABLE:
function resolveAgentSetting(savedSetting, mainThreadDef, allDefinitions) {
    if (!savedSetting) {
        return { agentDefinition: mainThreadDef, agentType: mainThreadDef?.agentType };
    }

    // Try to find matching agent in current definitions
    let match = allDefinitions.allAgents.find(a =>
        a.agentType === savedSetting.agentType
    );

    if (match) {
        return { agentDefinition: match, agentType: match.agentType };
    }

    // Fallback: use main thread definition if saved agent no longer exists
    return { agentDefinition: mainThreadDef, agentType: mainThreadDef?.agentType };
}

// Mapping: K26→resolveAgentSetting
```

**Graceful degradation:** If the agent definition that was active during the original session no longer exists (e.g., agent config was removed), the system falls back to the main thread's default agent definition rather than failing.
