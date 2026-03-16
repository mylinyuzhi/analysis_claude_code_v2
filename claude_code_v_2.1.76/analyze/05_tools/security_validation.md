# Bash Security Validation

> Full Bash tool analysis: [bash_tool.md](bash_tool.md)

The `Bash` tool includes a comprehensive security validation layer to prevent malicious command execution, specifically targeting injection attacks and unauthorized file access. The validation logic is primarily located in `chunks.91.mjs` (security checks) and `chunks.172.mjs` (Bash tool integration).

---

## Validation Architecture

### Entry Points

Two main entry points handle Bash command validation:

1. **`Rp6` (Synchronous Validation)** - chunks.91.mjs:2209-2270
2. **`O01` (Async with Tree-Sitter)** - chunks.91.mjs:2272-2340

Both functions execute a series of check functions in sequence. If any check returns a `behavior: "ask"` result, the tool use requires explicit user confirmation.

### Validation Flow

```
Command Input
     │
     ▼
┌─────────────────────────────────────┐
│  Pre-checks (control characters,    │
│  backslash patterns)                │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Early Return Checks                │
│  (git commit, sed validation, etc.) │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Security Check Pipeline            │
│  (20 validation functions)          │
└─────────────────────────────────────┘
     │
     ▼
  Allow/Ask/Passthrough
```

---

## Main Entry Points

### Rp6 - Synchronous Validation Entry Point

```javascript
// ============================================
// validateBashCommandSync - Main sync validation entry point
// Location: chunks.91.mjs:2209-2270
// ============================================

// ORIGINAL (for source lookup):
function Rp6(A) {
    if (Yz4.test(A)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.CONTROL_CHARACTERS
    }), {
        behavior: "ask",
        message: "Command contains non-printable control characters that could be used to bypass security checks",
        isBashSecurityCheckForMisparsing: !0
    };
    if (X38(A)) return {
        behavior: "ask",
        message: "Command contains single-quoted backslash pattern that could bypass security checks",
        isBashSecurityCheckForMisparsing: !0
    };
    let { processedCommand: q } = ca(A, { quotedOnly: !0 }),
        K = A.split(" ")[0] || "",
        { withDoubleQuotes: Y, fullyUnquoted: z, unquotedKeepQuoteChars: _ } = bY4(q, K === "jq"),
        w = {
            originalCommand: A,
            baseCommand: K,
            unquotedContent: Y,
            fullyUnquotedContent: xY4(z),
            fullyUnquotedPreStrip: z,
            unquotedKeepQuoteChars: _
        },
        O = [uY4, mY4, gY4, FY4];
    for (let J of O) {
        let M = J(w);
        if (M.behavior === "allow") return { behavior: "passthrough", message: M.decisionReason?.type === "other" ? M.decisionReason.reason : "Command allowed" };
        if (M.behavior !== "passthrough") return M.behavior === "ask" ? { ...M, isBashSecurityCheckForMisparsing: !0 } : M
    }
    let $ = new Set([w01, _01]),
        H = [pY4, rY4, QY4, UY4, Az4, qz4, cY4, w01, lY4, iY4, dY4, _01, oY4, aY4, tY4, eY4, sY4, Kz4, nY4],
        j = null;
    for (let J of H) {
        let M = J(w);
        if (M.behavior === "ask") {
            if ($.has(J)) { if (j === null) j = M; continue }
            return { ...M, isBashSecurityCheckForMisparsing: !0 }
        }
    }
    if (j !== null) return j;
    return { behavior: "passthrough", message: "Command passed all security checks" }
}

// READABLE (for understanding):
function validateBashCommandSync(command) {
    // Check for control characters first (non-printable characters)
    if (CONTROL_CHARACTERS_REGEX.test(command)) {
        telemetry.track("bash_security_check_triggered", { checkId: CHECK_IDS.CONTROL_CHARACTERS });
        return {
            behavior: "ask",
            message: "Command contains non-printable control characters that could be used to bypass security checks",
            isBashSecurityCheckForMisparsing: true
        };
    }

    // Check for single-quoted backslash patterns
    if (hasSingleQuotedBackslashPattern(command)) {
        return {
            behavior: "ask",
            message: "Command contains single-quoted backslash pattern that could bypass security checks",
            isBashSecurityCheckForMisparsing: true
        };
    }

    // Process command and extract quote context
    let { processedCommand } = preprocessCommand(command, { quotedOnly: true });
    let baseCommand = command.split(" ")[0] || "";
    let { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars } = extractQuoteContext(processedCommand, baseCommand === "jq");

    let validationContext = {
        originalCommand: command,
        baseCommand: baseCommand,
        unquotedContent: withDoubleQuotes,
        fullyUnquotedContent: stripQuotes(fullyUnquoted),
        fullyUnquotedPreStrip: fullyUnquoted,
        unquotedKeepQuoteChars: unquotedKeepQuoteChars
    };

    // Run early-return checks (git commit, sed, etc.)
    let earlyChecks = [validateGitCommit, validateSedCommand, validateEchoCommand, validateIncompleteCommand];
    for (let check of earlyChecks) {
        let result = check(validationContext);
        if (result.behavior === "allow") {
            return { behavior: "passthrough", message: result.decisionReason?.type === "other" ? result.decisionReason.reason : "Command allowed" };
        }
        if (result.behavior !== "passthrough") {
            return result.behavior === "ask" ? { ...result, isBashSecurityCheckForMisparsing: true } : result;
        }
    }

    // Run full security check pipeline
    let deferredChecks = new Set([validateNewlineInjection, validateRedirection]);
    let securityChecks = [
        validateJqSecurity,           // pY4
        validateObfuscatedFlags,      // rY4
        validateShellMetacharacters,  // QY4
        validateDangerousVariables,   // UY4
        validateCommentQuoteDesync,   // Az4
        validateQuotedNewline,        // qz4
        validateCarriageReturn,       // cY4
        validateNewlineInjection,     // w01 (deferred)
        validateIfsInjection,         // lY4
        validateProcEnvironAccess,    // iY4
        validateCommandSubstitution,  // dY4
        validateRedirection,          // _01 (deferred)
        validateBackslashWhitespace,  // oY4
        validateBackslashOperators,   // aY4
        validateUnicodeWhitespace,    // tY4
        validateMidWordHash,          // eY4
        validateBraceExpansion,       // sY4
        validateZshCommands,          // Kz4
        validateMalformedTokens       // nY4
    ];

    let deferredResult = null;
    for (let check of securityChecks) {
        let result = check(validationContext);
        if (result.behavior === "ask") {
            // Defer newline and redirection checks to prioritize other issues
            if (deferredChecks.has(check)) {
                if (deferredResult === null) deferredResult = result;
                continue;
            }
            return { ...result, isBashSecurityCheckForMisparsing: true };
        }
    }

    if (deferredResult !== null) return deferredResult;
    return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: Rp6→validateBashCommandSync, A→command, q→processedCommand, K→baseCommand, Y→withDoubleQuotes, z→fullyUnquoted, _→unquotedKeepQuoteChars, w→validationContext, O→earlyChecks, H→securityChecks
```

