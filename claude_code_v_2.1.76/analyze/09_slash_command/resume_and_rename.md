# `/resume` and `/rename` — Deep Reverse Engineering Analysis

## Overview

`/resume` and `/rename` are two complementary slash commands that together form the **session lifecycle management** surface of Claude Code. `/resume` is a rich `local-jsx` command with a multi-mode interactive picker UI, agentic AI search, cross-project navigation, and direct-ID/title lookup. `/rename` is a simpler `local` command that sets a persistent custom title for the current session — but its logic also appears inline inside the `/resume` picker via `Ctrl+R`.

This document traces every code path from user input through state management, persistence, and UI rendering.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Skills
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Session state (resumeSession)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions/components in this document:

**`/resume` — Registration & Dispatch**
- `i8z` (NYq init) - `/resume` command definition object (chunks.161.mjs:2560)
- `l8z` - `/resume` handler: args routing (chunks.161.mjs:2466)
- `c8z` - `/resume` interactive component (chunks.161.mjs:2388)
- `WN6` - Session picker UI — the main multi-mode picker (chunks.161.mjs:1227)

**`/resume` — Picker Sub-components**
- `KYq` - Session transcript preview (chunks.161.mjs:930)
- `_Yq` - Project tab bar (chunks.161.mjs:1057)
- `ZN6` - Cross-project resume resolver (chunks.161.mjs:2178)
- `fN6` - Agentic AI search (chunks.161.mjs:2244)
- `p8z` - Agentic search system prompt (chunks.161.mjs:2303)
- `GYq` - Error message formatter (chunks.161.mjs:2349)
- `zuA` - Error display component (chunks.161.mjs:2358)

**`/resume` — Session Data Layer**
- `wuA` - All-projects session loader (chunks.173.mjs:2609)
- `VN6` - Per-CWD session loader (chunks.173.mjs:2663)
- `TI` - Lazy session loader (loads full transcript from disk) (chunks.173.mjs:2380)
- `sR` - Lazy session detector (checks if messages are empty) (chunks.173.mjs:2376)
- `Xw` - Get session ID from log (chunks.173.mjs:2371)
- `$F` - Fuzzy title search (chunks.173.mjs:2433)
- `xv` - UUID validator (chunks.90.mjs:2338)
- `yt` - `resumeSession` function (restores conversation state) (chunks.142.mjs:379)

**`/resume` — Display Utilities**
- `Gi` - Session display title builder (chunks.9.mjs:1289)
- `_C1` - Session timestamp formatter (chunks.47.mjs:1332)
- `sbA` - Session label builder with truncation (chunks.161.mjs:1210)
- `tbA` - Session description builder (chunks.161.mjs:1219)
- `B8z` - Session filter predicate (chunks.161.mjs:2077)
- `Q8z` - Searchable text builder (chunks.161.mjs:2104)
- `g8z` - Fork group builder (chunks.161.mjs:2110)
- `U8z` - Unique tag extractor (chunks.161.mjs:2123)
- `h8z` - Search snippet extractor (chunks.161.mjs:1194)
- `abA` - Snippet highlight formatter (chunks.161.mjs:1186)

**`/rename` — Command**
- `CAz` (t5q init) - `/rename` command definition object (chunks.160.mjs:1613)
- `yAz` - `/rename` handler (chunks.160.mjs:1570)
- `Q91` - `saveCustomTitle` — persist rename to JSONL log (chunks.173.mjs:2264)
- `nL7` - `setTerminalTitle` — propagate rename to terminal title (chunks.76.mjs:583)

---

## Part 1: Command Definitions & Registration

### `/resume` Command Definition (`i8z`, NYq initializer)

```javascript
// ============================================
// resumeCommandDefinition - /resume slash command object
// Location: chunks.161.mjs:2560-2573
// ============================================

// ORIGINAL (for source lookup):
NYq = v(() => {
    i8z = {
        type: "local-jsx",
        name: "resume",
        description: "Resume a previous conversation",
        aliases: ["continue"],
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[conversation id or search term]",
        load: () => Promise.resolve().then(() => (fYq(), ZYq)),
        userFacingName() { return "resume" }
    }, VYq = i8z
})

// READABLE (for understanding):
resumeCommandDefinition = {
    type: "local-jsx",                    // renders a React/Ink UI component
    name: "resume",
    description: "Resume a previous conversation",
    aliases: ["continue"],               // /continue is an alias for /resume
    isEnabled: () => true,
    isHidden: false,
    argumentHint: "[conversation id or search term]",  // shows in autocomplete hint
    load: () => Promise.resolve().then(() => {
        initResumeModule();              // fYq: loads React, state, session modules
        return resumeModuleExports;      // ZYq: the module's export object
    }),
    userFacingName() { return "resume" }
}

// Mapping: i8z→resumeCommandDefinition, NYq→registerResumeCommand, fYq→initResumeModule, ZYq→resumeModuleExports, VYq→resumeCommandRef
```

**Key design choices:**
- `type: "local-jsx"` — the command renders an Ink React component. The user sees a full-screen interactive session picker rather than a static text response.
- `aliases: ["continue"]` — `/continue` is a natural-language alias accepted by the command resolver (`isCommandAvailable`, `findCommand`).
- `argumentHint` is displayed in the autocomplete picker as a ghost suffix after `/resume`.
- The `load()` uses a lazy-initialization pattern (`fYq()`) to defer loading all the React dependencies (Ink, Fuse.js, session modules) until the command is actually invoked.

### `/rename` Command Definition (`CAz`, t5q initializer)

```javascript
// ============================================
// renameCommandDefinition - /rename slash command object
// Location: chunks.160.mjs:1612-1626
// ============================================

// ORIGINAL (for source lookup):
t5q = v(() => {
    CAz = {
        type: "local",
        name: "rename",
        description: "Rename the current conversation",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        argumentHint: "<name>",
        load: () => Promise.resolve().then(() => (a5q(), o5q)),
        userFacingName() { return "rename" }
    }, s5q = CAz
})

// READABLE (for understanding):
renameCommandDefinition = {
    type: "local",                     // synchronous, non-JSX
    name: "rename",
    description: "Rename the current conversation",
    isEnabled: () => true,
    isHidden: false,
    supportsNonInteractive: false,     // cannot be used in --print mode
    argumentHint: "<name>",            // required argument
    load: () => Promise.resolve().then(() => {
        initRenameModule();            // a5q
        return renameModuleExports;    // o5q
    }),
    userFacingName() { return "rename" }
}

// Mapping: CAz→renameCommandDefinition, t5q→registerRenameCommand, a5q→initRenameModule, o5q→renameModuleExports
```

**Key distinction from `/resume`:** `/rename` is `type: "local"` (not `"local-jsx"`), meaning it executes synchronously and returns a text result. No interactive UI is needed — the user provides the new name directly as an argument.

---

## Part 2: `/resume` Handler — Argument Routing (`l8z`)

This is the entry point called by `executeCommand` (ifY) after the command is loaded. It receives `(onDone, toolUseContext, args)` and routes based on whether `args` is empty, a UUID, an exact title match, or neither.

