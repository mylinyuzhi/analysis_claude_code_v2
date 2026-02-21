# Bash Tool - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of the Bash execution tool: security model, progress streaming, whitelist system, and UI rendering.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI components

Key functions in this document:
- `BashTool` (qS or referenced) - Bash tool definition object - chunks.150.mjs
- `bashSecurityValidation` (lm) - Main security entry point - chunks.150.mjs:321
- `speculativeReadonlyValidator` (Of6) - Readonly command fast-path - chunks.150.mjs:881
- `completeReadonlyWhitelist` (fcY) - Readonly command patterns - chunks.150.mjs:2314
- `jqSecurityCheck` (edY) - JQ-specific security - chunks.150.mjs
- `obfuscatedFlagsCheck` ($cY) - ANSI-C quoting detection - chunks.150.mjs
- `shellMetacharactersCheck` (AcY) - Metacharacter injection - chunks.150.mjs
- `dangerousVariablesCheck` (qcY) - Variable injection - chunks.150.mjs
- `commandSubstitutionCheck` (KcY) - Command substitution injection - chunks.150.mjs
- `newlineInjectionCheck` (YcY) - Newline injection - chunks.150.mjs
- `ifsInjectionCheck` (zcY) - IFS variable manipulation - chunks.150.mjs
- `procEnvironCheck` (wcY) - /proc/environ access prevention - chunks.150.mjs
- `malformedTokenCheck` (HcY) - Shell tokenizer-based detection - chunks.150.mjs
- `bashProgressHandler` (ZhA) - Progress streaming handler - chunks.150.mjs:2332
- `BashOutputComponent` (BYq) - Terminal output UI - chunks.162.mjs:417249
- `bashPreFlightCheck` (g1q) - Long-running command detection - chunks.149.mjs:460
- `markAsLongRunning` (W74) - Marks command for progress UI - chunks.149.mjs:470

---

## Architecture Overview

```
LLM generates Bash tool_use { command }
         │
         ▼
 bashPreFlightCheck (g1q) ─── Marks as "long running" if needed
         │                    (enables progress timer UI)
         ▼
 validateInput()
 ├── bashSecurityValidation (lm) ─── Two-tier security check
 │   ├── Allowlist checks (5 checks) ─── Early permit for safe commands
 │   │   ├── jqAllowlistCheck (ndY)
 │   │   ├── sedPrintlineAllowlistCheck (rdY)
 │   │   ├── sedEditAllowlistCheck (adY)
 │   │   ├── gitCdAllowlistCheck (tdY)
 │   │   └── xargsAllowlistCheck (sdY)
 │   └── Blocklist checks (9 checks) ─── Pattern-based rejection
 │       ├── jqSystemFunctionCheck (edY)
 │       ├── obfuscatedFlagsCheck ($cY)
 │       ├── shellMetacharactersCheck (AcY)
 │       ├── dangerousVariablesCheck (qcY)
 │       ├── newlineInjectionCheck (YcY)
 │       ├── ifsInjectionCheck (zcY)
 │       ├── procEnvironCheck (wcY)
 │       ├── commandSubstitutionCheck (KcY)
 │       └── malformedTokenCheck (HcY)
         │
         ▼
 Pre-tool hooks (B1q) ─── Permission override possible
         │
         ▼
 speculativeReadonlyValidator (Of6) ─── Fast-path allow for readonly
         │
         ▼
 Permission check (canUseTool) ─── User may need to approve
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

## 1. Two-Tier Security Model

### bashSecurityValidation (lm) - Main Security Gate

**What it does:** The primary security validator for all bash commands. Implements a two-tier model: allowlist checks first (early permit), then blocklist checks (pattern-based deny).

**How it works:**

```javascript
// ============================================
// bashSecurityValidation - Two-tier security validation
// Location: chunks.150.mjs:321-355
// ============================================

