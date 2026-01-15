# Wildcard Permission Matching (2.1.7)

> **NEW in 2.1.2** - Wildcard pattern matching for Bash permissions
> **Security Fix in 2.1.6** - Shell line continuation bypass fix
> **Security Fix in 2.1.7** - Compound command security vulnerability fix

---

## Overview

The wildcard permission system allows flexible command pattern matching for Bash tool permissions:

| Syntax | Type | Example | Matches |
|--------|------|---------|---------|
| `Bash(npm run build)` | Exact | Exact command only | `npm run build` |
| `Bash(npm:*)` | Prefix (legacy) | Command prefix | `npm`, `npm run`, `npm install` |
| `Bash(npm *)` | Wildcard | Pattern with wildcards | `npm run build`, `npm install foo` |
| `Bash(* install)` | Wildcard | Suffix pattern | `npm install`, `pip install` |
| `Bash(git * main)` | Wildcard | Middle wildcard | `git push origin main` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Permission Evaluation Flow                        │
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐      │
│  │ User Input  │───>│ Classify    │───>│ Match Against Rules │      │
│  │ (command)   │    │ Pattern Type│    │ (deny/ask/allow)    │      │
│  └─────────────┘    └─────────────┘    └─────────────────────┘      │
│                           │                      │                   │
│                           v                      v                   │
│                    ┌─────────────┐    ┌─────────────────────┐       │
│                    │ exact       │    │ Security Checks:    │       │
│                    │ prefix      │    │ - Command Injection │       │
│                    │ wildcard    │    │ - Compound Commands │       │
│                    └─────────────┘    │ - Path Resolution   │       │
│                                       └─────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Pattern Classification

```javascript
// ============================================
// classifyPermissionPattern - Determines pattern type
// Location: chunks.123.mjs:2016-2030
// ============================================

// ORIGINAL (for source lookup):
function gq0(A) {
  let Q = fq0(A);
  if (Q !== null) return {
    type: "prefix",
    prefix: Q
  };
  if (Ga5(A)) return {
    type: "wildcard",
    pattern: A
  };
  return {
    type: "exact",
    command: A
  }
}

// READABLE (for understanding):
function classifyPermissionPattern(pattern) {
  // Check for legacy prefix syntax (e.g., "npm:*")
  let prefixMatch = extractPrefixFromLegacy(pattern);
  if (prefixMatch !== null) {
    return { type: "prefix", prefix: prefixMatch };
  }

  // Check for wildcard pattern (contains unescaped *)
  if (containsUnescapedWildcard(pattern)) {
    return { type: "wildcard", pattern: pattern };
  }

  // Otherwise it's an exact command match
  return { type: "exact", command: pattern };
}

// Mapping: gq0→classifyPermissionPattern, fq0→extractPrefixFromLegacy, Ga5→containsUnescapedWildcard
```

**Why three types:**
1. **exact** - Full command string must match exactly (most restrictive)
2. **prefix** - Legacy `:*` syntax for backwards compatibility
3. **wildcard** - New flexible pattern with `*` anywhere (most flexible)

---

## Wildcard Detection

```javascript
// ============================================
// containsUnescapedWildcard - Check if pattern has wildcard
// Location: chunks.123.mjs:1981-1989
// ============================================

// ORIGINAL (for source lookup):
function Ga5(A) {
  if (A.endsWith(":*")) return !1;  // Legacy prefix, not wildcard
  for (let Q = 0; Q < A.length; Q++)
    if (A[Q] === "*") {
      let B = 0,
        G = Q - 1;
      while (G >= 0 && A[G] === "\\") B++, G--;
      if (B % 2 === 0) return !0  // Even backslashes = unescaped *
    }
  return !1
}

// READABLE (for understanding):
function containsUnescapedWildcard(pattern) {
  // Legacy prefix syntax ":*" is NOT wildcard
  if (pattern.endsWith(":*")) return false;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "*") {
      // Count preceding backslashes
      let backslashCount = 0;
      let j = i - 1;
      while (j >= 0 && pattern[j] === "\\") {
        backslashCount++;
        j--;
      }
      // Even number = unescaped (each \\ escapes itself)
      if (backslashCount % 2 === 0) return true;
    }
  }
  return false;
}

// Mapping: Ga5→containsUnescapedWildcard, A→pattern, Q→i, B→backslashCount, G→j
```

**Key insight:**
- `\*` → escaped star (literal `*`)
- `\\*` → escaped backslash + wildcard
- `\\\*` → escaped backslash + escaped star

---

## Wildcard Pattern Matching