```javascript
// ============================================
// resumeHandler - /resume command dispatcher
// Location: chunks.161.mjs:2466-2532
// ============================================

// ORIGINAL (for source lookup):
l8z = async (A, q, K) => {
    u8("resume");
    let Y = async (_, J, X) => {
        try {
            await q.resume?.(_, J, X), A(void 0, { display: "skip" })
        } catch (D) {
            K1(D), A(`Failed to resume: ${D.message}`)
        }
    }, z = K?.trim();
    if (!z) return $5.createElement(c8z, { key: Date.now(), onDone: A, onResume: Y });
    let w = await jc(y8()),
        H = await VN6(w);
    if (H.length === 0) return $5.createElement(zuA, {
        message: "No conversations found to resume.", args: z,
        onDone: () => A("No conversations found to resume.")
    });
    let $ = xv(z);
    if ($) {
        let _ = H.filter((J) => Xw(J) === $).sort((J, X) => X.modified.getTime() - J.modified.getTime());
        if (_.length > 0) {
            let J = _[0], X = sR(J) ? await TI(J) : J;
            return Y($, X, "slash_command_session_id"), null
        }
    }
    if (Gc()) {
        let _ = await $F(z, { exact: !0 });
        if (_.length === 1) {
            let J = _[0], X = Xw(J);
            if (X) {
                let D = sR(J) ? await TI(J) : J;
                return Y(X, D, "slash_command_title"), null
            }
        }
        if (_.length > 1) {
            let J = GYq({ resultType: "multipleMatches", arg: z, count: _.length });
            return $5.createElement(zuA, { message: J, args: z, onDone: () => A(J) })
        }
    }
    let O = GYq({ resultType: "sessionNotFound", arg: z });
    return $5.createElement(zuA, { message: O, args: z, onDone: () => A(O) })
}

// READABLE (for understanding):
resumeHandler = async (onDone, toolUseContext, args) => {
    trackUISection("resume");  // u8: for telemetry

    // 1. Create onResume callback — passed down to the interactive picker
    let resumeAndDismiss = async (sessionId, sessionLog, source) => {
        try {
            await toolUseContext.resume?.(sessionId, sessionLog, source);
            onDone(undefined, { display: "skip" });   // dismiss without output
        } catch (err) {
            logError(err);
            onDone(`Failed to resume: ${err.message}`);
        }
    };

    let query = args?.trim();

    // Path A: No args → show interactive picker
    if (!query) {
        return <ResumeInteractiveUI key={Date.now()} onDone={onDone} onResume={resumeAndDismiss} />;
    }

    // Load session list for current CWDs
    let cwds = await getAllCwds(getCurrentCwd());   // jc(y8())
    let sessions = await loadSessionsForCwds(cwds); // VN6
    if (sessions.length === 0) {
        return <ResumeErrorUI message="No conversations found to resume." args={query} onDone={() => onDone("No conversations found to resume.")} />;
    }

    // Path B: Args looks like a UUID → direct session ID lookup
    let validUUID = parseUUID(query);  // xv: returns UUID string or null
    if (validUUID) {
        let matchingSessions = sessions
            .filter(s => getSessionId(s) === validUUID)          // Xw(s) === validUUID
            .sort((a, b) => b.modified.getTime() - a.modified.getTime());
        if (matchingSessions.length > 0) {
            let session = matchingSessions[0];
            let fullSession = isLazy(session) ? await loadFull(session) : session;  // sR + TI
            return resumeAndDismiss(validUUID, fullSession, "slash_command_session_id"), null;
        }
    }

    // Path C: Args is a title string → exact title search
    if (isFuzzySearchEnabled()) {  // Gc()
        let titleMatches = await searchByTitle(query, { exact: true });  // $F
        if (titleMatches.length === 1) {
            let session = titleMatches[0];
            let sessionId = getSessionId(session);
            if (sessionId) {
                let fullSession = isLazy(session) ? await loadFull(session) : session;
                return resumeAndDismiss(sessionId, fullSession, "slash_command_title"), null;
            }
        }
        if (titleMatches.length > 1) {
            let msg = formatResumeError({ resultType: "multipleMatches", arg: query, count: titleMatches.length });
            return <ResumeErrorUI message={msg} args={query} onDone={() => onDone(msg)} />;
        }
    }

    // Path D: Not found
    let errorMsg = formatResumeError({ resultType: "sessionNotFound", arg: query });
    return <ResumeErrorUI message={errorMsg} args={query} onDone={() => onDone(errorMsg)} />;
};

// Mapping: l8z→resumeHandler, A→onDone, q→toolUseContext, K→args, Y→resumeAndDismiss,
//          u8→trackUISection, xv→parseUUID, jc→getAllCwds, y8→getCurrentCwd,
//          VN6→loadSessionsForCwds, Xw→getSessionId, sR→isLazy, TI→loadFull,
//          Gc→isFuzzySearchEnabled, $F→searchByTitle, GYq→formatResumeError,
//          c8z→ResumeInteractiveUI, zuA→ResumeErrorUI
```

### How the four routing paths work

**Why `key={Date.now()}` on the interactive picker?**
Each invocation of `/resume` creates a fresh React component instance. Without `key`, React would reuse the existing instance and the picker would retain its previous scroll position and selection. Using the timestamp as key forces a full re-mount.

**Why `display: "skip"` on successful resume?**
When resume succeeds, the entire conversation is replaced by the loaded history. Adding a "Resume cancelled" message to the conversation would be confusing. `display: "skip"` causes `executeCommand` (ifY) to return `{ messages: [], shouldQuery: false }` — no visible output in the chat history.

**The `Gc()` gate on title search:**
`Gc` checks whether fuzzy search (FuseJS) is available/enabled. On minimal builds or in certain environments, title search may be disabled. This gate prevents a `$F` call that would fail.

**`sR` + `TI` lazy loading pattern:**
Sessions returned from `VN6` (the session list loader) may be "lazy" — they have the metadata (title, modified date, session ID) but `messages` is empty. `sR(session)` detects this by checking `session.messages.length === 0 && session.sessionId !== undefined`. `TI(session)` fully loads the JSONL file from disk to populate the messages array. This two-phase loading is critical for performance — the session list loads quickly with just stat data.

---

## Part 3: Session Display Utility Functions

Before diving into the UI, it's important to understand how sessions are described.

### `Gi` — Session Display Title Builder

```javascript
// ============================================
// getSessionDisplayTitle - Build human-readable title for a session log
// Location: chunks.9.mjs:1289-1294
// ============================================

// ORIGINAL (for source lookup):
function Gi(A, q) {
    let K = A.firstPrompt?.startsWith(`<${JC}>`),  // JC = "tick" tag (autonomous session marker)
        Y = A.firstPrompt && A.firstPrompt !== "" && !K,
        z = A.agentName || A.customTitle || A.summary
            || (Y ? A.firstPrompt : void 0)
            || q
            || (K ? "Autonomous session" : void 0)
            || (A.sessionId ? A.sessionId.slice(0, 8) : "")
            || "";
    return to1(z).trim()   // to1 = stripAnsi (remove terminal color codes)
}

// READABLE (for understanding):
function getSessionDisplayTitle(sessionLog, fallbackTitle) {
    let isAutonomousSession = sessionLog.firstPrompt?.startsWith(`<${TICK_TAG}>`);
    let hasRealFirstPrompt = sessionLog.firstPrompt && sessionLog.firstPrompt !== "" && !isAutonomousSession;

    let title = sessionLog.agentName             // 1. Agent name (highest priority)
             || sessionLog.customTitle           // 2. User-set custom title (/rename)
             || sessionLog.summary              // 3. AI-generated summary
             || (hasRealFirstPrompt ? sessionLog.firstPrompt : undefined)  // 4. First user message
             || fallbackTitle                   // 5. Caller-provided fallback
             || (isAutonomousSession ? "Autonomous session" : undefined)   // 6. Autonomous fallback
             || (sessionLog.sessionId ? sessionLog.sessionId.slice(0, 8) : "")  // 7. Session ID prefix
             || "";

    return stripAnsi(title).trim();
}

// Mapping: Gi→getSessionDisplayTitle, A→sessionLog, q→fallbackTitle, K→isAutonomousSession,
//          Y→hasRealFirstPrompt, to1→stripAnsi, JC→TICK_TAG
```

**Priority chain design rationale:**
The 7-level priority ensures every session has a displayable title. Users may have never typed anything (autonomous sessions), may have set a custom title, or the AI may have generated a summary. The session ID fallback (first 8 hex chars) ensures even empty sessions are distinguishable.

### `Xw` — Get Session ID from Log

```javascript
// ============================================
// getSessionId - Extract session ID from log object
// Location: chunks.173.mjs:2371-2374
// ============================================

// ORIGINAL:
function Xw(A) {
    if (A.sessionId) return A.sessionId;
    return A.messages[0]?.sessionId
}
// READABLE:
function getSessionId(log) {
    if (log.sessionId) return log.sessionId;
    return log.messages[0]?.sessionId;  // older format: sessionId on first message
}
// Mapping: Xw→getSessionId
```

Two-level fallback handles both new-format logs (top-level `sessionId`) and old-format logs (sessionId on first message only).

### `Q8z` — Searchable Text Builder (for Fuse.js / agentic search)

```javascript
// ============================================
// buildSearchableText - Build indexed text string for session search
// Location: chunks.161.mjs:2104-2108
// ============================================

// ORIGINAL (for source lookup):
function Q8z(A) {
    let K = (A.messages.length <= y8z ? A.messages : [...A.messages.slice(0, XYq), ...A.messages.slice(-XYq)])
        .map(F8z).filter(Boolean).join(" "),
        z = `${[A.customTitle, A.summary, A.firstPrompt, A.gitBranch, A.tag,
                 A.prNumber ? `PR #${A.prNumber}` : void 0, A.prRepository].filter(Boolean).join(" ")} ${K}`.trim();
    return z.length > DYq ? z.slice(0, DYq) : z
}
// y8z = 2000 (max messages before truncation), XYq = 1000 (head/tail slice), DYq = 50000 (max chars)

// READABLE:
function buildSearchableText(log) {
    // For large sessions: take first 1000 + last 1000 messages (not all 10k+)
    let messageSample = log.messages.length <= 2000
        ? log.messages
        : [...log.messages.slice(0, 1000), ...log.messages.slice(-1000)];
    let messageText = messageSample.map(extractMessageText).filter(Boolean).join(" ");  // F8z

    let metadataText = [
        log.customTitle, log.summary, log.firstPrompt, log.gitBranch, log.tag,
        log.prNumber ? `PR #${log.prNumber}` : undefined, log.prRepository
    ].filter(Boolean).join(" ");

    let combined = `${metadataText} ${messageText}`.trim();
    return combined.length > 50000 ? combined.slice(0, 50000) : combined;  // cap at 50k chars
}
// Mapping: Q8z→buildSearchableText, F8z→extractMessageText, y8z→2000, XYq→1000, DYq→50000
```

---

## Part 4: `/resume` Interactive Component (`c8z`)

When called with no args, `l8z` renders `c8z`. This component handles initial data loading, all-projects toggle, and cross-project session detection.

```javascript
// ============================================
// ResumeInteractiveUI - Top-level /resume interactive component
// Location: chunks.161.mjs:2388-2461
// ============================================