---

## Security Check Functions

### JQ Security Validation (pY4)

**What it does:** Validates `jq` commands to prevent arbitrary code execution through the `system()` function or dangerous file-reading flags.

**How it works:**
1. Checks if base command is `jq`
2. Detects `system()` function calls (remote code execution risk)
3. Detects dangerous flags: `-f`, `--from-file`, `--rawfile`, `--slurpfile`, `-L`, `--library-path`

```javascript
// ============================================
// validateJqSecurity - Validates jq commands for security risks
// Location: chunks.91.mjs:1507-1535
// ============================================

// ORIGINAL (for source lookup):
function pY4(A) {
    let { originalCommand: q, baseCommand: K } = A;
    if (K !== "jq") return { behavior: "passthrough", message: "Not jq" };
    if (/\bsystem\s*\(/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.JQ_SYSTEM_FUNCTION,
        subId: 1
    }), {
        behavior: "ask",
        message: "jq command contains system() function which executes arbitrary commands"
    };
    let Y = q.substring(3).trim();
    if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(Y))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.JQ_FILE_ARGUMENTS,
            subId: 1
        }), {
            behavior: "ask",
            message: "jq command contains dangerous flags that could execute code or read arbitrary files"
        };
    return { behavior: "passthrough", message: "jq command is safe" }
}

// READABLE (for understanding):
function validateJqSecurity(context) {
    let { originalCommand, baseCommand } = context;

    // Only check jq commands
    if (baseCommand !== "jq") {
        return { behavior: "passthrough", message: "Not jq" };
    }

    // Check for system() function - allows arbitrary command execution
    if (/\bsystem\s*\(/.test(originalCommand)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.JQ_SYSTEM_FUNCTION,
            subId: 1
        });
        return {
            behavior: "ask",
            message: "jq command contains system() function which executes arbitrary commands"
        };
    }

    // Check for dangerous flags that can read arbitrary files or execute code
    let args = originalCommand.substring(3).trim();
    let dangerousFlags = /(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/;
    if (dangerousFlags.test(args)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.JQ_FILE_ARGUMENTS,
            subId: 1
        });
        return {
            behavior: "ask",
            message: "jq command contains dangerous flags that could execute code or read arbitrary files"
        };
    }

    return { behavior: "passthrough", message: "jq command is safe" };
}

// Mapping: pY4→validateJqSecurity, A→context, q→originalCommand, K→baseCommand, Y→args
```

