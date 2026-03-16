# Bash Tool - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the Bash execution tool: security model, progress streaming, whitelist system, and UI rendering.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI components

Key functions in this document:
- `BashTool` - Bash tool definition object - chunks.172.mjs:84
- `checkBashPermissions` (Tn8) - Main permission check function - chunks.172.mjs:1930
- `shouldUseSandbox` (Ti) - Sandbox determination - chunks.172.mjs:2454
- `isExcludedCommand` (yYz) - Excluded commands check - chunks.172.mjs:2412
- `SEARCH_COMMANDS` (B9z) - Search tool set - chunks.172.mjs:40
- `FILE_READ_COMMANDS` (g9z) - File read command set - chunks.172.mjs:40
- `SAFE_BUILTIN_COMMANDS` (wfq) - Safe builtin set - chunks.172.mjs:40
- `FILE_MODIFY_COMMANDS` (F9z) - File modify command set - chunks.172.mjs:40
- `bashProgressHandler` (ZhA) - Progress streaming handler - chunks.150.mjs:2332
- `BashOutputComponent` (BYq) - Terminal output UI - chunks.162.mjs:417249
- `dangerouslyDisableSandbox` - Schema parameter for sandbox override - chunks.172.mjs:56

---

## Architecture Overview

```
LLM generates Bash tool_use { command, dangerouslyDisableSandbox?, timeout? }
         │
         ▼
 validateInput() ─── Trivial pass-through (returns { result: true })
         │
         ▼
 checkPermissions (Tn8) ─── Main permission/security check
         │
         ├── parseBashCommand (Dfq) ─── Tree-sitter AST parsing
         │     ├── kind: "simple" → Parsed command list
         │     ├── kind: "too-complex" → Ask for approval
         │     └── kind: "parse-unavailable" → Fallback to shell-quote
         │
         ├── shouldUseSandbox (Ti) ─── Sandbox determination
         │     ├── Check: isSandboxingEnabled()
         │     ├── Check: dangerouslyDisableSandbox + areUnsandboxedCommandsAllowed()
         │     └── Check: isExcludedCommand (yYz)
         │
         ├── checkReadOnlyBehavior (Z01) ─── Fast-path allow for readonly
         │
         └── Bash prompt rules matching (if enabled)
         │
         ▼
 Permission result: "allow" | "ask" | "deny"
         │
         ▼
 call() ─── Execute command in subprocess
         │
         ▼
 bashProgressHandler (ZhA) ─── Throttled progress events
         │                     to UI (remote mode only)
         ▼
 BashOutputComponent (BYq) ─── Terminal output rendering
```

---

## 1. Permission Check Architecture

### checkBashPermissions (Tn8) - Main Permission Gate

**What it does:** The primary permission validator for all bash commands. Uses tree-sitter parsing to analyze command structure and determines appropriate permission behavior.

**How it works:**