// ORIGINAL (for source lookup):
function c8z({ onDone: A, onResume: q }) {
    let [K, Y] = $5.useState([]),   // sessions list
        [z, w] = $5.useState([]),   // all cwds array
        [H, $] = $5.useState(!0),   // isLoading
        [O, _] = $5.useState(!1),   // isResuming
        [J, X] = $5.useState(!1),   // showAllProjects
        { rows: D } = Z8(),          // terminal rows
        j = $5.useCallback(async (f, Z) => { /* loadSessions */ }, [A]);
    $5.useEffect(() => {
        async function f() {
            let Z = await jc(y8());   // jc = getAllCwds, y8 = getCurrentCwd
            w(Z), j(!1, Z)
        }
        f()
    }, [j]);
    let M = $5.useCallback(() => {
        let f = !J; X(f), j(f, z)
    }, [J, j, z]);
    async function P(f) {  // onSelect
        let Z = xv(Xw(f));
        if (!Z) { A("Failed to resume conversation"); return }
        let N = sR(f) ? await TI(f) : f,
            T = ZN6(N, J, z);   // crossProjectCheck
        if (T.isCrossProject) {
            if (T.isSameRepoWorktree) { _(!0), q(Z, N, "slash_command_picker"); return }
            await l0(T.command);   // l0 = copyToClipboard
            A(["", "This conversation is from a different directory.", "", "To resume, run:",
               `  ${T.command}`, "", "(Command copied to clipboard)", ""].join("\n"),
               { display: "user" });
            return
        }
        _(!0), q(Z, N, "slash_command_picker")
    }
    function W() { A("Resume cancelled", { display: "system" }) }  // onCancel
    let G = K.filter((f) => !f.isSidechain);  // exclude sidechain sessions
    if (H) return <Spinner> Loading conversations…</Spinner>;
    if (O) return <Spinner> Resuming conversation…</Spinner>;
    return <SessionPickerUI logs={G} maxHeight={D - 2} onCancel={W} onSelect={P}
             onLogsChanged={() => j(J, z)} showAllProjects={J}
             onToggleAllProjects={M} onAgenticSearch={fN6} />
}

// READABLE (for understanding):
function ResumeInteractiveUI({ onDone, onResume }) {
    let [sessions, setSessions] = useState([]);
    let [allCwds, setAllCwds] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [isResuming, setIsResuming] = useState(false);
    let [showAllProjects, setShowAllProjects] = useState(false);
    let { rows: terminalRows } = useTerminalSize();

    // Initial load: get all cwds, then load sessions for them
    let loadSessions = useCallback(async (allProjects, cwds) => {
        setIsLoading(true);
        try {
            let sessionList = allProjects
                ? await loadAllProjectSessions()       // wuA: scans ~/.claude/projects/
                : await loadSessionsForCwds(cwds);    // VN6: scans sessions for specific cwds
            if (sessionList.length === 0) {
                onDone("No conversations found to resume"); return;
            }
            setSessions(sessionList);
        } catch (err) {
            onDone("Failed to load conversations");
        } finally { setIsLoading(false); }
    }, [onDone]);

    useEffect(() => {
        async function init() {
            let cwds = await getAllCwds(getCurrentCwd());  // jc(y8())
            setAllCwds(cwds);
            loadSessions(false, cwds);
        }
        init();
    }, [loadSessions]);

    let toggleAllProjects = useCallback(() => {
        let newVal = !showAllProjects;
        setShowAllProjects(newVal);
        loadSessions(newVal, allCwds);
    }, [showAllProjects, loadSessions, allCwds]);

    async function onSelect(sessionLog) {
        let sessionId = parseUUID(getSessionId(sessionLog));
        if (!sessionId) { onDone("Failed to resume conversation"); return; }

        // Lazy-load full transcript if needed
        let fullSession = isLazy(sessionLog) ? await loadFull(sessionLog) : sessionLog;

        // Check for cross-project session
        let crossProjectResult = checkCrossProject(fullSession, showAllProjects, allCwds);
        if (crossProjectResult.isCrossProject) {
            if (crossProjectResult.isSameRepoWorktree) {
                // Same git repo, different worktree → resume normally
                setIsResuming(true);
                onResume(sessionId, fullSession, "slash_command_picker");
                return;
            }
            // Different project → can't resume in-place; copy resume command to clipboard
            await copyToClipboard(crossProjectResult.command);
            onDone([
                "", "This conversation is from a different directory.", "",
                "To resume, run:", `  ${crossProjectResult.command}`,
                "", "(Command copied to clipboard)", ""
            ].join("\n"), { display: "user" });
            return;
        }

        setIsResuming(true);
        onResume(sessionId, fullSession, "slash_command_picker");
    }

    function onCancel() { onDone("Resume cancelled", { display: "system" }); }

    let visibleSessions = sessions.filter(s => !s.isSidechain);

    if (isLoading) return <Spinner> Loading conversations…</Spinner>;
    if (isResuming) return <Spinner> Resuming conversation…</Spinner>;

    return (
        <SessionPickerUI
            logs={visibleSessions}
            maxHeight={terminalRows - 2}
            onCancel={onCancel}
            onSelect={onSelect}
            onLogsChanged={() => loadSessions(showAllProjects, allCwds)}
            showAllProjects={showAllProjects}
            onToggleAllProjects={toggleAllProjects}
            onAgenticSearch={agenticSearch}
        />
    );
}

// Mapping: c8z→ResumeInteractiveUI, K→sessions, z→allCwds, H→isLoading, O→isResuming,
//          J→showAllProjects, j→loadSessions, M→toggleAllProjects, P→onSelect, W→onCancel,
//          ZN6→checkCrossProject, l0→copyToClipboard, G→visibleSessions, fN6→agenticSearch
```

**Key design decisions:**

1. **Sidechain filtering**: `G = K.filter(s => !s.isSidechain)` excludes sidechain sessions (branches of a forked conversation that aren't the main line). The picker only shows primary sessions.

2. **Two loading states**: `isLoading` (data fetch) vs `isResuming` (session state restoration) show different spinners. This prevents flickering between states and makes the delay visible.

3. **Cross-project clipboard copy**: For sessions from a different project directory (different `projectPath`), the resume command `cd /path && claude --resume <id>` is copied to clipboard and shown. This handles the case gracefully since in-place resume would load the wrong project context.

4. **`display: "system"` for cancel**: When the user cancels, "Resume cancelled" is injected as a system message (invisible in normal view) rather than a user message. This avoids polluting the conversation history with noise.

---

## Part 5: Cross-Project Resume Resolver (`ZN6`)

```javascript
// ============================================
// checkCrossProjectResume - Determine if resuming requires directory change
// Location: chunks.161.mjs:2178-2203
// ============================================

// ORIGINAL (for source lookup):
function ZN6(A, q, K) {
    let Y = y8();
    if (!q || !A.projectPath || A.projectPath === Y) return { isCrossProject: !1 };
    {
        let $ = Xw(A);
        return {
            isCrossProject: !0,
            isSameRepoWorktree: !1,
            command: `cd ${R7([A.projectPath])} && claude --resume ${$}`,
            projectPath: A.projectPath
        }
    }
    if (K.some(($) => A.projectPath === $ || A.projectPath.startsWith($ + "/")))
        return { isCrossProject: !0, isSameRepoWorktree: !0, projectPath: A.projectPath };
    let w = Xw(A);
    return {
        isCrossProject: !0, isSameRepoWorktree: !1,
        command: `cd ${R7([A.projectPath])} && claude --resume ${w}`,
        projectPath: A.projectPath
    }
}

// READABLE (for understanding):
function checkCrossProjectResume(sessionLog, showingAllProjects, allCwds) {
    let currentCwd = getCurrentCwd();

    // If not in all-projects mode, or session has no projectPath, or same project → no cross-project
    if (!showingAllProjects || !sessionLog.projectPath || sessionLog.projectPath === currentCwd) {
        return { isCrossProject: false };
    }

    // NOTE: There's unreachable code here — the return above the worktree check always fires.
    // The intended logic was:
    // 1. Check if session's projectPath is within one of the current worktrees → isSameRepoWorktree
    // 2. Otherwise → different project, generate cd command

    let sessionId = getSessionId(sessionLog);  // Xw
    return {
        isCrossProject: true,
        isSameRepoWorktree: false,
        command: `cd ${shellEscape([sessionLog.projectPath])} && claude --resume ${sessionId}`,  // R7 = shellEscape
        projectPath: sessionLog.projectPath
    };
}