**Why this approach:**
- `jq`'s `system()` function executes arbitrary shell commands
- File-reading flags (`-f`, `--rawfile`) could read sensitive files
- `-L` flag could load malicious libraries

---

### Obfuscated Flags Validation (rY4)

**What it does:** Detects attempts to hide command flags using various quoting techniques.

**How it works:**
1. Detects ANSI-C quoting (`$'...'`) and locale quoting (`$"..."`)
2. Detects empty quotes before flags (`"" -flag`)
3. Detects quoted characters within flag names
4. Tracks quote state while scanning for obfuscation patterns

```javascript
// ============================================
// validateObfuscatedFlags - Detects flag obfuscation techniques
// Location: chunks.91.mjs:1759-1888
// ============================================

// ORIGINAL (for source lookup):
function rY4(A) {
    let { originalCommand: q, baseCommand: K } = A, Y = /[|&;]/.test(q);
    if (K === "echo" && !Y) return { behavior: "passthrough", message: "echo command is safe and has no dangerous flags" };
    if (/\$'[^']*'/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS, subId: 5
    }), { behavior: "ask", message: "Command contains ANSI-C quoting which can hide characters" };
    if (/\$"[^"]*"/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS, subId: 6
    }), { behavior: "ask", message: "Command contains locale quoting which can hide characters" };
    if (/\$['"]{2}\s*-/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS, subId: 9
    }), { behavior: "ask", message: "Command contains empty special quotes before dash (potential bypass)" };
    if (/(?:^|\s)(?:''|"")+\s*-/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.OBFUSCATED_FLAGS, subId: 7
    }), { behavior: "ask", message: "Command contains empty quotes before dash (potential bypass)" };
    // ... additional checks for quote-adjacent patterns
}

// READABLE (for understanding):
function validateObfuscatedFlags(context) {
    let { originalCommand, baseCommand, fullyUnquotedContent } = context;
    let hasOperators = /[|&;]/.test(originalCommand);

    // Echo commands are generally safe for this check
    if (baseCommand === "echo" && !hasOperators) {
        return { behavior: "passthrough", message: "echo command is safe and has no dangerous flags" };
    }

    // ANSI-C quoting: $'...' allows escape sequences that hide characters
    if (/\$'[^']*'/.test(originalCommand)) {
        return { behavior: "ask", message: "Command contains ANSI-C quoting which can hide characters" };
    }

    // Locale quoting: $"..." can hide characters via locale translation
    if (/\$"[^"]*"/.test(originalCommand)) {
        return { behavior: "ask", message: "Command contains locale quoting which can hide characters" };
    }

    // Empty special quotes before dash: $'' -flag or $"" -flag
    if (/\$['"]{2}\s*-/.test(originalCommand)) {
        return { behavior: "ask", message: "Command contains empty special quotes before dash (potential bypass)" };
    }

    // Empty quotes before dash: '' -flag or "" -flag
    if (/(?:^|\s)(?:''|"")+\s*-/.test(originalCommand)) {
        return { behavior: "ask", message: "Command contains empty quotes before dash (potential bypass)" };
    }

    // ... detailed quote-state tracking for flag detection
    // (Full implementation scans character-by-character tracking quote states)

    return { behavior: "passthrough", message: "No obfuscated flags detected" };
}

// Mapping: rY4→validateObfuscatedFlags, A→context, q→originalCommand, K→baseCommand, Y→hasOperators
```

**Why this approach:**
- Attackers use quoting tricks to bypass flag detection
- Example: `cat -''-version` could hide `--version` flag
- Quote state tracking ensures accurate detection

---

### Shell Metacharacters Validation (QY4)

**What it does:** Detects shell metacharacters (`|`, `&`, `;`) inside quoted arguments that could enable command injection.