```javascript
// ============================================
// matchWildcardPattern - Core wildcard matching algorithm
// Location: chunks.123.mjs:1992-2013
// ============================================

// ORIGINAL (for source lookup):
function hq0(A, Q) {
  let B = A.trim(),
    G = "\x00ESCAPED_STAR\x00",
    Z = "\x00ESCAPED_BACKSLASH\x00",
    Y = "",
    J = 0;
  while (J < B.length) {
    let K = B[J];
    if (K === "\\" && J + 1 < B.length) {
      let V = B[J + 1];
      if (V === "*") {
        Y += "\x00ESCAPED_STAR\x00", J += 2;
        continue
      } else if (V === "\\") {
        Y += "\x00ESCAPED_BACKSLASH\x00", J += 2;
        continue
      }
    }
    Y += K, J++
  }
  let D = Y.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")
           .replace(/\*/g, ".*")
           .replace(new RegExp("\x00ESCAPED_STAR\x00", "g"), "\\*")
           .replace(new RegExp("\x00ESCAPED_BACKSLASH\x00", "g"), "\\\\");
  return new RegExp(`^${D}$`).test(Q)
}

// READABLE (for understanding):
function matchWildcardPattern(pattern, command) {
  let trimmedPattern = pattern.trim();

  // Placeholder tokens for escaped sequences
  const ESCAPED_STAR = "\x00ESCAPED_STAR\x00";
  const ESCAPED_BACKSLASH = "\x00ESCAPED_BACKSLASH\x00";

  // Phase 1: Parse escape sequences
  let processedPattern = "";
  let i = 0;
  while (i < trimmedPattern.length) {
    let char = trimmedPattern[i];
    if (char === "\\" && i + 1 < trimmedPattern.length) {
      let nextChar = trimmedPattern[i + 1];
      if (nextChar === "*") {
        processedPattern += ESCAPED_STAR;
        i += 2;
        continue;
      } else if (nextChar === "\\") {
        processedPattern += ESCAPED_BACKSLASH;
        i += 2;
        continue;
      }
    }
    processedPattern += char;
    i++;
  }

  // Phase 2: Build regex
  let regexPattern = processedPattern
    // Escape all regex special chars
    .replace(/[.+?^${}()|[\]\\'"]/g, "\\$&")
    // Convert wildcard * to regex .*
    .replace(/\*/g, ".*")
    // Restore escaped star as literal \*
    .replace(new RegExp(ESCAPED_STAR, "g"), "\\*")
    // Restore escaped backslash as literal \\
    .replace(new RegExp(ESCAPED_BACKSLASH, "g"), "\\\\");

  // Phase 3: Test full match
  return new RegExp(`^${regexPattern}$`).test(command);
}

// Mapping: hq0→matchWildcardPattern, A→pattern, Q→command, B→trimmedPattern
```

**Algorithm deep-dive:**

1. **Escape sequence parsing:** Uses placeholder tokens to preserve escaped `\*` and `\\`
2. **Regex conversion:** Converts pattern to regex, handling special characters
3. **Wildcard transformation:** `*` becomes `.*` (match anything)
4. **Full match anchored:** `^...$` ensures entire command must match

**Why this approach:**
- Placeholder tokens prevent double-escaping issues
- Full regex power without exposing users to regex complexity
- Anchored match prevents partial matches (security)

---

## Permission Rule Matching