// Mapping: ZN6→checkCrossProjectResume, A→sessionLog, q→showingAllProjects, K→allCwds,
//          Y→currentCwd, $→sessionId, R7→shellEscape, Xw→getSessionId
```

**Note on unreachable code:** There is dead code in `ZN6` — the worktree check (`K.some(...)`) is after an unconditional `return` block. This means `isSameRepoWorktree: true` is never returned. The code was likely refactored (worktree handling was added and then simplified back), leaving the dead path. The actual behavior is: any cross-project session → copy the `cd && claude --resume` command to clipboard.

---

## Part 6: Main Session Picker UI (`WN6`) — The Multi-Mode State Machine

`WN6` is the heart of the `/resume` UI. It manages 255 memoized React values (the largest component in the codebase visible in the source) and implements a complex modal state machine.

### State Variables

```javascript
// State declarations in WN6 (chunks.161.mjs:1227-1281):
let [gitBranch, setGitBranch] = useState(null);            // g/U: current git branch filter
let [filterByBranch, setFilterByBranch] = useState(false); // x/p: is branch filter active?
let [filterByWorktree, setFilterByWorktree] = useState(false); // l/r
let [hasMultipleWorktrees, setHasMultipleWorktrees] = useState(false); // s/O1
let [renameInput, setRenameInput] = useState("");           // j1/q1: text in rename input box
let [renameCursor, setRenameCursor] = useState(0);         // t/J1: cursor offset in rename input
let [expandedGroups, setExpandedGroups] = useState(new Set()); // Z1/E1: expanded fork groups
let [focusedItem, setFocusedItem] = useState(null);        // a/A1: currently focused session item
let [loadedCount, setLoadedCount] = useState(1);           // M1/z1: pagination counter
let [mode, setMode] = useState("list");                    // Y1/_1: "list"|"search"|"rename"|"preview"
let [previewSession, setPreviewSession] = useState(null);  // $1/G1: session shown in preview
let [selectedTabIndex, setSelectedTabIndex] = useState(0); // x1/f1: which tag tab is selected
let [agenticState, setAgenticState] = useState({ status: "idle" }); // H1/y1: "idle"|"searching"|"results"|"error"
let [isSearchLoading, setIsSearchLoading] = useState(false); // B1/A6
```

### Mode State Machine

The `mode` state has 4 values. Each value changes the available keyboard shortcuts and which widget is rendered in the list area (`cJ`):

```
┌─────────────────────────────────────────────────────────────────┐
│  mode = "list"  (default)                                       │
│  Controls: arrows=navigate, Enter=select, Ctrl+V=preview,       │
│            Ctrl+R=rename, Ctrl+B=branch toggle,                 │
│            Ctrl+W=worktree toggle, Ctrl+A=all-projects,         │
│            Tab=next tag, /=search, any char=search              │
│                                                                 │
│  ↓ User presses /                    ↓ User presses Ctrl+R      │
│                                                                 │
│  mode = "search"                     mode = "rename"            │
│  Controls: Type to filter,           Controls: Type new name,   │
│            Enter=select,             Enter=save,                │
│            Esc=clear/exit            Esc=cancel                 │
│                                                                 │
│  ↓ User presses Ctrl+V                                          │
│                                                                 │
│  mode = "preview"                                               │
│  Controls: Full transcript view,                                │
│            Enter=resume, Esc=back                               │
└─────────────────────────────────────────────────────────────────┘
```

**Mode transition code (keyboard handler `IH`):**
```javascript
// Line 1725-1783 of chunks.161.mjs:
// Y1 = mode, _1 = setMode
if (Y1 === "preview") return;                    // preview captures its own keys via KYq
if (H1.status === "searching") return;           // agentic search → block input
if (Y1 === "rename") { /* handled by text input component */ }
else if (Y1 === "search") {
    if (key === "n" && ctrl) stopSearch();        // Ctrl+N exits search
} else { // "list" mode
    if (key === "r" && ctrl && f8) {
        setMode("rename");
        setRenameInput("");
        telemetry("tengu_session_rename_started", {});
    }
    if (key === "v" && ctrl && f8) {
        setPreviewSession(f8);                   // f8 = focused session
        setMode("preview");
        telemetry("tengu_session_preview_opened", { messageCount: f8.messageCount });
    }
    if (key === "b" && ctrl) {
        let newVal = !filterByBranch;
        setFilterByBranch(newVal);
        telemetry("tengu_session_branch_filter_toggled", { enabled: newVal });
    }
    if (key === "/" && !modifiers) {
        setMode("search");
        telemetry("tengu_session_search_toggled", { enabled: true });
    }
    // Any printable char → jump to search mode with that char pre-filled
    if (f8 && !modifiers && char.length > 0 && !/^\s+$/.test(char)) {
        setMode("search");
        setSearchQuery(char);
        telemetry("tengu_session_search_toggled", { enabled: true });
    }
}
```

### Filtering Pipeline

The session list goes through up to 4 sequential filter stages before being displayed:

```
All sessions (K)
│
├─ [if showAllProjects] Filter B8z (isWorthShowing):
│    keep if: current session OR has customTitle OR has agentic messages OR has firstPrompt
│
├─ [if tag filter active] Filter by tag === selectedTag
│
├─ [if branch filter active] Filter by gitBranch === currentBranch
│
├─ [if worktree filter active] Filter by projectPath === currentCwd
│
└─ [if search query] Inline text search:
     checks: title, gitBranch, tag, prNumber against lowercased query

Final list: `Oq` (displayed sessions)
│
├─ [if agentic results] Prepend agentic results to Oq
└─ Display as tree nodes (_3) or flat list (F7)
```

**`B8z` — isWorthShowing filter:**
```javascript
// ORIGINAL:
function B8z(A) {
    let q = U6(), K = Xw(A);             // U6 = getCurrentSessionId
    if (q && K === q) return !0;          // always show current session
    if (A.customTitle) return !0;         // show if user has named it
    if (GN6(A.messages)) return !0;       // GN6: has agentic tool-use messages
    if (A.firstPrompt || A.customTitle) return !0;  // has content
    return !1
}
```

This filter is only applied when `showAllProjects === true`. The rationale: when showing all projects, there may be hundreds of empty sessions. `B8z` culls sessions that are likely empty/meaningless.

### Session List Rendering: Grouped vs Flat

The list is rendered in two modes depending on whether `N` (isForkGroupingEnabled) is true:

**Grouped mode (`_3` / `e5q` tree component):**
- `g8z(Oq)` builds a `Map<sessionId, sessionLog[]>` grouping fork branches together
- Each group header shows `(+N other sessions)` suffix
- Groups can be expanded/collapsed with left/right arrow keys
- `isNodeExpanded` callback checks `expandedGroups` Set

**Flat mode (`F7` / `kA` select component):**
- Sessions rendered as simple list options with label + description

### Rename Mode Inside the Picker (Inline Rename)

When `mode === "rename"` and there's a focused session (`f8`), the list area (`cJ`) renders a text input instead of the session list:

```javascript
// Render branch for rename mode (chunks.161.mjs:1915-1930):
// READABLE:
if (mode === "rename" && focusedSession) {
    return (
        <Box paddingLeft={2} flexDirection="column">
            <Text bold>Rename session:</Text>
            <Box paddingTop={1}>
                <TextInput
                    value={renameInput}        // j1
                    onChange={setRenameInput}  // q1
                    onSubmit={handleRenameSubmit}  // E9
                    placeholder={getSessionDisplayTitle(focusedSession, "Enter new session name")}
                    columns={availableWidth}
                    cursorOffset={renameCursor}    // t
                    onChangeCursorOffset={setRenameCursor}  // J1
                    showCursor={true}
                />
            </Box>
        </Box>
    );
}
```

### Rename Submit Handler (`E9`)

```javascript
// ============================================
// handleRenameSubmit - Save new session title from picker
// Location: chunks.161.mjs:1580-1591
// ============================================

// ORIGINAL:
N4 = async () => {
    let X8 = f8 ? Xw(f8) : void 0;
    if (!f8 || !X8) { _1("list"), q1(""); return }
    if (j1.trim()) {
        if (await Q91(X8, j1.trim(), f8.fullPath), N && $) $()
    }
    _1("list"), q1("")
}

// READABLE:
handleRenameSubmit = async () => {
    let sessionId = focusedSession ? getSessionId(focusedSession) : undefined;  // Xw(f8)
    if (!focusedSession || !sessionId) {
        setMode("list"); setRenameInput(""); return;
    }
    if (renameInput.trim()) {
        await saveCustomTitle(sessionId, renameInput.trim(), focusedSession.fullPath);  // Q91
        // If grouping enabled AND callback available → refresh session list
        if (isForkGroupingEnabled && onLogsChanged) onLogsChanged();
    }
    setMode("list"); setRenameInput("");
};