```javascript
// ============================================
// validateShellMetacharacters - Detects metacharacters in arguments
// Location: chunks.91.mjs:1537-1566
// ============================================

// ORIGINAL (for source lookup):
function QY4(A) {
    let { unquotedContent: q } = A, K = "Command contains shell metacharacters (;, |, or &) in arguments";
    if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(q))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.SHELL_METACHARACTERS, subId: 1
        }), { behavior: "ask", message: K };
    if ([/-name\s+["'][^"']*[;|&][^"']*["'/, /-path\s+["'][^"']*[;|&][^"']*["'/, /-iname\s+["'][^"']*[;|&][^"']*["'/].some((z) => z.test(q)))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.SHELL_METACHARACTERS, subId: 2
        }), { behavior: "ask", message: K };
    if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(q))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.SHELL_METACHARACTERS, subId: 3
        }), { behavior: "ask", message: K };
    return { behavior: "passthrough", message: "No metacharacters" }
}

// READABLE (for understanding):
function validateShellMetacharacters(context) {
    let { unquotedContent } = context;
    let message = "Command contains shell metacharacters (;, |, or &) in arguments";

    // Check for metacharacters inside quoted strings at word boundaries
    let quotedMetacharPattern = /(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/;
    if (quotedMetacharPattern.test(unquotedContent)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.SHELL_METACHARACTERS, subId: 1
        });
        return { behavior: "ask", message: message };
    }

    // Check find command arguments specifically (common attack vector)
    let findPatterns = [
        /-name\s+["'][^"']*[;|&][^"']*["'/,
        /-path\s+["'][^"']*[;|&][^"']*["'/,
        /-iname\s+["'][^"']*[;|&][^"']*["'/
    ];
    if (findPatterns.some(pattern => pattern.test(unquotedContent))) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.SHELL_METACHARACTERS, subId: 2
        });
        return { behavior: "ask", message: message };
    }

    // Check -regex argument specifically
    if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(unquotedContent)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.SHELL_METACHARACTERS, subId: 3
        });
        return { behavior: "ask", message: message };
    }

    return { behavior: "passthrough", message: "No metacharacters" };
}

// Mapping: QY4→validateShellMetacharacters, A→context, q→unquotedContent, K→message
```

**Why this approach:**
- `find -name "foo;rm -rf /"` would execute the second command
- Focused on find command arguments (common injection vector)
- Checks both `;` (command separator) and `|&` (pipeline/boolean operators)

---

### Dangerous Variables Validation (UY4)

**What it does:** Detects variables used in dangerous contexts like redirections or pipes where their expansion could enable attacks.

```javascript
// ============================================
// validateDangerousVariables - Detects variables in redirections/pipes
// Location: chunks.91.mjs:1568-1583
// ============================================

// ORIGINAL (for source lookup):
function UY4(A) {
    let { fullyUnquotedContent: q } = A;
    if (/[<>|]\s*\$[A-Za-z_]/.test(q) || /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(q))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.DANGEROUS_VARIABLES, subId: 1
        }), { behavior: "ask",
            message: "Command contains variables in dangerous contexts (redirections or pipes)" };
    return { behavior: "passthrough", message: "No dangerous variables" }
}

// READABLE (for understanding):
function validateDangerousVariables(context) {
    let { fullyUnquotedContent } = context;

    // Pattern 1: Redirection/pipe operator followed by variable
    // Example: > $OUTFILE or | $COMMAND
    let varAfterOperator = /[<>|]\s*\$[A-Za-z_]/.test(fullyUnquotedContent);

    // Pattern 2: Variable followed by redirection/pipe operator
    // Example: $INFILE < or $PIPE |
    let varBeforeOperator = /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(fullyUnquotedContent);

    if (varAfterOperator || varBeforeOperator) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.DANGEROUS_VARIABLES, subId: 1
        });
        return {
            behavior: "ask",
            message: "Command contains variables in dangerous contexts (redirections or pipes)"
        };
    }

    return { behavior: "passthrough", message: "No dangerous variables" };
}

// Mapping: UY4→validateDangerousVariables, A→context, q→fullyUnquotedContent
```

**Why this approach:**
- Variables in redirections can write to arbitrary files
- Example: `echo data > $FILE` where `$FILE="/etc/passwd"`
- Checking both positions catches all variable-redirection combinations

---

### Command Substitution Validation (dY4)

**What it does:** Detects various forms of command substitution that could enable arbitrary code execution.

```javascript
// ============================================
// validateCommandSubstitution - Detects command substitution patterns
// Location: chunks.91.mjs:1585-1609
// ============================================

// ORIGINAL (for source lookup):
function dY4(A) {
    let { unquotedContent: q } = A;
    if ($g9(q, "`")) return { behavior: "ask", message: "Command contains backticks (`) for command substitution" };
    for (let { pattern: K, message: Y } of wg9)
        if (K.test(q)) return d("tengu_bash_security_check_triggered", {
            checkId: w3.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION, subId: 1
        }), { behavior: "ask", message: `Command contains ${Y}` };
    return { behavior: "passthrough", message: "No dangerous patterns" }
}

// READABLE (for understanding):
function validateCommandSubstitution(context) {
    let { unquotedContent } = context;

    // Check for backtick command substitution
    if (containsCharacter(unquotedContent, "`")) {
        return {
            behavior: "ask",
            message: "Command contains backticks (`) for command substitution"
        };
    }

    // Check for various substitution patterns
    let dangerousPatterns = [
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
    ];

    for (let { pattern, message } of dangerousPatterns) {
        if (pattern.test(unquotedContent)) {
            telemetry.track("bash_security_check_triggered", {
                checkId: CHECK_IDS.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION, subId: 1
            });
            return { behavior: "ask", message: `Command contains ${message}` };
        }
    }

    return { behavior: "passthrough", message: "No dangerous patterns" };
}