```javascript
// ============================================
// checkBashPermissions - Main permission check
// Location: chunks.172.mjs:1930-2050
// ============================================

// ORIGINAL (for source lookup):
async function Tn8(A, q, K = pr6) {
    let Y = q.getAppState(),
        _ = t6(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? {
            kind: "parse-unavailable"
        } : await Dfq(A.command),
        w = null,
        O, $;
    if (_.kind === "too-complex") {
        let B = mfq(A, Y.toolPermissionContext);
        if (B !== null) return B;
        let b = {
            type: "other",
            reason: _.reason
        };
        return {
            behavior: "ask",
            decisionReason: b,
            message: ow(J4.name, b),
            suggestions: []
        }
    }
    if (_.kind === "simple") {
        let B = ffq(_.commands);
        if (!B.ok) { /* syntax check failed */ }
        w = _.commands.map((b) => b.text), O = _.commands.flatMap((b) => b.redirects), $ = _.commands
    }
    if (_.kind === "parse-unavailable") {
        // Fallback to shell-quote parsing
    }
    // Sandbox check
    if (vA.isSandboxingEnabled() && vA.isAutoAllowBashIfSandboxedEnabled() && Ti(A)) {
        let B = VYz(A, Y.toolPermissionContext);
        if (B.behavior !== "passthrough") return B
    }
    let H = cr6(A, Y.toolPermissionContext);
    if (H.behavior === "deny") return H;
    // ... prompt rules matching
}

// READABLE (for understanding):
async function checkBashPermissions(input, context, preFlightCheckFn = defaultPreFlight) {
    let appState = context.getAppState();

    // Step 1: Parse command using tree-sitter
    let parseResult = process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK
        ? { kind: "parse-unavailable" }
        : await parseBashCommand(input.command);

    let commands = null;
    let redirects = null;
    let parsedCommands = null;

    // Step 2: Handle parse results
    if (parseResult.kind === "too-complex") {
        // Command too complex for AST analysis
        let denyResult = checkDenyRules(input, appState.toolPermissionContext);
        if (denyResult !== null) return denyResult;

        return {
            behavior: "ask",
            decisionReason: { type: "other", reason: parseResult.reason },
            message: formatDecisionMessage(BashTool.name, { type: "other", reason: parseResult.reason }),
            suggestions: []
        };
    }

    if (parseResult.kind === "simple") {
        // Successfully parsed simple command
        let syntaxCheck = validateCommandSyntax(parseResult.commands);
        if (!syntaxCheck.ok) {
            // Handle syntax errors
        }
        commands = parseResult.commands.map(cmd => cmd.text);
        redirects = parseResult.commands.flatMap(cmd => cmd.redirects);
        parsedCommands = parseResult.commands;
    }

    if (parseResult.kind === "parse-unavailable") {
        // Fallback to shell-quote parsing when tree-sitter unavailable
    }

    // Step 3: Sandbox integration
    if (isSandboxingEnabled() && isAutoAllowBashIfSandboxedEnabled() && shouldUseSandbox(input)) {
        let sandboxResult = checkSandboxPermission(input, appState.toolPermissionContext);
        if (sandboxResult.behavior !== "passthrough") return sandboxResult;
    }

    // Step 4: Permission rules check
    let permissionResult = checkPermissionRules(input, appState.toolPermissionContext);
    if (permissionResult.behavior === "deny") return permissionResult;

    // Step 5: Bash prompt rules (if enabled)
    // ... additional rule matching

    return { behavior: "allow" };
}

// Mapping: Tn8→checkBashPermissions, A→input, q→context, K→preFlightCheckFn,
//          Y→appState, Dfq→parseBashCommand, Ti→shouldUseSandbox, yYz→isExcludedCommand
```

### shouldUseSandbox (Ti) - Sandbox Determination

**What it does:** Determines whether a bash command should be executed in sandbox mode.

```javascript
// ============================================
// shouldUseSandbox - Sandbox determination
// Location: chunks.172.mjs:2454-2460
// ============================================

// ORIGINAL (for source lookup):
function Ti(A) {
    if (!vA.isSandboxingEnabled()) return !1;
    if (A.dangerouslyDisableSandbox && vA.areUnsandboxedCommandsAllowed()) return !1;
    if (!A.command) return !1;
    if (yYz(A.command)) return !1;
    return !0
}

// READABLE (for understanding):
function shouldUseSandbox(input) {
    // Check 1: Is sandboxing enabled globally?
    if (!isSandboxingEnabled()) return false;

    // Check 2: User explicitly disabled sandbox and it's allowed
    if (input.dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed()) {
        return false;
    }

    // Check 3: No command to execute
    if (!input.command) return false;

    // Check 4: Command is in excluded list (allowed without sandbox)
    if (isExcludedCommand(input.command)) return false;

    return true;
}

// Mapping: Ti→shouldUseSandbox, A→input, vA.isSandboxingEnabled→isSandboxingEnabled,
//          vA.areUnsandboxedCommandsAllowed→areUnsandboxedCommandsAllowed, yYz→isExcludedCommand
```