// Mapping: N4→handleRenameSubmit, f8→focusedSession, X8→sessionId, j1→renameInput,
//          Q91→saveCustomTitle, N→isForkGroupingEnabled, $→onLogsChanged
```

**Why the empty check `if (j1.trim())`?**
If the user presses Enter without typing anything, the rename is a no-op — the existing title is preserved. This allows Esc-equivalent behavior (pressing Enter on empty input exits rename mode silently).

---

## Part 7: Session Preview Component (`KYq`)

When the user presses `Ctrl+V` in list mode, `mode` becomes `"preview"` and `KYq` is rendered in place of the session picker.

```javascript
// ============================================
// SessionPreviewComponent - Full transcript preview in /resume picker
// Location: chunks.161.mjs:930-1060
// ============================================

// READABLE:
function SessionPreviewComponent({ log, onExit, onSelect }) {
    let [fullLog, setFullLog] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

    // Lazy-load full transcript if needed
    useEffect(() => {
        if (isLazy(log)) {          // sR: messages.length === 0
            setIsLoading(true);
            loadFull(log).then(full => {  // TI: read JSONL from disk
                setFullLog(full);
                setIsLoading(false);
            });
        } else {
            setFullLog(log);        // already loaded
        }
    }, [log]);

    let displayLog = fullLog ?? log;
    let conversationId = getConversationIdFromLog(displayLog);  // Xw

    // Keybindings
    useKeyBinding("confirm:no", onExit, { context: "Confirmation" });   // Esc → back

    if (isLoading) return <Spinner message="Loading session…" />;

    let formattedDate = formatRelativeDate(displayLog.modified);   // q71
    let branchSuffix = displayLog.gitBranch ? ` · ${displayLog.gitBranch}` : "";

    return (
        <Box flexDirection="column">
            {/* Full conversation transcript */}
            <ConversationTranscript
                messages={displayLog.messages}
                tools={[]}
                commands={[]}
                verbose={true}
                conversationId={conversationId}
                screen="transcript"
                showAllInTranscript={true}
            />
            {/* Footer with date, message count, and Enter=resume hint */}
            <Box flexShrink={0} flexDirection="column" borderTopDimColor>
                <Text>{formattedDate} · {displayLog.messageCount} messages{branchSuffix}</Text>
                <Text dimColor>
                    <KeybindingHints>
                        <Shortcut shortcut="Enter" action="resume" />
                        <KeybindingHint action="confirm:no" fallback="Esc" description="cancel" />
                    </KeybindingHints>
                </Text>
            </Box>
        </Box>
    );
}
// Mapping: KYq→SessionPreviewComponent, log→log, TI→loadFull, sR→isLazy, g91→ConversationTranscript
```

The preview renders the full conversation using the same `g91` (ConversationTranscript) component used in the main REPL. The user sees a read-only scrollable view of the old conversation before deciding to resume.

---

## Part 8: Project Tab Bar (`_Yq`)

When sessions have tags, `WN6` renders `_Yq` as the header instead of the plain "Resume Session" text. Each tag becomes a tab that can be cycled through with Tab/Shift+Tab.

```javascript
// ============================================
// SessionTagTabBar - Tag-based tab navigation bar
// Location: chunks.161.mjs:1057-1148
// ============================================

// READABLE:
function SessionTagTabBar({ tabs, selectedIndex, availableWidth, showAllProjects }) {
    // tabs: ["All", "work", "personal", "bugs"] — "All" is always first
    // selectedIndex: which tab is active (0 = All)

    let titleText = showAllProjects ? "Resume (All Projects)" : "Resume";
    let titleWidth = titleText.length + 1;
    let availableForTabs = availableWidth - titleWidth - minTabWidths - 2;

    // Compute which tabs fit in the available width, centered around selectedIndex
    let tabWidths = tabs.map(tab => getTabDisplayWidth(tab, maxTabWidth));
    // ... sliding window algorithm to show overflow indicators ...
    let hiddenLeft = startIndex;   // how many tabs before visible window
    let hiddenRight = tabs.length - endIndex;

    return (
        <Box flexDirection="row" gap={1}>
            <Text color="suggestion">{titleText}</Text>
            {hiddenLeft > 0 && <Text dimColor>← {hiddenLeft}</Text>}  // zYq = "← "
            {visibleTabs.map((tab, i) => {
                let isSelected = globalIndexes[i] === selectedIndex;
                let displayLabel = tab === "All" ? "All" : `#${truncate(tab, maxWidth)}`;
                return (
                    <Text key={tab}
                        backgroundColor={isSelected ? "suggestion" : undefined}
                        color={isSelected ? "inverseText" : undefined}
                        bold={isSelected}>
                        {" "}{displayLabel}{" "}
                    </Text>
                );
            })}
            {hiddenRight > 0 ? <Text dimColor>→{hiddenRight} (tab to cycle)</Text>
                             : <Text dimColor>(tab to cycle)</Text>}
        </Box>
    );
}
// Mapping: _Yq→SessionTagTabBar, rbA→"All", zYq→"← ", wYq→"→", HYq→" (tab to cycle)", $Yq→"(tab to cycle)"
```

**Tab overflow algorithm:** When all tags don't fit in the terminal width, the algorithm keeps the selected tab visible and fills as many neighboring tabs as possible in both directions (left-then-right greedy). Overflow is shown as `← N` and `→M (tab to cycle)`.

---

## Part 9: Agentic Search (`fN6`, `p8z`)

When the user types a search query in the picker, hits Enter (or triggers the search), and the query needs semantic matching beyond plain text search, `fN6` is called.

```javascript
// ============================================
// agenticSearch - LLM-powered semantic session search
// Location: chunks.161.mjs:2244-2294
// ============================================

// ORIGINAL (compressed):
async function fN6(A, q, K) {  // A=query, q=sessionLogs, K=abortSignal
    if (!A.trim() || q.length === 0) return [];
    let Y = A.toLowerCase(),
        z = q.filter((J) => PYq(J, Y)),   // local text match
        w;
    if (z.length >= KuA) w = z.slice(0, KuA);   // KuA = 100 max sessions
    else {
        let J = q.filter((D) => !PYq(D, Y)), X = KuA - z.length;
        w = [...z, ...J.slice(0, X)]   // fill remaining slots with non-matching
    }
    // Lazy-load transcripts for selected sessions
    let H = w.map(async (J) => sR(J) ? TI(J).catch(K1) : J),
        $ = await Promise.all(H);
    // Build prompt
    let _ = `Sessions:\n${$.map((J,X) => {
        let D = [`${X}:`];
        D.push(Gi(J));                              // display title
        if (J.customTitle) D.push(`[custom title: ${J.customTitle}]`);
        if (J.tag) D.push(`[tag: ${J.tag}]`);
        if (J.gitBranch) D.push(`[branch: ${J.gitBranch}]`);
        if (J.summary) D.push(`- Summary: ${J.summary}`);
        if (J.firstPrompt !== "No prompt") D.push(`- First message: ${J.firstPrompt.slice(0,300)}`);
        if (J.messages?.length > 0) D.push(`- Transcript: ${WYq(J.messages)}`);  // WYq: first 2k chars
        return D.join(" ")
    }).join("\n")}\n\nSearch query: "${A}"\n\nFind the sessions that are most relevant to this query.`;
    // Call LLM
    let D = await callLLM({ model: getCurrentModel(), system: p8z, messages: [{role:"user", content:_}], signal:K });
    let j = D.content.find(G => G.type === "text")?.text;
    let W = JSON.parse(j.match(/\{[\s\S]*\}/)[0]).relevant_indices
        .filter(G => G >= 0 && G < $.length).map(G => $[G]);
    return W
}