// Mapping: dY4→validateCommandSubstitution, A→context, q→unquotedContent, K→pattern, Y→message, wg9→dangerousPatterns
```

**Why this approach:**
- Covers multiple shell syntaxes (Bash, Zsh, PowerShell)
- Process substitution `<()` and `>()` can bypass file access controls
- `${}` can be used for indirect variable expansion attacks

---

### Newline Injection Validation (w01)

**What it does:** Detects newlines that could be used to inject additional commands.

```javascript
// ============================================
// validateNewlineInjection - Detects newline-based command injection
// Location: chunks.91.mjs:1635-1654
// ============================================

// ORIGINAL (for source lookup):
function w01(A) {
    let { fullyUnquotedPreStrip: q } = A;
    if (!/[\n\r]/.test(q)) return { behavior: "passthrough", message: "No newlines" };
    if (/(?<![\s]\\)[\n\r]\s*\S/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.NEWLINES, subId: 1
    }), { behavior: "ask",
        message: "Command contains newlines that could separate multiple commands" };
    return { behavior: "passthrough", message: "Newlines appear to be within data" }
}

// READABLE (for understanding):
function validateNewlineInjection(context) {
    let { fullyUnquotedPreStrip } = context;

    // No newlines present
    if (!/[\n\r]/.test(fullyUnquotedPreStrip)) {
        return { behavior: "passthrough", message: "No newlines" };
    }

    // Check for unescaped newlines followed by non-whitespace
    // This pattern indicates a new command after the newline
    let commandAfterNewline = /(?<![\s]\\)[\n\r]\s*\S/.test(fullyUnquotedPreStrip);
    if (commandAfterNewline) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.NEWLINES, subId: 1
        });
        return {
            behavior: "ask",
            message: "Command contains newlines that could separate multiple commands"
        };
    }

    return { behavior: "passthrough", message: "Newlines appear to be within data" };
}

// Mapping: w01→validateNewlineInjection, A→context, q→fullyUnquotedPreStrip
```

**Why this approach:**
- Newlines can separate commands: `echo hello\ncat /etc/passwd`
- Excludes escaped newlines (continuation lines)
- Uses negative lookbehind to check for escape sequences

---

### IFS Injection Validation (lY4)

**What it does:** Detects attempts to manipulate the IFS (Internal Field Separator) variable.

```javascript
// ============================================
// validateIfsInjection - Detects IFS manipulation attempts
// Location: chunks.91.mjs:1699-1714
// ============================================

// ORIGINAL (for source lookup):
function lY4(A) {
    let { originalCommand: q } = A;
    if (/\$IFS|\$\{[^}]*IFS/.test(q))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.IFS_INJECTION, subId: 1
        }), { behavior: "ask",
            message: "Command contains IFS variable usage which could bypass security validation" };
    return { behavior: "passthrough", message: "No IFS injection detected" }
}

// READABLE (for understanding):
function validateIfsInjection(context) {
    let { originalCommand } = context;

    // IFS manipulation can change how words are split
    // $IFS and ${IFS} are both checked
    // Also catches patterns like ${IFS+...} or ${IFS:-...}
    if (/\$IFS|\$\{[^}]*IFS/.test(originalCommand)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.IFS_INJECTION, subId: 1
        });
        return {
            behavior: "ask",
            message: "Command contains IFS variable usage which could bypass security validation"
        };
    }

    return { behavior: "passthrough", message: "No IFS injection detected" };
}

// Mapping: lY4→validateIfsInjection, A→context, q→originalCommand
```

**Why this approach:**
- IFS controls word splitting in shell
- Changing IFS can bypass argument parsing
- Example: `IFS=/; echo $PATH` would split PATH differently

---

### Proc Environ Access Validation (iY4)

**What it does:** Detects attempts to read process environment variables through `/proc/*/environ`.

```javascript
// ============================================
// validateProcEnvironAccess - Detects /proc/*/environ access
// Location: chunks.91.mjs:1716-1731
// ============================================

// ORIGINAL (for source lookup):
function iY4(A) {
    let { originalCommand: q } = A;
    if (/\/proc\/.*\/environ/.test(q))
        return d("tengu_bash_security_check_triggered", {
            checkId: w3.PROC_ENVIRON_ACCESS, subId: 1
        }), { behavior: "ask",
            message: "Command accesses /proc/*/environ which could expose sensitive environment variables" };
    return { behavior: "passthrough", message: "No /proc/environ access detected" }
}

// READABLE (for understanding):
function validateProcEnvironAccess(context) {
    let { originalCommand } = context;

    // /proc/PID/environ contains process environment variables
    // Attackers can read other processes' environments to steal secrets
    if (/\/proc\/.*\/environ/.test(originalCommand)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.PROC_ENVIRON_ACCESS, subId: 1
        });
        return {
            behavior: "ask",
            message: "Command accesses /proc/*/environ which could expose sensitive environment variables"
        };
    }

    return { behavior: "passthrough", message: "No /proc/environ access detected" };
}