```javascript
// ============================================
// findMatchingPermissionRules - Find rules that match command
// Location: chunks.123.mjs:2061-2088
// ============================================

// ORIGINAL (for source lookup):
function kq0(A, Q, B) {
  let G = A.command.trim(),
    Z = Hx(G).commandWithoutRedirections,
    J = (B === "exact" ? [G, Z] : [Z]).flatMap((X) => {
      let I = Pq0(X);
      return I !== X ? [X, I] : [X]
    });
  return Array.from(Q.entries()).filter(([X]) => {
    let I = gq0(X);
    return J.some((D) => {
      switch (I.type) {
        case "exact":
          return I.command === D;
        case "prefix":
          switch (B) {
            case "exact":
              return I.prefix === D;
            case "prefix":
              if (D === I.prefix) return !0;
              return D.startsWith(I.prefix + " ")
          }
          break;
        case "wildcard":
          if (B === "exact") return !1;
          return hq0(I.pattern, D)
      }
    })
  }).map(([, X]) => X)
}

// READABLE (for understanding):
function findMatchingPermissionRules(input, ruleMap, matchMode) {
  let command = input.command.trim();

  // Strip redirections for matching
  let commandWithoutRedirections = parseCommand(command).commandWithoutRedirections;

  // Build candidate commands to match against
  let candidateCommands = (matchMode === "exact" ? [command, commandWithoutRedirections] : [commandWithoutRedirections])
    .flatMap((cmd) => {
      // Also try stripped command (without prefixes like timeout, env vars)
      let strippedCmd = stripCommandPrefixes(cmd);
      return strippedCmd !== cmd ? [cmd, strippedCmd] : [cmd];
    });

  // Check each rule
  return Array.from(ruleMap.entries())
    .filter(([rulePattern]) => {
      let patternInfo = classifyPermissionPattern(rulePattern);

      return candidateCommands.some((candidateCmd) => {
        switch (patternInfo.type) {
          case "exact":
            return patternInfo.command === candidateCmd;

          case "prefix":
            if (matchMode === "exact") {
              return patternInfo.prefix === candidateCmd;
            }
            // Prefix mode: match exact or with space separator
            if (candidateCmd === patternInfo.prefix) return true;
            return candidateCmd.startsWith(patternInfo.prefix + " ");

          case "wildcard":
            // Wildcard never matches in exact mode (security)
            if (matchMode === "exact") return false;
            return matchWildcardPattern(patternInfo.pattern, candidateCmd);
        }
      });
    })
    .map(([, rule]) => rule);
}

// Mapping: kq0→findMatchingPermissionRules, A→input, Q→ruleMap, B→matchMode, Hx→parseCommand, Pq0→stripCommandPrefixes, gq0→classifyPermissionPattern, hq0→matchWildcardPattern
```

**Why strip command prefixes:**
Commands like `timeout 10 npm install` should match `npm install` rule.
Stripped prefixes include: `timeout`, `time`, `nice -n`, `nohup`, and specific environment variables.

---

## Security Checks

### Command Injection Detection

```javascript
// ============================================
// checkCommandInjection - Main security check dispatcher
// Location: chunks.121.mjs:1446-1475
// ============================================

// ORIGINAL (for source lookup):
function Mf(A) {
  let Q = A.split(" ")[0] || "",
    {
      withDoubleQuotes: B,
      fullyUnquoted: G
    } = Ri5(A, Q === "jq"),
    Z = {
      originalCommand: A,
      baseCommand: Q,
      unquotedContent: B,
      fullyUnquotedContent: _i5(G)
    },
    Y = [Ti5, Pi5, xi5, vi5, yi5];  // Allow checks
  for (let X of Y) {
    let I = X(Z);
    if (I.behavior === "allow") return {
      behavior: "passthrough",
      message: I.decisionReason?.type === "other" ? I.decisionReason.reason : "Command allowed"
    };
    if (I.behavior !== "passthrough") return I
  }
  let J = [ki5, ci5, bi5, fi5, gi5, ui5, mi5, hi5, di5];  // Security checks
  for (let X of J) {
    let I = X(Z);
    if (I.behavior === "ask") return I
  }
  return {
    behavior: "passthrough",
    message: "Command passed all security checks"
  }
}

// READABLE (for understanding):
function checkCommandInjection(command) {
  let baseCommand = command.split(" ")[0] || "";

  // Prepare context for checks
  let { withDoubleQuotes, fullyUnquoted } = removeQuotedContent(command, baseCommand === "jq");
  let context = {
    originalCommand: command,
    baseCommand: baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: processUnquoted(fullyUnquoted)
  };

  // Phase 1: Check for explicit allows (short-circuit)
  let allowChecks = [checkIncompleteCommands, checkJqSystem, checkJqFile, checkShellMetachars, checkDangerousVars];
  for (let check of allowChecks) {
    let result = check(context);
    if (result.behavior === "allow") {
      return { behavior: "passthrough", message: result.decisionReason?.reason || "Command allowed" };
    }
    if (result.behavior !== "passthrough") return result;
  }

  // Phase 2: Security checks that require user confirmation
  let securityChecks = [
    checkNewlines,              // Newline injection
    checkObfuscatedFlags,       // Quoted flag names
    checkCommandSubstitution,   // $() and backticks
    checkInputRedirection,      // < redirection
    checkOutputRedirection,     // > redirection
    checkIfsInjection,          // $IFS bypass
    checkProcEnviron,           // /proc/*/environ access
    checkHeredocSubstitution,   // <<< heredoc tricks
    checkMalformedTokens        // Ambiguous syntax
  ];
  for (let check of securityChecks) {
    let result = check(context);
    if (result.behavior === "ask") return result;
  }

  return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: Mf→checkCommandInjection, Ri5→removeQuotedContent, _i5→processUnquoted
```