// READABLE (for understanding):
async function agenticSearch(query, sessionLogs, abortSignal) {
    if (!query.trim() || sessionLogs.length === 0) return [];

    let queryLower = query.toLowerCase();
    // Prioritize sessions that match locally (title/branch/tag/summary/transcript text)
    let localMatches = sessionLogs.filter(s => matchesLocally(s, queryLower));  // PYq

    // Build the batch: fill up to 100 sessions, local matches first
    let MAX_SESSIONS = 100;  // KuA
    let batch;
    if (localMatches.length >= MAX_SESSIONS) {
        batch = localMatches.slice(0, MAX_SESSIONS);
    } else {
        let remaining = sessionLogs.filter(s => !matchesLocally(s, queryLower));
        batch = [...localMatches, ...remaining.slice(0, MAX_SESSIONS - localMatches.length)];
    }

    // Lazy-load transcripts (so the LLM sees actual content, not just metadata)
    let loadedSessions = await Promise.all(
        batch.map(async s => isLazy(s) ? await loadFull(s).catch(logError) : s)
    );

    // Build LLM prompt: numbered session list with all metadata
    let sessionDescriptions = loadedSessions.map((s, idx) => {
        let parts = [`${idx}:`, getDisplayTitle(s)];
        if (s.customTitle) parts.push(`[custom title: ${s.customTitle}]`);
        if (s.tag) parts.push(`[tag: ${s.tag}]`);
        if (s.gitBranch) parts.push(`[branch: ${s.gitBranch}]`);
        if (s.summary) parts.push(`- Summary: ${s.summary}`);
        if (s.firstPrompt && s.firstPrompt !== "No prompt")
            parts.push(`- First message: ${s.firstPrompt.slice(0, 300)}`);
        if (s.messages?.length > 0)
            parts.push(`- Transcript: ${extractTranscriptText(s.messages)}`);
        return parts.join(" ");
    }).join("\n");

    let prompt = `Sessions:\n${sessionDescriptions}\n\nSearch query: "${query}"\n\nFind the sessions that are most relevant to this query.`;

    // Call LLM with semantic ranking system prompt
    let response = await callLLM({
        model: getCurrentModel(),
        system: AGENTIC_SEARCH_SYSTEM_PROMPT,  // p8z
        messages: [{ role: "user", content: prompt }],
        signal: abortSignal
    });

    // Parse JSON response: {"relevant_indices": [2, 5, 0]}
    let textContent = response.content.find(c => c.type === "text")?.text;
    let jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    let indices = JSON.parse(jsonMatch[0]).relevant_indices;
    return indices.filter(i => i >= 0 && i < loadedSessions.length).map(i => loadedSessions[i]);
}

// Mapping: fN6→agenticSearch, A→query, q→sessionLogs, K→abortSignal, Y→queryLower,
//          PYq→matchesLocally, KuA→100, WYq→extractTranscriptText, p8z→AGENTIC_SEARCH_SYSTEM_PROMPT,
//          _J→getCurrentModel, h51→callLLM, _A→parseJSON
```

### Agentic Search System Prompt (`p8z`)

The system prompt at `chunks.161.mjs:2303` instructs the model to rank sessions with these priorities:
1. **Exact tag matches** (highest priority — user-assigned categories)
2. **Partial tag matches** or tag-related terms
3. **Title matches** (custom titles or first message)
4. **Branch name matches**
5. **Summary and transcript content**
6. **Semantic similarity** and related concepts

The prompt emphasizes inclusivity ("When in doubt, INCLUDE the session") and tells the model to return only a JSON object: `{"relevant_indices": [2, 5, 0]}`.

**Why local text pre-filtering + LLM?**
- Local matches go first in the batch, ensuring the LLM sees the most likely candidates
- Non-matching sessions fill remaining slots up to 100, providing semantic context
- The LLM re-ranks, catching semantic matches the text filter missed (e.g., query "testing" matches sessions tagged "QA" or titled "unit tests")

---

## Part 10: `resumeSession` Function (`yt`)

This is called by `toolUseContext.resume(sessionId, sessionLog, source)` once the user confirms a session:

```javascript
// ============================================
// resumeSession - Restore conversation state from session log
// Location: chunks.142.mjs:379-423
// ============================================

// ORIGINAL (for source lookup):
async function yt(A, q) {  // A=sessionId or log, q=log with messages
    try {
        let K = null, Y = null, z;
        if (A === void 0) K = await jyA(0);        // jyA: load last session by index
        else if (q) {
            Y = [];
            for (let H of await ZQ(q)) {            // ZQ: parse JSONL stream
                if (H.type === "assistant" || H.type === "user") {
                    let $ = PhY(H);                  // PhY: re-uuid message
                    if ($) Y.push($)
                }
                z = H.session_id
            }
        } else if (typeof A === "string") K = await DyA(A), z = A;  // DyA: load by ID
        else K = A;                                  // A is already a log object
        if (!K && !Y) return null;
        if (K) {
            if (sR(K)) K = await TI(K);             // lazy-load if needed
            if (!z) z = Xw(K);                      // extract session ID
            if (await Y_6(K), z) await A_6(K, Yj(z));  // update dir refs, load file history
            CP6(K), Y = K.messages
        }
        MhY(Y), Y = Ig1(Y);                         // MhY: validate, Ig1: normalize UUIDs
        let w = await PP("resume", { sessionId: z });  // PP: run resume hook
        return Y.push(...w), {
            messages: Y,
            fileHistorySnapshots: K?.fileHistorySnapshots,
            attributionSnapshots: K?.attributionSnapshots,
            sessionId: z,
            agentName: K?.agentName,
            agentColor: K?.agentColor,
            agentSetting: K?.agentSetting,
            customTitle: K?.customTitle,
            tag: K?.tag,
            mode: K?.mode,
            fullPath: K?.fullPath
        }
    } catch (K) { throw K1(K), K }
}

// READABLE (for understanding):
async function resumeSession(sessionIdOrLog, sessionLogWithMessages) {
    try {
        let sessionLog = null, messages = null, sessionId;

        // Routing: how to get the session data
        if (sessionIdOrLog === undefined) {
            sessionLog = await loadLastSession(0);       // jyA(0): most recent session
        } else if (sessionLogWithMessages) {
            // Already have the log — just re-uuid the messages for this session
            messages = [];
            for await (let entry of parseJsonlStream(sessionLogWithMessages)) {  // ZQ
                if (entry.type === "assistant" || entry.type === "user") {
                    let msg = remapMessageUUID(entry);  // PhY: assign new UUIDs
                    if (msg) messages.push(msg);
                }
                sessionId = entry.session_id;
            }
        } else if (typeof sessionIdOrLog === "string") {
            sessionLog = await loadSessionById(sessionIdOrLog);  // DyA
            sessionId = sessionIdOrLog;
        } else {
            sessionLog = sessionIdOrLog;  // already a log object
        }

        if (!sessionLog && !messages) return null;

        if (sessionLog) {
            if (isLazy(sessionLog)) sessionLog = await loadFull(sessionLog);  // TI
            if (!sessionId) sessionId = getSessionId(sessionLog);             // Xw
            await updateDirectoryReference(sessionLog);   // Y_6: update .claude/projects/
            if (sessionId) await loadFileHistory(sessionLog, getFileHistoryPath(sessionId));  // A_6, Yj
            configureForSession(sessionLog);              // CP6: set terminal title etc
            messages = sessionLog.messages;
        }

        validateMessages(messages);       // MhY: check message integrity
        messages = normalizeMessageUUIDs(messages);  // Ig1: ensure all UUIDs unique

        // Run "resume" lifecycle hooks
        let hookMessages = await runHooks("resume", { sessionId });  // PP
        messages.push(...hookMessages);

        return {
            messages, sessionId,
            fileHistorySnapshots: sessionLog?.fileHistorySnapshots,
            attributionSnapshots: sessionLog?.attributionSnapshots,
            agentName: sessionLog?.agentName,
            agentColor: sessionLog?.agentColor,
            agentSetting: sessionLog?.agentSetting,
            customTitle: sessionLog?.customTitle,
            tag: sessionLog?.tag,
            mode: sessionLog?.mode,
            fullPath: sessionLog?.fullPath
        };
    } catch (err) {
        logError(err); throw err;
    }
}

// Mapping: yt→resumeSession, jyA→loadLastSession, ZQ→parseJsonlStream, PhY→remapMessageUUID,
//          DyA→loadSessionById, sR→isLazy, TI→loadFull, Xw→getSessionId, Y_6→updateDirectoryReference,
//          A_6→loadFileHistory, Yj→getFileHistoryPath, CP6→configureForSession,
//          MhY→validateMessages, Ig1→normalizeMessageUUIDs, PP→runHooks
```

**Why `remapMessageUUID` (`PhY`)?**
When resuming a session, all messages get new UUIDs. This prevents UUID collisions if the user has the same session open in multiple windows, and ensures the resumed history is treated as a fresh context rather than continuing an existing one.

**The `PP("resume", ...)` hook:**
After messages are loaded, the `resume` lifecycle hook is fired. This allows hooks configured in `settings.json` (e.g., `hooks.resume`) to inject additional messages when a session is resumed — for example, a hook that adds current project status.

---

## Part 11: `/rename` Command Handler (`yAz`)

```javascript
// ============================================
// renameHandler - /rename slash command implementation
// Location: chunks.160.mjs:1570-1596
// ============================================

// ORIGINAL (for source lookup):
async function yAz(A, q) {
    if (l8() && Dz()) return {
        type: "text",
        value: "Cannot rename: This session is a swarm teammate. Teammate names are set by the team leader."
    };
    if (!A || A.trim() === "") return {
        type: "text",
        value: "Please provide a name for the session. Usage: /rename <name>"
    };
    let K = U6(), Y = dO(), z = A.trim();
    if (await Q91(K, z, Y), l4().terminalTitleFromRename) nL7(z);
    if (l8()) return await FbA(K, z, Y), q.setAppState((w) => ({
        ...w, standaloneAgentContext: { ...w.standaloneAgentContext, name: z }
    })), { type: "text", value: `Session and agent renamed to: ${z}` };
    return { type: "text", value: `Session renamed to: ${z}` }
}