// Mapping: iY4→validateProcEnvironAccess, A→context, q→originalCommand
```

**Why this approach:**
- `/proc/self/environ` exposes current process secrets
- `/proc/1/environ` could expose init process secrets
- Environment variables often contain API keys, passwords

---

### Malformed Token Injection Validation (nY4)

**What it does:** Uses a tokenizer to detect ambiguous syntax that could be misinterpreted by the shell.

```javascript
// ============================================
// validateMalformedTokens - Detects ambiguous shell syntax
// Location: chunks.91.mjs:1733-1757
// ============================================

// ORIGINAL (for source lookup):
function nY4(A) {
    let { originalCommand: q } = A, K = Fz(q);
    if (!K.success) return { behavior: "passthrough", message: "Parse failed, handled elsewhere" };
    let Y = K.tokens;
    if (!Y.some((_) => typeof _ === "object" && _ !== null && ("op" in _) && (_.op === ";" || _.op === "&&" || _.op === "||")))
        return { behavior: "passthrough", message: "No command separators" };
    if (_g9(Y)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.MALFORMED_TOKEN_INJECTION, subId: 1
    }), { behavior: "ask",
        message: "Command contains ambiguous syntax with command separators that could be misinterpreted" };
    return { behavior: "passthrough", message: "No malformed token injection detected" }
}

// READABLE (for understanding):
function validateMalformedTokens(context) {
    let { originalCommand } = context;

    // Tokenize the command
    let parseResult = tokenizeCommand(originalCommand);
    if (!parseResult.success) {
        return { behavior: "passthrough", message: "Parse failed, handled elsewhere" };
    }

    let tokens = parseResult.tokens;

    // Check for command separators (operators that chain commands)
    let hasCommandSeparators = tokens.some(token =>
        typeof token === "object" &&
        token !== null &&
        "op" in token &&
        (token.op === ";" || token.op === "&&" || token.op === "||")
    );

    if (!hasCommandSeparators) {
        return { behavior: "passthrough", message: "No command separators" };
    }

    // Check for malformed/ambiguous token patterns
    if (hasMalformedTokenPattern(tokens)) {
        telemetry.track("bash_security_check_triggered", {
            checkId: CHECK_IDS.MALFORMED_TOKEN_INJECTION, subId: 1
        });
        return {
            behavior: "ask",
            message: "Command contains ambiguous syntax with command separators that could be misinterpreted"
        };
    }

    return { behavior: "passthrough", message: "No malformed token injection detected" };
}

// Mapping: nY4→validateMalformedTokens, A→context, q→originalCommand, K→parseResult, Y→tokens, Fz→tokenizeCommand, _g9→hasMalformedTokenPattern
```

**Why this approach:**
- Some syntax can be parsed differently by different tools
- Shell-quote library and actual bash may disagree on parsing
- Tokenizer-based detection catches edge cases regex might miss

---

## Additional Validation Functions

### Carriage Return Validation (cY4)

Detects carriage return (`\r`) characters that can cause parsing inconsistencies between shell-quote and bash.

```javascript
// ============================================
// validateCarriageReturn - Detects CR character injection
// Location: chunks.91.mjs:1656-1697
// ============================================

// ORIGINAL (for source lookup):
function cY4(A) {
    let { originalCommand: q } = A;
    if (!q.includes("\r")) return { behavior: "passthrough", message: "No carriage return" };
    // ... quote state tracking to find unquoted CR
    if (w === "\r" && !Y) return d("tengu_bash_security_check_triggered", {
        checkId: w3.NEWLINES, subId: 2
    }), { behavior: "ask",
        message: "Command contains carriage return (\\r) which shell-quote and bash tokenize differently" };
    return { behavior: "passthrough", message: "CR only inside double quotes" }
}

// Mapping: cY4→validateCarriageReturn, A→context, q→originalCommand
```

### Redirection Validation (_01)

Detects input (`<`) and output (`>`) redirection that could read/write arbitrary files.

```javascript
// ============================================
// validateRedirection - Detects file redirection
// Location: chunks.91.mjs:1611-1633
// ============================================

// ORIGINAL (for source lookup):
function _01(A) {
    let { fullyUnquotedContent: q } = A;
    if (/</.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.DANGEROUS_PATTERNS_INPUT_REDIRECTION, subId: 1
    }), { behavior: "ask",
        message: "Command contains input redirection (<) which could read sensitive files" };
    if (/>/.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION, subId: 1
    }), { behavior: "ask",
        message: "Command contains output redirection (>) which could write to arbitrary files" };
    return { behavior: "passthrough", message: "No redirections" }
}