// ORIGINAL (for source lookup):
function lm(A) {
    if (CY8(A)) return { behavior: "ask", message: "Command contains single-quoted backslash pattern..." };
    let q = A.split(" ")[0] || "",
        { withDoubleQuotes: K, fullyUnquoted: Y } = cdY(A, q === "jq"),
        z = { originalCommand: A, baseCommand: q, unquotedContent: K, fullyUnquotedContent: ldY(Y) },
        w = [ndY, rdY, adY, tdY, sdY];   // Allowlist tier
    for (let $ of w) {
        let O = $(z);
        if (O.behavior === "allow") return { behavior: "passthrough", message: O.decisionReason?.type === "other" ? O.decisionReason.reason : "Command allowed" };
        if (O.behavior !== "passthrough") return O
    }
    let H = [edY, $cY, AcY, qcY, YcY, zcY, wcY, KcY, HcY];  // Blocklist tier
    for (let $ of H) {
        let O = $(z);
        if (O.behavior === "ask") return O
    }
    return { behavior: "passthrough", message: "Command passed all security checks" }
}

// READABLE (for understanding):
function bashSecurityValidation(command) {

    // Pre-check: single-quoted backslash bypass pattern
    if (hasSingleQuotedBackslashBypass(command)) {
        return { behavior: "ask", message: "Command contains bypass attempt via single-quoted backslash" };
    }

    // Parse command into analyzed form
    let baseCommand = command.split(" ")[0] || "";
    let { withDoubleQuotes, fullyUnquoted } = parseCommandQuoting(command, baseCommand === "jq");
    let analyzedCommand = {
        originalCommand: command,
        baseCommand: baseCommand,
        unquotedContent: withDoubleQuotes,           // Content with only double-quotes unquoted
        fullyUnquotedContent: normalizeQuoting(fullyUnquoted)  // Content with all quotes removed
    };

    // === TIER 1: Allowlist checks — early permit ===
    let allowlistChecks = [
        jqAllowlistCheck,           // ndY - Safe jq patterns
        sedPrintlineAllowlistCheck, // rdY - Safe sed print/line operations
        sedEditAllowlistCheck,      // adY - Safe sed substitutions
        gitCdAllowlistCheck,        // tdY - Safe cd + git combos
        xargsAllowlistCheck,        // sdY - Safe xargs patterns
    ];
    for (let check of allowlistChecks) {
        let result = check(analyzedCommand);
        if (result.behavior === "allow") {
            return { behavior: "passthrough", message: "Allowlisted command pattern" };
        }
        if (result.behavior !== "passthrough") return result;  // Explicit deny from allowlist
    }

    // === TIER 2: Blocklist checks — pattern-based security ===
    let blocklistChecks = [
        jqSystemFunctionCheck,      // edY - jq system() call detection
        obfuscatedFlagsCheck,       // $cY - ANSI-C quoting / empty quote tricks
        shellMetacharactersCheck,   // AcY - pipe/semicolon/ampersand in args
        dangerousVariablesCheck,    // qcY - variable in redirections
        newlineInjectionCheck,      // YcY - newline command separator
        ifsInjectionCheck,          // zcY - IFS manipulation
        procEnvironCheck,           // wcY - /proc/*/environ access
        commandSubstitutionCheck,   // KcY - backtick/$()/process substitution
        malformedTokenCheck,        // HcY - tokenizer-detected anomalies
    ];
    for (let check of blocklistChecks) {
        let result = check(analyzedCommand);
        if (result.behavior === "ask") return result;  // Any ask → prompt user
    }

    return { behavior: "passthrough", message: "Command passed all security checks" }
}

// Mapping: lm→bashSecurityValidation, A→command, q→baseCommand, K→withDoubleQuotes,
//          Y→fullyUnquoted, z→analyzedCommand, w→allowlistChecks, H→blocklistChecks,
//          CY8→hasSingleQuotedBackslashBypass, cdY→parseCommandQuoting, ldY→normalizeQuoting,
//          ndY→jqAllowlistCheck, rdY→sedPrintlineAllowlistCheck, adY→sedEditAllowlistCheck,
//          tdY→gitCdAllowlistCheck, sdY→xargsAllowlistCheck,
//          edY→jqSystemFunctionCheck, $cY→obfuscatedFlagsCheck, AcY→shellMetacharactersCheck,
//          qcY→dangerousVariablesCheck, YcY→newlineInjectionCheck, zcY→ifsInjectionCheck,
//          wcY→procEnvironCheck, KcY→commandSubstitutionCheck, HcY→malformedTokenCheck
```

**Why two tiers:**
- Allowlist first → safe patterns are pre-approved without user interruption
- Blocklist second → unsafe patterns trigger user approval dialog
- Fail-secure default → anything not explicitly allowed still goes through permission check

**Return values:**
- `behavior: "passthrough"` → continue to next check layer (not a final decision)
- `behavior: "allow"` → fast-path allow (only from allowlist tier)
- `behavior: "ask"` → prompt user for approval

---

## 2. Readonly Command Whitelist

### completeReadonlyWhitelist (fcY) - Safe Command Patterns

**What it does:** Defines the complete set of commands that can execute without any user permission prompt.

**How it works:**

```javascript
// ============================================
// completeReadonlyWhitelist (fcY) - Readonly command regex set
// Location: chunks.150.mjs:2314-2315
// ============================================