### Sandbox Decision Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SANDBOX DECISION TREE                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
               ┌──────────────────────────┐
               │ isSandboxingEnabled()?   │
               └──────────────────────────┘
                    │            │
                   NO           YES
                    │            │
                    ▼            ▼
            ┌────────────┐  ┌──────────────────────────────────────┐
            │ return     │  │ dangerouslyDisableSandbox &&         │
            │ false      │  │ areUnsandboxedCommandsAllowed()?     │
            │ (no sandbox)│ └──────────────────────────────────────┘
            └────────────┘       │                    │
                                YES                  NO
                                 │                    │
                                 ▼                    ▼
                         ┌────────────┐  ┌──────────────────────────┐
                         │ return     │  │ input.command exists?    │
                         │ false      │  └──────────────────────────┘
                         │ (user opted│       │            │
                         │  out)      │      NO           YES
                         └────────────┘       │            │
                                              ▼            ▼
                                      ┌────────────┐  ┌─────────────────┐
                                      │ return     │  │ isExcludedCommand│
                                      │ false      │  │ (command)?       │
                                      │ (no cmd)   │  └─────────────────┘
                                      └────────────┘       │          │
                                                          YES        NO
                                                           │          │
                                                           ▼          ▼
                                                   ┌────────────┐ ┌────────────┐
                                                   │ return     │ │ return     │
                                                   │ false      │ │ true       │
                                                   │ (excluded) │ │ (SANDBOX)  │
                                                   └────────────┘ └────────────┘
```

**Key insight:** The sandbox decision uses a fail-safe approach — sandbox is enabled by default when sandboxing is configured, and only disabled through explicit opt-out or exclusion list matching.

### isExcludedCommand (yYz) - Excluded Commands Check

**What it does:** Checks if a command is in the list of commands excluded from sandboxing (user-configured safe commands).

```javascript
// ============================================
// isExcludedCommand - Check if command is excluded from sandbox
// Location: chunks.172.mjs:2412-2452
// ============================================

// ORIGINAL (for source lookup):
function yYz(A) {
    let K = PA().sandbox?.excludedCommands ?? [];
    if (K.length === 0) return !1;
    let Y;
    try {
        Y = EO(A)
    } catch {
        Y = [A]
    }
    for (let z of Y) {
        let w = [z.trim()],
            O = new Set(w),
            $ = 0;
        while ($ < w.length) {
            let H = w.length;
            for (let j = $; j < H; j++) {
                let J = w[j],
                    M = bn8(J, xfq);
                if (!O.has(M)) w.push(M), O.add(M);
                let D = Ac(J);
                if (!O.has(D)) w.push(D), O.add(D)
            }
            $ = H
        }
        for (let H of K) {
            let j = In8(H);
            for (let J of w) switch (j.type) {
                case "prefix":
                    if (J === j.prefix || J.startsWith(j.prefix + " ")) return !0;
                    break;
                case "exact":
                    if (J === j.command) return !0;
                    break;
                case "wildcard":
                    if (Cn8(j.pattern, J)) return !0;
                    break
            }
        }
    }
    return !1
}

// READABLE (for understanding):
function isExcludedCommand(command) {
    let excludedCommands = getConfig().sandbox?.excludedCommands ?? [];
    if (excludedCommands.length === 0) return false;

    let commandTokens;
    try {
        commandTokens = tokenizeCommand(command);  // EO
    } catch {
        commandTokens = [command];  // Fallback to raw command
    }

    // For each token, expand with environment variable resolution
    for (let token of commandTokens) {
        let expandedCommands = [token.trim()];
        let seenCommands = new Set(expandedCommands);

        // BFS expansion for environment variables
        let queueIndex = 0;
        while (queueIndex < expandedCommands.length) {
            let currentLength = expandedCommands.length;
            for (let i = queueIndex; i < currentLength; i++) {
                let cmd = expandedCommands[i];

                // Expand PATH-prefixed commands (e.g., /usr/bin/ls → ls)
                let pathExpanded = expandPathPrefix(cmd);
                if (!seenCommands.has(pathExpanded)) {
                    expandedCommands.push(pathExpanded);
                    seenCommands.add(pathExpanded);
                }

                // Get basename (e.g., /usr/bin/git → git)
                let basename = getBasename(cmd);
                if (!seenCommands.has(basename)) {
                    expandedCommands.push(basename);
                    seenCommands.add(basename);
                }
            }
            queueIndex = currentLength;
        }

        // Check against exclusion patterns
        for (let pattern of excludedCommands) {
            let parsedPattern = parseExclusionPattern(pattern);
            for (let expanded of expandedCommands) {
                switch (parsedPattern.type) {
                    case "prefix":
                        if (expanded === parsedPattern.prefix ||
                            expanded.startsWith(parsedPattern.prefix + " ")) {
                            return true;
                        }
                        break;
                    case "exact":
                        if (expanded === parsedPattern.command) return true;
                        break;
                    case "wildcard":
                        if (matchWildcard(parsedPattern.pattern, expanded)) return true;
                        break;
                }
            }
        }
    }
    return false;
}