// Mapping: _01→validateRedirection, A→context, q→fullyUnquotedContent
```

### Unicode Whitespace Validation (tY4)

Detects Unicode whitespace characters that could cause parsing inconsistencies.

```javascript
// ============================================
// validateUnicodeWhitespace - Detects Unicode whitespace
// Location: chunks.91.mjs:2040-2054
// ============================================

// ORIGINAL (for source lookup):
function tY4(A) {
    let { originalCommand: q } = A;
    if (Dg9.test(q)) return d("tengu_bash_security_check_triggered", {
        checkId: w3.UNICODE_WHITESPACE
    }), { behavior: "ask",
        message: "Command contains Unicode whitespace characters that could cause parsing inconsistencies" };
    return { behavior: "passthrough", message: "No Unicode whitespace" }
}

// Mapping: tY4→validateUnicodeWhitespace, A→context, q→originalCommand, Dg9→UNICODE_WHITESPACE_REGEX
```

### Brace Expansion Validation (sY4)

Detects brace expansion that could alter command parsing.

```javascript
// ============================================
// validateBraceExpansion - Detects brace expansion patterns
// Location: chunks.91.mjs:1978-2038
// ============================================

// ORIGINAL (for source lookup):
function sY4(A) {
    let q = A.fullyUnquotedPreStrip, K = 0, Y = 0;
    // Count braces to detect imbalance
    for (let z = 0; z < q.length; z++)
        if (q[z] === "{" && !n36(q, z)) K++;
        else if (q[z] === "}" && !n36(q, z)) Y++;
    if (K > 0 && Y > K) return { behavior: "ask",
        message: "Command has excess closing braces after quote stripping, indicating possible brace expansion obfuscation" };
    // ... additional checks for comma/.. within braces
}

// Mapping: sY4→validateBraceExpansion, A→context, q→fullyUnquotedPreStrip, n36→isEscapedBackslash
```

### Zsh Dangerous Commands Validation (Kz4)

Detects Zsh-specific commands that can bypass security checks.

```javascript
// ============================================
// validateZshCommands - Detects dangerous Zsh builtins
// Location: chunks.91.mjs:2179-2207
// ============================================

// ORIGINAL (for source lookup):
function Kz4(A) {
    let { originalCommand: q } = A;
    // ... extract first non-assignment, non-keyword command
    if (Og9.has(_)) return { behavior: "ask",
        message: `Command uses Zsh-specific '${_}' which can bypass security checks` };
    if (_ === "fc" && /\s-\S*e/.test(Y)) return { behavior: "ask",
        message: "Command uses 'fc -e' which can execute arbitrary commands via editor" };
    return { behavior: "passthrough", message: "No Zsh dangerous commands" }
}

// Mapping: Kz4→validateZshCommands, A→context, q→originalCommand, Og9→ZSH_DANGEROUS_COMMANDS
```

---

## Sed Command Validation

The system includes specific validators for `sed` commands to prevent arbitrary code execution.

### Sed Read-Only Validation (Xg9)

Validates `sed` commands that use only read operations.

```javascript
// ============================================
// validateSedReadOnly - Validates sed read-only commands
// Location: chunks.91.mjs:2434-2464
// ============================================

// ORIGINAL (for source lookup):
function Xg9(A, q) {
    let K = A.match(/^\s*sed\s+/);
    if (!K) return !1;
    let Y = A.slice(K[0].length), z = Fz(Y);
    if (!z.success) return !1;
    let _ = z.tokens, w = [];
    for (let H of _)
        if (typeof H === "string" && H.startsWith("-") && H !== "--") w.push(H);
    // Only allow safe flags: -n, -E, -r, -z, --posix
    if (!_z4(w, ["-n", "--quiet", "--silent", "-E", "--regexp-extended", "-r", "-z", "--zero-terminated", "--posix"])) return !1;
    // Must have -n flag (suppress automatic printing)
    // ... validation continues
}

// Mapping: Xg9→validateSedReadOnly, A→command, q→expressions, Fz→tokenizeCommand, _z4→validateAllFlagsAllowed
```

### Sed Substitution Validation (zz4)

Validates `sed` substitution commands (`s/search/replace/flags`).

```javascript
// ============================================
// validateSedSubstitution - Validates sed s/// commands
// Location: chunks.91.mjs:2471-2507
// ============================================

// ORIGINAL (for source lookup):
function zz4(A, q, K, Y) {
    let z = Y?.allowFileWrites ?? !1;
    if (!z && K) return !1; // No in-place without permission
    // Parse sed arguments
    let j = q[0].trim();
    if (!j.startsWith("s")) return !1; // Must be substitution
    // Validate s/// syntax
    // Only allow flags: g, p, i, m (and optional occurrence number)
    if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test(Z)) return !1;
    return !0;
}