// ORIGINAL (for source lookup):
PcY = ["echo", "printf", "wc", "grep", "head", "tail"];
ZcY = ["cal", "uptime", "cat", "head", "tail", "wc", "stat", "strings", "hexdump", "od",
       "nl", "id", "uname", "free", "df", "du", "locale", "groups", "nproc", "docker ps",
       "docker images", "basename", "dirname", "realpath", "cut", "paste", "tr", "column",
       "tac", "rev", "fold", "expand", "unexpand", "readlink", "diff", "true", "false",
       "sleep", "which", "type"];
fcY = new Set([
    ...ZcY.map(GcY),
    /^echo(?:\s+(?:'[^']*'|"[^"$<>\n\r]*"|[^|;&`$(){}><#\\!"'\s]+))*(?:\s+2>&1)?\s*$/,
    /^uniq(?:\s+(?:-[a-zA-Z]+|--[a-zA-Z-]+(?:=\S+)?|-[fsw]\s+\d+))*(?:\s|$)\s*$/,
    /^pwd$/,
    /^whoami$/,
    /^node -v$/,   /^npm -v$/,   /^python --version$/,   /^python3 --version$/,
    /^history(?:\s+\d+)?\s*$/,
    /^alias$/,
    /^arch(?:\s+(?:--help|-h))?\s*$/,
    /^ip addr$/,
    /^ifconfig(?:\s+[a-zA-Z][a-zA-Z0-9_-]*)?\s*$/,
    /^jq(?!\s+.*(?:-f\b|--from-file|--rawfile|--slurpfile|--run-tests|-L\b|--library-path|\benv\b|\$ENV\b))...$/,
    /^cd(?:\s+(?:'[^']*'|"[^"]*"|[^\s;|&`$(){}><#\\]+))?$/,
    /^ls(?:\s+[^<>()$`|{}&;\n\r]*)?$/,
    /^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|...)...)+)?$/
]);

// READABLE (for understanding):
let expandedReadonlyCommands = [
    // System info (read-only)
    "cal", "uptime", "id", "uname", "free", "df", "du", "locale", "groups", "nproc",
    // File inspection
    "cat", "head", "tail", "wc", "stat", "strings", "hexdump", "od", "nl",
    // Docker (read-only queries)
    "docker ps", "docker images",
    // Path utilities
    "basename", "dirname", "realpath", "readlink",
    // Text processing
    "cut", "paste", "tr", "column", "tac", "rev", "fold", "expand", "unexpand",
    // Misc utilities
    "diff", "true", "false", "sleep", "which", "type",
];

let completeReadonlyWhitelist = new Set([
    // Convert each command to a regex allowing safe argument patterns
    ...expandedReadonlyCommands.map(buildCommandRegex),

    // Version queries — extremely restricted to exact patterns
    /^pwd$/,
    /^whoami$/,
    /^node -v$/,
    /^npm -v$/,
    /^python --version$/,
    /^python3 --version$/,
    /^history(?:\s+\d+)?\s*$/,
    /^alias$/,
    /^arch(?:\s+(?:--help|-h))?\s*$/,
    /^ip addr$/,

    // echo: allow safe arguments (no variables, no redirections, no subshells)
    /^echo(?:\s+(?:'[^']*'|"[^"$<>\n\r]*"|[^|;&`$(){}><#\\!"'\s]+))*(?:\s+2>&1)?\s*$/,

    // Network info (read-only)
    /^ifconfig(?:\s+[a-zA-Z][a-zA-Z0-9_-]*)?\s*$/,

    // jq: allow safe JSON queries, block file reading flags and env access
    // Blocked flags: -f --from-file --rawfile --slurpfile --run-tests -L --library-path
    // Blocked variables: env $ENV
    /^jq(?!\s+.*(?:-f\b|--from-file|--rawfile|--slurpfile|--run-tests|-L\b|--library-path|\benv\b|\$ENV\b))...$/,

    // cd: allow basic navigation, block shell injection in path
    /^cd(?:\s+(?:'[^']*'|"[^"]*"|[^\s;|&`$(){}><#\\]+))?$/,

    // ls: block all dangerous shell syntax in arguments
    /^ls(?:\s+[^<>()$`|{}&;\n\r]*)?$/,

    // find: block dangerous actions (-delete, -exec, -execdir, -ok, -okdir, -fprint variants)
    /^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)[^<>()$`|{}&;\n\r\s]|\s)+)?$/,
]);
```

**Security design principles in the whitelist:**

| Command | What's Allowed | What's Blocked |
|---------|---------------|----------------|
| `echo` | Static text, single/double quoted strings | Variables (`$VAR`), redirections, subshells |
| `ls` | Any arguments | Redirections, shell operators, backticks |
| `cd` | Single path (quoted or unquoted) | Shell metacharacters in path |
| `find` | Path traversal + `-name`, `-type`, `-size` | `-exec`, `-delete`, `-fprint`, process substitution |
| `jq` | JSON queries with `.` and `[]` | `-f` (file input), `env`, `$ENV` |
| `cat/head/tail` | File reading | None (command regex handles safety) |

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

## 4. Security Checks - Detailed Analysis

### jqSystemFunctionCheck (edY)

**What it detects:** `jq` commands that use the `system()` function (RCE vector)

**Why dangerous:** `jq` supports `system("cmd")` and `@base64d | explode | [...] | implode | ltrimstr("") | system` patterns that can execute arbitrary shell commands.

### obfuscatedFlagsCheck ($cY)

**What it detects:** ANSI-C quoting (`$'...'`) and locale quoting (`$"..."`) used to hide characters that would otherwise be blocked.

**Example attack:** `echo $'\x72\x6d -rf /'` — the `\x72\x6d` decodes to `rm` after shell processing.

### shellMetacharactersCheck (AcY)

**What it detects:** Shell metacharacters (`|`, `&`, `;`) inside arguments, particularly in `find` command patterns.

**Why dangerous:** A command like `find . -name "*.txt" -exec rm -rf {} \;` abuses find's `-exec` to delete files.

### commandSubstitutionCheck (KcY)

**What it detects:** Backtick `` ` ``, `$()`, `<()`, `>()` process substitutions, and `<`/`>` redirections.

**Why dangerous:** Command substitution executes arbitrary commands: `echo $(cat /etc/passwd)`. Redirections can read/write arbitrary files: `cat /etc/passwd > /tmp/leak`.

### procEnvironCheck (wcY)

**What it detects:** Access to `/proc/*/environ` paths.

**Why dangerous:** `/proc/1/environ` contains all environment variables of the init process, which may include API keys, passwords, and other secrets.

### malformedTokenCheck (HcY)

**What it detects:** Uses a full shell tokenizer to detect ambiguous or malformed token sequences.

**Why needed:** Pattern-based checks can miss edge cases. The tokenizer provides ground-truth about how the shell would interpret the command.

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
| Allowlist-first | 5 allow checks before 9 block checks | Common safe patterns need no user interruption |
| Fail-secure | Unknown → needs permission check | Prevents accidental over-permitting |
| Two-pass quoting analysis | withDoubleQuotes + fullyUnquoted | Catches injection attempts across quoting variations |
| Tokenizer validation | Full shell parse on suspicious commands | Pattern matching misses edge cases |
| WebDAV protection | UNC path detection → ask | Network paths can trigger unintended file transfers |
| Compound command analysis | Split on operators, check each segment | Piped/chained commands have compound risk profiles |
| Progress throttling | Time-based + LRU cache | Prevents UI flooding without losing responsiveness |