// Mapping: yYz→isExcludedCommand, A→command, K→excludedCommands, Y→commandTokens,
//          EO→tokenizeCommand, In8→parseExclusionPattern, Cn8→matchWildcard
```

**Exclusion Pattern Types:**

| Type | Example | Matches |
|------|---------|---------|
| `prefix` | `git*` | `git`, `git status`, `git commit` |
| `exact` | `npm` | `npm` only (not `npm install`) |
| `wildcard` | `docker:*` | `docker:ps`, `docker:images` |

---

## 2. Readonly Command Whitelist

### Command Category Sets - Classification by Safety Level

**What they do:** Define sets of commands organized by their safety profile for readonly/fast-path processing.

**How it works:**

```javascript
// ============================================
// Command Category Sets - Safety classification
// Location: chunks.172.mjs:40
// ============================================

// ORIGINAL (for source lookup):
B9z = new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"]),
g9z = new Set(["cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings", "ls", "tree", "du", "jq", "awk", "cut", "sort", "uniq", "tr"]),
wfq = new Set(["echo", "printf", "true", "false", ":"]),
F9z = new Set(["mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp", "touch", "ln", "cd", "export", "unset", "wait"]),
U9z = ["sleep"],

// READABLE (for understanding):
const SEARCH_COMMANDS = new Set([
    "find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"
]);

const FILE_READ_COMMANDS = new Set([
    "cat", "head", "tail", "less", "more", "wc", "stat", "file", "strings",
    "ls", "tree", "du", "jq", "awk", "cut", "sort", "uniq", "tr"
]);

const SAFE_BUILTIN_COMMANDS = new Set([
    "echo", "printf", "true", "false", ":"
]);

const FILE_MODIFY_COMMANDS = new Set([
    "mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp",
    "touch", "ln", "cd", "export", "unset", "wait"
]);

const SAFE_UTILITY_COMMANDS = ["sleep"];

// Mapping: B9z→SEARCH_COMMANDS, g9z→FILE_READ_COMMANDS, wfq→SAFE_BUILTIN_COMMANDS,
//          F9z→FILE_MODIFY_COMMANDS, U9z→SAFE_UTILITY_COMMANDS
```

**Category purposes:**

| Set | Purpose | Auto-Allow? |
|-----|---------|-------------|
| `SEARCH_COMMANDS` (B9z) | File/content search tools | Conditional — read-only if no `-exec` |
| `FILE_READ_COMMANDS` (g9z) | File inspection commands | Yes — pure read operations |
| `SAFE_BUILTIN_COMMANDS` (wfq) | Shell builtins with no side effects | Yes — no filesystem access |
| `FILE_MODIFY_COMMANDS` (F9z) | Commands that mutate filesystem | No — always needs permission |
| `SAFE_UTILITY_COMMANDS` (U9z) | Pure computational utilities | Yes — no I/O |

### completeReadonlyWhitelist - Safe Command Patterns

**What it does:** Defines the complete set of commands that can execute without any user permission prompt via regex patterns.

**Security design principles in the whitelist:**

| Command | What's Allowed | What's Blocked |
|---------|---------------|----------------|
| `echo` | Static text, single/double quoted strings | Variables (`$VAR`), redirections, subshells |
| `ls` | Any arguments | Redirections, shell operators, backticks |
| `cd` | Single path (quoted or unquoted) | Shell metacharacters in path |
| `find` | Path traversal + `-name`, `-type`, `-size` | `-exec`, `-delete`, `-fprint`, process substitution |
| `jq` | JSON queries with `.` and `[]` | `-f` (file input), `env`, `$ENV` |
| `cat/head/tail` | File reading | None (command regex handles safety) |
| `lsof` | Open file/socket inspection | Write operations |
| `pgrep` | Process name matching | Signal operations |
| `seq` | Sequence generation | None (purely computational) |

---

## 3. Readonly Speculative Validator

### speculativeReadonlyValidator (Of6) - Permission Fast-Path

**What it does:** Second-layer readonly validation used by the speculation engine to automatically allow safe read-only bash commands without user prompts.

**How it works:**

```javascript
// ============================================
// speculativeReadonlyValidator (Of6) - Fast-path readonly check
// Location: chunks.150.mjs:881-917
// ============================================