// Mapping: zz4→validateSedSubstitution, A→command, q→expressions, K→hasInPlace, Y→options
```

---

## Check ID Constants

The validation system uses a comprehensive set of check IDs for telemetry tracking:

```javascript
// ============================================
// CHECK_IDS - Security check identifiers
// Location: chunks.91.mjs:2394-2418
// ============================================

// ORIGINAL (for source lookup):
w3 = {
    INCOMPLETE_COMMANDS: 1,
    JQ_SYSTEM_FUNCTION: 2,
    JQ_FILE_ARGUMENTS: 3,
    OBFUSCATED_FLAGS: 4,
    SHELL_METACHARACTERS: 5,
    DANGEROUS_VARIABLES: 6,
    NEWLINES: 7,
    DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
    DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
    DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
    IFS_INJECTION: 11,
    GIT_COMMIT_SUBSTITUTION: 12,
    PROC_ENVIRON_ACCESS: 13,
    MALFORMED_TOKEN_INJECTION: 14,
    BACKSLASH_ESCAPED_WHITESPACE: 15,
    BRACE_EXPANSION: 16,
    CONTROL_CHARACTERS: 17,
    UNICODE_WHITESPACE: 18,
    MID_WORD_HASH: 19,
    ZSH_DANGEROUS_COMMANDS: 20,
    BACKSLASH_ESCAPED_OPERATORS: 21,
    COMMENT_QUOTE_DESYNC: 22,
    QUOTED_NEWLINE: 23
};

// Mapping: w3→CHECK_IDS
```

---

## Bash Progress Events

The Bash tool supports a `bash_progress` event type that allows long-running commands to report their execution time and status back to the user interface without blocking the agent's context.

### Progress Event Structure

```javascript
// ============================================
// Bash Progress Event - Progress reporting for long commands
// Location: chunks.172.mjs:252-262
// ============================================

// ORIGINAL (for source lookup):
z({
    toolUseID: `bash-progress-${M++}`,
    data: {
        type: "bash_progress",
        output: Q.output,
        fullOutput: Q.fullOutput,
        elapsedTimeSeconds: Q.elapsedTimeSeconds,
        totalLines: Q.totalLines,
        totalBytes: Q.totalBytes
    }
});

// READABLE (for understanding):
sendProgressEvent({
    toolUseID: `bash-progress-${counter++}`,
    data: {
        type: "bash_progress",
        output: recentOutput,
        fullOutput: completeOutput,
        elapsedTimeSeconds: elapsedSeconds,
        totalLines: lineCount,
        totalBytes: byteCount
    }
});

// Mapping: z→sendProgressEvent, M→counter, Q→progressData
```

### Progress Event Handling

Progress events are processed in chunks.146.mjs and chunks.136.mjs:

```javascript
// ============================================
// Progress Event Handler - Process bash_progress events
// Location: chunks.146.mjs:1162-1180
// ============================================

// ORIGINAL (for source lookup):
} else if (A.data.type === "bash_progress" || A.data.type === "powershell_progress") {
    if (!t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
    let q = A.parentToolUseID, K = Date.now(), Y = Zi6.get(q) || 0;
    if (K - Y >= yxY) {
        // Rate-limited progress update
        Zi6.set(q, K);
        yield {
            type: "tool_progress",
            tool_use_id: A.toolUseID,
            tool_name: A.data.type === "bash_progress" ? "Bash" : "PowerShell",
            parent_tool_use_id: A.parentToolUseID,
            elapsed_time_seconds: A.data.elapsedTimeSeconds,
            task_id: A.data.taskId,
            session_id: R1(),
            uuid: A.uuid
        };
    }
}
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `Rp6` - validateBashCommandSync (synchronous validation entry point)
- `O01` - validateBashCommandAsync (async validation with tree-sitter)
- `pY4` - validateJqSecurity
- `rY4` - validateObfuscatedFlags
- `QY4` - validateShellMetacharacters
- `UY4` - validateDangerousVariables
- `dY4` - validateCommandSubstitution
- `w01` - validateNewlineInjection
- `lY4` - validateIfsInjection
- `iY4` - validateProcEnvironAccess
- `nY4` - validateMalformedTokens
- `cY4` - validateCarriageReturn
- `_01` - validateRedirection
- `tY4` - validateUnicodeWhitespace
- `sY4` - validateBraceExpansion
- `Kz4` - validateZshCommands
- `oY4` - validateBackslashWhitespace
- `aY4` - validateBackslashOperators
- `eY4` - validateMidWordHash
- `Az4` - validateCommentQuoteDesync
- `qz4` - validateQuotedNewline
- `Xg9` - validateSedReadOnly
- `zz4` - validateSedSubstitution
- `xW6` - validateSedCommand
- `w3` - CHECK_IDS (security check identifiers)