// READABLE (for understanding):
async function renameHandler(args, toolUseContext) {
    // Guard: swarm teammate sessions can't be renamed by the user
    if (isSwarmTeammate() && isInSwarmMode()) {   // l8() = isSwarmTeammate, Dz() = isSwarmMode
        return { type: "text", value: "Cannot rename: This session is a swarm teammate. Teammate names are set by the team leader." };
    }

    // Guard: require non-empty name argument
    if (!args || args.trim() === "") {
        return { type: "text", value: "Please provide a name for the session. Usage: /rename <name>" };
    }

    let sessionId = getCurrentSessionId();  // U6()
    let logPath = getCurrentLogPath();      // dO()
    let newName = args.trim();

    // 1. Persist the custom title
    await saveCustomTitle(sessionId, newName, logPath);  // Q91

    // 2. Optionally update the terminal window title
    if (getSettings().terminalTitleFromRename) {
        setTerminalTitle(newName);   // nL7: sets terminal tab title via ANSI escape code
    }

    // 3. If this is a standalone agent (swarm leader), also rename the agent
    if (isSwarmTeammate()) {  // l8() — standalone agent check
        await setAgentName(sessionId, newName, logPath);  // FbA
        toolUseContext.setAppState(state => ({
            ...state,
            standaloneAgentContext: { ...state.standaloneAgentContext, name: newName }
        }));
        return { type: "text", value: `Session and agent renamed to: ${newName}` };
    }

    return { type: "text", value: `Session renamed to: ${newName}` };
}

// Mapping: yAz→renameHandler, A→args, q→toolUseContext, l8→isSwarmTeammate, Dz→isSwarmMode,
//          U6→getCurrentSessionId, dO→getCurrentLogPath, Q91→saveCustomTitle,
//          l4→getSettings, nL7→setTerminalTitle, FbA→setAgentName
```

**Three effects of `/rename`:**

| Effect | Code | Condition |
|--------|------|-----------|
| Persist to JSONL | `Q91(sessionId, name, logPath)` | Always |
| Update terminal title | `nL7(name)` | `settings.terminalTitleFromRename` enabled |
| Update agent name in app state | `FbA(...)` + `setAppState` | Only in swarm/standalone agent mode |

---

## Part 12: `saveCustomTitle` (`Q91`) — Persistence Mechanism

This is the core persistence function used by both `/rename` and the inline rename in the `/resume` picker.

```javascript
// ============================================
// saveCustomTitle - Persist rename to JSONL session log
// Location: chunks.173.mjs:2264-2272
// ============================================

// ORIGINAL (for source lookup):
async function Q91(A, q, K) {
    let Y = K ?? a$(A);          // a$ = getLogPathForSessionId
    if (re(Y, {
            type: "custom-title",
            customTitle: q,
            sessionId: A
        }), A === U6()) YD().currentSessionTitle = q;
    c("tengu_session_renamed", {})
}

// READABLE (for understanding):
async function saveCustomTitle(sessionId, newTitle, logFilePath) {
    // Determine the log file path (either provided or computed from session ID)
    let filePath = logFilePath ?? getLogPathForSessionId(sessionId);  // a$

    // Append a "custom-title" event to the JSONL log file
    appendToLog(filePath, {               // re = fs.appendFileSync(path, JSON.stringify(entry) + "\n")
        type: "custom-title",
        customTitle: newTitle,
        sessionId: sessionId
    });

    // If renaming the current active session, also update in-memory state immediately
    if (sessionId === getCurrentSessionId()) {  // U6
        getSessionState().currentSessionTitle = newTitle;  // YD()
    }

    telemetry("tengu_session_renamed", {});  // c
}

// Mapping: Q91→saveCustomTitle, A→sessionId, q→newTitle, K→logFilePath,
//          a$→getLogPathForSessionId, re→appendToLog, U6→getCurrentSessionId,
//          YD→getSessionState, c→telemetry
```

**How the rename event is stored:**
The rename is appended as a `{ type: "custom-title", customTitle: "...", sessionId: "..." }` line in the session's JSONL file. When the session is loaded later, the JSONL parser replays all events in order — including `custom-title` events, which update `customTitles` Map (`chunks.173.mjs:2519`):

```javascript
// From loadSessionFromJsonl (chunks.173.mjs):
else if (entry.type === "custom-title" && entry.sessionId) {
    customTitles.set(entry.sessionId, entry.customTitle);
}
```

This event-sourcing pattern means rename is non-destructive — the original messages are untouched, and the title can be changed again or removed.

**In-memory update for the current session:**
`YD().currentSessionTitle = newTitle` immediately reflects the rename in `getSessionState()`. This is important for the terminal title display (which reads from `currentSessionTitle`) and for `extractChatTitle` (which checks `customTitle` when building the session list entry).

---

## Part 13: Terminal Title Update (`nL7`)

```javascript
// ============================================
// setTerminalTitle - Set terminal window/tab title via ANSI escape code
// Location: chunks.76.mjs:583-585
// ============================================

// ORIGINAL:
function nL7(A) {
    iL7 = !0, Qx1(A)   // iL7 = isPinnedTerminalTitle flag, Qx1 = setTerminalTitleRaw
}

// READABLE:
function setTerminalTitle(title) {
    isPinnedTerminalTitle = true;   // iL7: prevent Claude's auto-title rotation from overriding
    setTerminalTitleRaw(title);     // Qx1: emits ANSI ESC]0;title\007
}

// Mapping: nL7→setTerminalTitle, iL7→isPinnedTerminalTitle, Qx1→setTerminalTitleRaw
```

The `isPinnedTerminalTitle` flag prevents Claude's background title-rotation logic (which normally updates the terminal title to reflect the current task) from overriding the user's explicitly set name. Once `nL7` is called, the terminal title stays fixed at the renamed value.

---

## Part 14: Error Handling Components (`GYq`, `zuA`)

```javascript
// ============================================
// formatResumeError - Error message formatter for /resume args lookup
// Location: chunks.161.mjs:2349-2356
// ============================================

// ORIGINAL:
function GYq(A) {
    switch (A.resultType) {
        case "sessionNotFound":
            return `Session ${H6.bold(A.arg)} was not found.`;
        case "multipleMatches":
            return `Found ${A.count} sessions matching ${H6.bold(A.arg)}. Please use /resume to pick a specific session.`
    }
}

// READABLE:
function formatResumeError({ resultType, arg, count }) {
    switch (resultType) {
        case "sessionNotFound":
            return `Session ${chalk.bold(arg)} was not found.`;
        case "multipleMatches":
            return `Found ${count} sessions matching ${chalk.bold(arg)}. Please use /resume to pick a specific session.`;
    }
}
// Mapping: GYq→formatResumeError, H6→chalk
```

```javascript
// ============================================
// ResumeErrorUI - Auto-dismissing error display component
// Location: chunks.161.mjs:2358-2386
// ============================================