// ORIGINAL (for source lookup):
function Of6(A, q) {
    let { command: K } = A;
    if (!pz(K, (H) => `$${H}`).success) return { behavior: "passthrough", message: "Cannot parse" };
    if (lm(K).behavior !== "passthrough") return { behavior: "passthrough", message: "Not read-only" };
    if ($f6(K)) return { behavior: "ask", message: "Windows UNC path → WebDAV risk" };
    let z = vcY(K);
    if (q && z) return { behavior: "passthrough", message: "cd+git requires check" };
    if (z && EcY()) return { behavior: "passthrough", message: "Bare repo git requires check" };
    if (AD(K).every((H) => { if (lm(H).behavior !== "passthrough") return !1; return NcY(H) }))
        return { behavior: "allow", updatedInput: A };
    return { behavior: "passthrough", message: "Not read-only" }
}

// READABLE (for understanding):
function speculativeReadonlyValidator(input, isCompoundCommand) {
    let { command } = input;

    // Step 1: Shell parseability check
    if (!shellTokenizer(command, (varName) => `$${varName}`).success) {
        return { behavior: "passthrough", message: "Cannot parse — needs further checks" };
    }

    // Step 2: Main security validation
    if (bashSecurityValidation(command).behavior !== "passthrough") {
        return { behavior: "passthrough", message: "Security check failed — not readonly" };
    }

    // Step 3: WebDAV protection for Windows UNC paths
    if (containsWindowsUNCPath(command)) {
        return { behavior: "ask", message: "Contains UNC path — potential WebDAV vulnerability" };
    }

    // Step 4: Compound command + git safety
    let containsGit = commandContainsGit(command);
    if (isCompoundCommand && containsGit) {
        return { behavior: "passthrough", message: "cd+git compound needs permission check" };
    }

    // Step 5: Bare repository check
    if (containsGit && isInBareGitRepository()) {
        return { behavior: "passthrough", message: "Git in bare repo needs permission check" };
    }

    // Step 6: Whitelist check — ALL command segments must be readonly
    let segments = splitCommandByOperators(command);  // AD()
    if (segments.every((segment) => {
        if (bashSecurityValidation(segment).behavior !== "passthrough") return false;
        return isCommandInReadonlyWhitelist(segment);  // NcY()
    })) {
        return { behavior: "allow", updatedInput: input };  // Fast-path allow
    }

    return { behavior: "passthrough", message: "Not all segments are readonly" };
}

// Mapping: Of6→speculativeReadonlyValidator, A→input, q→isCompoundCommand, K→command,
//          pz→shellTokenizer, lm→bashSecurityValidation, $f6→containsWindowsUNCPath,
//          vcY→commandContainsGit, EcY→isInBareGitRepository, AD→splitCommandByOperators,
//          NcY→isCommandInReadonlyWhitelist
```

**Why 6 steps:**
1. **Parse check** — unparseable commands can't be safely classified
2. **Security check** — reuse main security logic to avoid duplication
3. **WebDAV check** — UNC paths trigger automatic file downloads on Windows
4. **Git + cd check** — `cd /some/dir && git push` behaves differently per directory
5. **Bare repo check** — bare git repos don't have working trees; git operations behave unexpectedly
6. **Whitelist** — the actual readonly determination via regex matching

---

## 4. Security Patterns - Conceptual Analysis

> **Note:** The following sections describe security patterns that are checked during the permission flow. The previous version incorrectly mapped these to specific function symbols. The actual security validation is performed by `Tn8` (checkBashPermissions) and related functions in chunks.172.mjs.

### jq System Function Detection

**What it detects:** `jq` commands that use the `system()` function (RCE vector)

**Why dangerous:** `jq` supports `system("cmd")` and `@base64d | explode | [...] | implode | ltrimstr("") | system` patterns that can execute arbitrary shell commands.

### Obfuscated Flags Detection

**What it detects:** ANSI-C quoting (`$'...'`) and locale quoting (`$"..."`) used to hide characters that would otherwise be blocked.

**Example attack:** `echo $'\x72\x6d -rf /'` — the `\x72\x6d` decodes to `rm` after shell processing.

### Shell Metacharacters Detection

**What it detects:** Shell metacharacters (`|`, `&`, `;`) inside arguments, particularly in `find` command patterns.

**Why dangerous:** A command like `find . -name "*.txt" -exec rm -rf {} \;` abuses find's `-exec` to delete files.

### Command Substitution Detection

**What it detects:** Backtick `` ` ``, `$()`, `<()`, `>()` process substitutions, and `<`/`>` redirections.