### Security Check Categories

| Check ID | Name | Description |
|----------|------|-------------|
| `NEWLINES` | Newline injection | `\n` that could separate commands |
| `OBFUSCATED_FLAGS` | Quoted flags | `'-rf'` or `$'...'` quoting tricks |
| `SHELL_METACHARACTERS` | Metachar bypass | Special shell characters |
| `DANGEROUS_VARIABLES` | Env var expansion | `$HOME`, `$PATH` in sensitive context |
| `COMMAND_SUBSTITUTION` | `$()` substitution | Command substitution patterns |
| `IFS_INJECTION` | `$IFS` bypass | IFS manipulation to bypass parsing |
| `PROC_ENVIRON_ACCESS` | `/proc/*/environ` | Reading process environment |
| `MALFORMED_TOKEN_INJECTION` | Ambiguous syntax | Commands with confusing separators |

---

## Compound Command Security (2.1.7)

**Security vulnerability fixed:** Commands using `cd` followed by write operations could bypass path validation.

```javascript
// ============================================
// checkCompoundCommandSecurity - Block cd + write patterns
// Location: chunks.123.mjs:1136-1142
// ============================================

// ORIGINAL (for source lookup):
if (Z && X !== "read") return {
  behavior: "ask",
  message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
  decisionReason: {
    type: "other",
    reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass"
  }
};

// READABLE (context):
// Z = hasCdCommand, X = operationType
if (hasCdCommand && operationType !== "read") {
  return {
    behavior: "ask",
    message: "Commands that change directories and perform write operations require explicit approval...",
    decisionReason: {
      type: "other",
      reason: "Compound command contains cd with write operation - manual approval required"
    }
  };
}
```

**Why this matters:**
```bash
# DANGEROUS: cd changes working directory, then write operation uses relative path
cd /tmp && echo "malicious" > ../etc/passwd

# Claude can't evaluate the final path because:
# 1. cd changes the directory
# 2. Write target "../etc/passwd" is relative to new directory
# 3. Pre-execution validation uses original working directory
```

---

## Permission Validation Schema

```javascript
// ============================================
// validatePermissionRule - Validates permission syntax
// Location: chunks.90.mjs:1443-1481
// ============================================

// Key validation rules:

// :* must be at end (legacy prefix syntax)
if (J.includes(":*") && !J.endsWith(":*")) return {
  valid: !1,
  error: "The :* pattern must be at the end",
  suggestion: "Move :* to the end for prefix matching, or use * for wildcard matching",
  examples: ["Bash(npm run:*) - prefix matching (legacy)", "Bash(npm run *) - wildcard matching"]
};

// Empty prefix not allowed
if (J === ":*") return {
  valid: !1,
  error: "Prefix cannot be empty before :*",
  suggestion: "Specify a command prefix before :*",
  examples: ["Bash(npm:*)", "Bash(git:*)"]
};

// * alone means use Bash without parentheses
if (J === "*") return {
  valid: !1,
  error: 'Use "Bash" without parentheses to allow all commands',
  suggestion: "Remove the parentheses or specify a command pattern",
  examples: ["Bash", "Bash(npm:*)", "Bash(npm *)"]
};
```

---

## Usage Examples

### ALLOWED Examples
```bash
# With rule: Bash(npm *)
npm install lodash        # ✓ matches "npm *"
npm run build             # ✓ matches "npm *"
npm test -- --coverage    # ✓ matches "npm *"

# With rule: Bash(git * main)
git push origin main      # ✓ matches "git * main"
git pull upstream main    # ✓ matches "git * main"

# With rule: Bash(* --version)
node --version            # ✓ matches "* --version"
python --version          # ✓ matches "* --version"
```

### BLOCKED Examples
```bash
# With rule: Bash(npm *)
npm install && rm -rf /   # ✗ compound command security check
npm install $MALICIOUS    # ✗ variable expansion check

# With rule: Bash(git * main)
git push origin develop   # ✗ doesn't match pattern (no "main")
```

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK` | Disable security checks | `false` |

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key functions in this document:
- `classifyPermissionPattern` (gq0) - Pattern type classification
- `containsUnescapedWildcard` (Ga5) - Wildcard detection
- `matchWildcardPattern` (hq0) - Core wildcard matching
- `findMatchingPermissionRules` (kq0) - Rule matching
- `checkCommandInjection` (Mf) - Security check dispatcher
- `stripCommandPrefixes` (Pq0) - Remove timeout/env prefixes

---

## See Also

- [../07_tool/](../07_tool/) - Bash tool implementation
- [permission.md](./permission.md) - General permission system