// READABLE:
function ResumeErrorUI({ message, args, onDone }) {
    // Auto-dismiss: call onDone() on the next tick
    useEffect(() => {
        let timer = setTimeout(onDone, 0);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <Box flexDirection="column">
            <Box>
                <Text dimColor>{pointer} /resume {args}</Text>  // l1.pointer = "❯"
            </Box>
            <Box>
                <Text>{message}</Text>
            </Box>
        </Box>
    );
}
// Mapping: zuA→ResumeErrorUI, l1.pointer→"❯"
```

**Why auto-dismiss?** The error component calls `onDone()` asynchronously (on the next tick). This means `ResumeErrorUI` renders for exactly one frame, then `onDone` fires, which calls the outer `onDone(errorMessage)`, which resolves the promise in `executeCommand` (ifY). The effect is that the error appears in the conversation as a regular `<local-command-stdout>` text output without needing user interaction to dismiss it.

---

## Part 15: Session Loading Architecture

### Two Loading Modes

| Function | Scope | When Used |
|----------|-------|-----------|
| `VN6(cwds)` | Sessions for specific working directories | Default (single project) |
| `wuA()` | All sessions across all projects | `showAllProjects = true` (Ctrl+A) |

### Lazy Loading Pattern (`sR` + `TI`)

Sessions from `VN6`/`wuA` are "lazy" — metadata only, no messages:
```javascript
// sR = isLazy: messages.length === 0 && sessionId !== undefined
// TI = loadFull: reads full JSONL file, parses all events, returns enriched log
```

This two-phase approach is essential: loading 200 sessions worth of messages at startup would be catastrophically slow. The UI shows titles immediately and loads transcripts on-demand (preview, agentic search, actual resume).

### `$F` — Fuzzy Title Search

```javascript
// ============================================
// searchByTitle - Find sessions by custom title
// Location: chunks.173.mjs:2433-2454
// ============================================

// READABLE:
async function searchByTitle(query, { limit, exact }) {
    let cwds = await getAllCwds(getCurrentCwd());
    let statLogs = buildStatLogs(cwds);               // vJq: builds sorted list of all sessions
    let { logs } = await enrichSessions(statLogs, 0, statLogs.length);  // qY1: load all metadata
    let queryNorm = query.toLowerCase().trim();

    let titleMatches = logs.filter(session => {
        let title = session.customTitle?.toLowerCase().trim();
        if (!title) return false;
        return exact ? title === queryNorm : title.includes(queryNorm);
    });

    // Deduplicate by session ID (keep most recently modified per ID)
    let deduped = new Map();
    for (let session of titleMatches) {
        let id = getSessionId(session);
        if (id) {
            let existing = deduped.get(id);
            if (!existing || session.modified > existing.modified) deduped.set(id, session);
        }
    }

    let results = Array.from(deduped.values());
    results.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    return limit ? results.slice(0, limit) : results;
}
// Mapping: $F→searchByTitle, vJq→buildStatLogs, qY1→enrichSessions, Xw→getSessionId
```

Note: `$F` uses `exact: true` when called from `l8z`. This means `/resume my session` only matches if a session has the exact custom title "my session" (case-insensitive). This prevents false positives when the args look like a title but are actually a partial query.

---

## Part 16: Complete UI Flow Diagrams

### `/resume` (no args) — Full Interaction Flow

```
User types: /resume
    │
    ▼
[1] executeCommand(ifY) → executeLocalJsxCommand
    setJSX({ jsx: ..., shouldHidePromptInput: true })

    ▼
[2] l8z (resumeHandler):
    args = "" → render c8z (ResumeInteractiveUI)

    ▼
[3] c8z mounts:
    └─ getAllCwds() + loadSessionsForCwds() → setSessions(N sessions)
    └─ isLoading spinner → "Loading conversations…"
    └─ setIsLoading(false) → render WN6

    ▼
[4] WN6 (SessionPickerUI) renders in "list" mode:
    ┌──────────────────────────────────────────┐
    │ Resume Session                (22 of 156)│  ← _Yq tab bar (if tags exist)
    │ ────────────────────────────────────────  │
    │ [search box - inactive]                  │  ← AF component
    │ filtered by: git-branch (if active)      │  ← dJ
    │                                          │
    │  ❯  my auth refactor          yesterday  │  ← option list (kA or e5q)
    │     fix the login bug         2 days ago │
    │     (+2 other sessions)                  │  ← fork group header
    │     ...                                  │
    │                                          │
    │  Ctrl+A all projects  Ctrl+B toggle branch │
    │  Ctrl+V preview  Ctrl+R rename  Type to search  Esc cancel │
    └──────────────────────────────────────────┘

    ▼ User presses Ctrl+R (with session focused)
[5] setMode("rename"), setRenameInput("")
    WN6 renders rename input instead of session list:
    ┌──────────────────────────────────────────┐
    │  Resume Session                          │
    │  ────────────────────────────────────────│
    │  Rename session:                         │
    │  [text input: "my auth refactor" (placeholder)] │
    │  Enter save  Esc cancel                  │
    └──────────────────────────────────────────┘

    ▼ User types new name, presses Enter
[6] E9 (handleRenameSubmit):
    await Q91(sessionId, "new name", fullPath)
    → re(): appendFileSync(path, '{"type":"custom-title",...}')
    setMode("list"), setRenameInput("")

    ▼ User navigates to a session, presses Enter
[7] WN6.onSelect → c8z.P(sessionLog):
    xv(Xw(log)) → sessionId
    sR(log) ? TI(log) : log → fullLog
    ZN6(fullLog, showAll, cwds) → { isCrossProject: false }
    setIsResuming(true)
    q(sessionId, fullLog, "slash_command_picker")  → toolUseContext.resume

    ▼
[8] yt (resumeSession):
    normalize messages, run PP("resume", ...) hooks
    return { messages, sessionId, customTitle, ... }

    ▼
[9] c8z.resumeAndDismiss:
    A(undefined, { display: "skip" })  → onDone
    messages = [], shouldQuery = false
    setJSX(null)  → clear the resume panel
    Main REPL re-renders with restored conversation
```

### `/rename` — Command Flow

```
User types: /rename my new session name
    │
    ▼
[1] parseSlashCommand → { commandName: "rename", args: "my new session name" }
    executeCommand(ifY) → type: "local" → synchronous execution

    ▼
[2] yAz("my new session name", toolUseContext):
    U6() → currentSessionId
    dO() → currentLogPath
    Q91(sessionId, "my new session name", logPath)
        └─ re(logPath, {type:"custom-title", customTitle:"my new session name", sessionId})
        └─ YD().currentSessionTitle = "my new session name"  (in-memory update)
        └─ telemetry("tengu_session_renamed", {})
    [if terminalTitleFromRename] nL7("my new session name")
        └─ isPinnedTerminalTitle = true
        └─ setTerminalTitleRaw("my new session name")  → ESC]0;my new session name\007

    ▼
[3] Returns: { type: "text", value: "Session renamed to: my new session name" }
    executeCommand wraps in <local-command-stdout>:
    userMessage("<local-command-stdout>Session renamed to: my new session name</local-command-stdout>")

    ▼
[4] UI renders:
    ▶  /rename my new session name
      ⎿  Session renamed to: my new session name
```

---

## Part 17: Telemetry Events

| Event | Location | Trigger |
|-------|----------|---------|
| `tengu_session_rename_started` | WN6 keyboard handler | Ctrl+R pressed in picker |
| `tengu_session_renamed` | Q91 | Any rename persisted |
| `tengu_session_search_toggled` | WN6 keyboard | `/` key or char typed in list mode |
| `tengu_session_branch_filter_toggled` | WN6 keyboard | Ctrl+B |
| `tengu_session_worktree_filter_toggled` | WN6 keyboard | Ctrl+W |
| `tengu_session_all_projects_toggled` | WN6 keyboard | Ctrl+A |
| `tengu_session_tag_filter_changed` | WN6 keyboard | Tab key |
| `tengu_session_group_expanded` | WN6 tree expand | Arrow key on group header |
| `tengu_session_preview_opened` | WN6 keyboard | Ctrl+V |
| `tengu_agentic_search_cancelled` | WN6 cancel | Esc during agentic search |

---

## Part 18: Symbol Index — New Symbols (to be added)

The following symbols are documented in this analysis and should be added to the appropriate symbol index files:

**`symbol_index_core_features.md` — Module: CLI (Session Management)**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| i8z | resumeCommandDefinition | chunks.161.mjs:2560 | object |
| l8z | resumeHandler | chunks.161.mjs:2466 | function |
| c8z | ResumeInteractiveUI | chunks.161.mjs:2388 | component |
| WN6 | SessionPickerUI | chunks.161.mjs:1227 | component |
| KYq | SessionPreviewComponent | chunks.161.mjs:930 | component |
| _Yq | SessionTagTabBar | chunks.161.mjs:1057 | component |
| ZN6 | checkCrossProjectResume | chunks.161.mjs:2178 | function |
| fN6 | agenticSearch | chunks.161.mjs:2244 | function |
| p8z | AGENTIC_SEARCH_SYSTEM_PROMPT | chunks.161.mjs:2303 | constant |
| GYq | formatResumeError | chunks.161.mjs:2349 | function |
| zuA | ResumeErrorUI | chunks.161.mjs:2358 | component |
| CAz | renameCommandDefinition | chunks.160.mjs:1613 | object |
| yAz | renameHandler | chunks.160.mjs:1570 | function |
| Q91 | saveCustomTitle | chunks.173.mjs:2264 | function |
| nL7 | setTerminalTitle | chunks.76.mjs:583 | function |
| B8z | isWorthShowing | chunks.161.mjs:2077 | function |
| Q8z | buildSearchableText | chunks.161.mjs:2104 | function |
| g8z | buildForkGroups | chunks.161.mjs:2110 | function |
| U8z | extractUniqueTags | chunks.161.mjs:2123 | function |
| h8z | extractSearchSnippet | chunks.161.mjs:1194 | function |
| abA | formatSnippetWithHighlight | chunks.161.mjs:1186 | function |
| sbA | buildSessionLabel | chunks.161.mjs:1210 | function |
| tbA | buildSessionDescription | chunks.161.mjs:1219 | function |
| $F | searchByTitle | chunks.173.mjs:2433 | function |
| wuA | loadAllProjectSessions | chunks.173.mjs:2609 | function |
| VN6 | loadSessionsForCwds | chunks.173.mjs:2663 | function |
| TI | loadFullSession | chunks.173.mjs:2380 | function |
| sR | isLazySession | chunks.173.mjs:2376 | function |
| xv | parseSessionUUID | chunks.90.mjs:2338 | function |
| Xw | getSessionId | chunks.173.mjs:2371 | function |
| Gi | getSessionDisplayTitle | chunks.9.mjs:1289 | function |