**Why dangerous:** Command substitution executes arbitrary commands: `echo $(cat /etc/passwd)`. Redirections can read/write arbitrary files: `cat /etc/passwd > /tmp/leak`.

### /proc/environ Access Detection

**What it detects:** Access to `/proc/*/environ` paths.

**Why dangerous:** `/proc/1/environ` contains all environment variables of the init process, which may include API keys, passwords, and other secrets.

### Malformed Token Detection

**What it detects:** Uses the tree-sitter parser to detect ambiguous or malformed token sequences.

**Why needed:** Pattern-based checks can miss edge cases. The AST parser provides ground-truth about how the shell would interpret the command.

---

## 5. Progress Streaming

### bashProgressHandler (ZhA) - Throttled Progress Events

**What it does:** Generator function that processes async events from long-running bash commands and emits throttled progress updates to the UI.

**How it works:**

```javascript
// ============================================
// bashProgressHandler (ZhA) - Progress event streaming
// Location: chunks.150.mjs:2332-2401
// ============================================

// ORIGINAL (for source lookup):
function* ZhA(A) {
    switch (A.type) {
        case "progress":
            if (A.data.type === "bash_progress") {
                if (!J6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
                let q = A.parentToolUseID,
                    K = Date.now(),
                    Y = dU1.get(q) || 0;
                if (K - Y >= RcY) {   // Throttle check
                    if (dU1.size >= LcY) { let w = dU1.keys().next().value; if (w !== void 0) dU1.delete(w) }
                    dU1.set(q, K),
                    yield { type: "tool_progress", tool_use_id: A.toolUseID, tool_name: "Bash",
                            parent_tool_use_id: A.parentToolUseID,
                            elapsed_time_seconds: A.data.elapsedTimeSeconds,
                            session_id: U6(), uuid: A.uuid }
                }
            }
        break;
    }
}

// READABLE (for understanding):
function* bashProgressHandler(event) {
    switch (event.type) {
        case "progress":
            if (event.data.type === "bash_progress") {
                // Only emit progress in remote/container execution environments
                if (!isRemoteExecution(process.env.CLAUDE_CODE_REMOTE) &&
                    !process.env.CLAUDE_CODE_CONTAINER_ID) break;

                let toolUseId = event.parentToolUseID;
                let now = Date.now();
                let lastEmitTime = progressTimeCache.get(toolUseId) || 0;

                // Throttle: only emit if enough time has passed since last progress
                if (now - lastEmitTime >= PROGRESS_THROTTLE_INTERVAL_MS) {  // RcY
                    // LRU eviction: cap cache size
                    if (progressTimeCache.size >= MAX_PROGRESS_CACHE_SIZE) {  // LcY
                        let oldest = progressTimeCache.keys().next().value;
                        if (oldest !== undefined) progressTimeCache.delete(oldest);
                    }

                    progressTimeCache.set(toolUseId, now);

                    yield {
                        type: "tool_progress",
                        tool_use_id: event.toolUseID,
                        tool_name: "Bash",
                        parent_tool_use_id: event.parentToolUseID,
                        elapsed_time_seconds: event.data.elapsedTimeSeconds,
                        session_id: getSessionId(),
                        uuid: event.uuid
                    }
                }
            }
            break;
        // ... other event types (assistant, user)
    }
}

// Mapping: ZhA→bashProgressHandler, A→event, dU1→progressTimeCache, RcY→PROGRESS_THROTTLE_INTERVAL_MS,
//          LcY→MAX_PROGRESS_CACHE_SIZE, q→toolUseId, K→now, Y→lastEmitTime
```

**Progress event design:**
- **Remote-only**: Local execution doesn't stream progress (avoids TTY issues)
- **Time-based throttling**: Prevents flooding the UI with rapid updates
- **LRU eviction**: Bounds memory for cache of last-emit timestamps
- **Elapsed seconds**: UI shows "running for X seconds" timer

### bashPreFlightCheck (g1q) + markAsLongRunning (W74)

**What they do:** Before the tool executes, detect if the command is likely to run for more than a few seconds. If so, mark it as "long running" to enable the progress timer UI.

**Pattern detection:** Commands like `npm install`, `yarn build`, `cargo build`, `pytest`, etc. are recognized as potentially long-running and marked immediately, so the progress spinner appears without waiting.

---

## 6. UI Rendering

### BashOutputComponent (BYq) - Terminal Output Display

**Location:** chunks.162.mjs:417249

**What it renders:** The output of bash command execution, including:
- ANSI color code stripping/rendering
- Line-by-line streaming output display
- Exit code indicator
- Elapsed time display for long-running commands
- Truncation indicator when output exceeds limits

**Rendering states:**
1. **In progress**: Shows spinner + "Running [command]..." + elapsed timer
2. **Completed (success)**: Shows stdout/stderr output + exit code 0 (green)
3. **Completed (error)**: Shows stdout/stderr output + non-zero exit code (red)
4. **Truncated**: Shows first N lines + "... [N lines truncated]" indicator

### Tool Use Message Rendering

The Bash tool's `renderToolUseMessage` shows the command being run:
```
⚙ Bash (ls -la /home/user)
```

For long commands, the display is truncated to the first line with an ellipsis.

### Tool Result Message Rendering

Shows the command output with syntax highlighting based on the command type:
- Shell output → monospace plain text
- JSON output from `jq` → JSON syntax highlighting
- Code listing from `cat` → language-appropriate highlighting

---

## 7. Output Limits

The Bash tool enforces output limits to prevent context window overflow:
- **Max output bytes**: Configurable via environment
- **Truncation strategy**: Keep first N bytes + last N bytes of output
- **Stderr handling**: Merged with stdout by default, shown separately in verbose mode

When output is truncated, the result includes a notice: `[... output truncated ...]`

---

## 8. Sed Command Validation

The Bash security layer includes specific validators for `sed` commands:

### OcY - Sed flag validation
Validates `sed` command flags, allowing only `-n` (suppress output) and `-E` (extended regex). Blocks flags like `-i` (in-place edit) without user approval since in-place editing is destructive.

### J6q - Sed substitution validation
Validates `sed` `s/search/replace/flags` substitution syntax:
- Enforces strict structure via parsing
- Allows only flags: `g` (global), `p` (print), `i` (case-insensitive), `m` (multiline)
- Blocks `e` flag (execute replacement as shell command — RCE vector)

**Key insight:** The sed validators allow safe read/transform operations but block in-place file modification and command execution, matching the principle of least privilege.

---

## 9. Key Security Properties Summary

| Property | Approach | Why |
|----------|----------|-----|
| Multi-layer permission | Sandbox check → Permission rules → Bash prompt rules | Layered checks allow sandbox auto-allow, then explicit rules, then custom patterns |
| Fail-secure | Unknown → needs permission check | Prevents accidental over-permitting |
| Two-pass quoting analysis | withDoubleQuotes + fullyUnquoted | Catches injection attempts across quoting variations |
| Tokenizer validation | Full shell parse on suspicious commands | Pattern matching misses edge cases |
| WebDAV protection | UNC path detection → ask | Network paths can trigger unintended file transfers |
| Compound command analysis | Split on operators, check each segment | Piped/chained commands have compound risk profiles |
| Progress throttling | Time-based + LRU cache | Prevents UI flooding without losing responsiveness |
