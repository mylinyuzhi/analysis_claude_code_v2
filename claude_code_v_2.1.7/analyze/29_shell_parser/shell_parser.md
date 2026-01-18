# Shell Parser Module (2.1.7)

> Multi-layer shell command parsing, tokenization, and security analysis system
> Used by the Bash tool for safe command execution

---

## Overview

The shell parser in Claude Code is a sophisticated multi-layer system for parsing, analyzing, and validating bash commands before execution. It combines tree-sitter-based parsing with tokenization, security analysis, and command decomposition to ensure safe command execution.

### Key Capabilities

1. **Command Tokenization** - Break commands into tokens while preserving shell semantics
2. **Tree-based Parsing** - Accurate pipe and redirection extraction via tree-sitter
3. **Security Analysis** - Multi-tier risk classification and injection detection
4. **Pipe Permission Checking** - Per-segment validation of piped commands
5. **CWD Reset Detection** - Detect directory changes in command output

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Shell Parser Architecture                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Command → [Tokenization Layer] → [Tree-based Parsing] → [Security Analysis]
                     │                       │                      │
                     ▼                       ▼                      ▼
              tokenizeCommand()      shellCommandParser        shellOperatorChecker
                  (ZfA)                  (cK1)                      (Mf)
                     │                       │                      │
                     ▼                       ▼                      ▼
              Token Array           RichCommand/SimpleCommand   Risk Classification
                                                                      │
                                                                      ▼
                                                            [Pipe Permission Checker]
                                                                   (cm2)
                                                                      │
                                                                      ▼
                                                            passthrough/ask/deny
```

---

## Component 1: Tokenization Layer

### tokenizeCommand (ZfA)

**Location:** chunks.147.mjs:765-817

**What it does:** Breaks shell commands into constituent tokens while handling quote escape sequences and variable substitutions.

**How it works:**

1. Extract heredocs and placeholder them with unique markers
2. Replace quotes with escape markers to preserve them during parsing
3. Use bY parser (shell-parse library) to tokenize with custom handler
4. Process each token:
   - Flatten consecutive string tokens (concatenate with space)
   - Track glob patterns separately
   - Filter out pipe operators (`|`)
5. Restore escaped characters and reconstruct quote sequences
6. Rehydrate heredocs back into the token array
7. Fall back to single-token array if parsing fails

```javascript
// ============================================
// tokenizeCommand - Command tokenization with quote/heredoc handling
// Location: chunks.147.mjs:765-817
// ============================================

// ORIGINAL (for source lookup):
function ZfA(A) {
  let Q = [],
    B = DJ9(),
    { processedCommand: G, heredocs: Z } = IP0(A),
    Y = G.replace(/\\+\n/g, (I) => { let D = I.length - 1; return D % 2 === 1 ? "\\".repeat(D - 1) : I; }),
    J = bY(Y.replaceAll('"', `"${B.DOUBLE_QUOTE}`).replaceAll("'", `'${B.SINGLE_QUOTE}`).replaceAll(`\n`, `\n${B.NEW_LINE}\n`).replaceAll("\\(", B.ESCAPED_OPEN_PAREN).replaceAll("\\)", B.ESCAPED_CLOSE_PAREN), (I) => `$${I}`);
  // ... token processing ...
  return YJ9(D, Z);
}

// READABLE (for understanding):
function tokenizeCommand(command) {
  let tokens = [];
  let escapeMarkers = getEscapeMarkers();
  let { processedCommand, heredocs } = extractHeredocs(command);

  // Normalize line continuations
  let normalizedCommand = processedCommand.replace(/\\+\n/g, (seq) => {
    let escapedCount = seq.length - 1;
    return escapedCount % 2 === 1 ? "\\".repeat(escapedCount - 1) : seq;
  });

  // Prepare for parsing by marking special characters
  let parseResult = bYParser(
    normalizedCommand
      .replaceAll('"', `"${escapeMarkers.DOUBLE_QUOTE}`)
      .replaceAll("'", `'${escapeMarkers.SINGLE_QUOTE}`)
      .replaceAll("\n", `\n${escapeMarkers.NEW_LINE}\n`)
      .replaceAll("\\(", escapeMarkers.ESCAPED_OPEN_PAREN)
      .replaceAll("\\)", escapeMarkers.ESCAPED_CLOSE_PAREN),
    (token) => `$${token}`
  );

  // Process tokens: flatten strings, track globs, filter pipes
  for (let token of parseResult.tokens) {
    if (typeof token === "string") {
      if (tokens.length > 0 && typeof tokens[tokens.length - 1] === "string") {
        tokens[tokens.length - 1] += " " + token;
      } else {
        tokens.push(token);
      }
    } else if ("op" in token && token.op === "glob") {
      // Append glob pattern to previous token
    }
  }

  return reconstructHeredocs(tokens, heredocs);
}

// Mapping: ZfA→tokenizeCommand, A→command, Q→tokens, B→escapeMarkers,
//          G→processedCommand, Z→heredocs, DJ9→getEscapeMarkers,
//          IP0→extractHeredocs, bY→bYParser, YJ9→reconstructHeredocs
```

**Key insight:** The tokenizer preserves shell semantics by treating quoted strings and escape sequences as special, preventing tokenization from breaking apart intentional string literals.

### bY Parser (shell-parse library wrapper)

**Location:** chunks.20.mjs:2044-2057

**What it does:** Wraps the shell-parse library to safely tokenize commands.

```javascript
// ============================================
// bY - Shell command tokenizer wrapper
// Location: chunks.20.mjs:2044-2057
// ============================================

// ORIGINAL (for source lookup):
function bY(A, Q) {
  try {
    return {
      success: !0,
      tokens: typeof Q === "function" ? kGA.parse(A, Q) : kGA.parse(A, Q)
    }
  } catch (B) {
    if (B instanceof Error) e(B);
    return {
      success: !1,
      error: B instanceof Error ? B.message : "Unknown parse error"
    }
  }
}

// READABLE (for understanding):
function bYParser(command, handler) {
  try {
    return {
      success: true,
      tokens: shellParseLib.parse(command, handler)
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown parse error"
    };
  }
}

// Mapping: bY→bYParser, A→command, Q→handler, kGA→shellParseLib
```

---

## Component 2: Tree-based Parsing

### shellCommandParser (cK1)

**Location:** chunks.123.mjs:826-841

**What it does:** High-level command parser that uses tree-sitter when available, falls back to SimpleCommand when unavailable.

**Why this approach:** Tree-sitter provides accurate syntax analysis for complex pipes and redirections, but since it's WASM-based and may not always be available, the system gracefully falls back to SimpleCommand for basic parsing.

```javascript
// ============================================
// shellCommandParser - Tree-sitter or fallback parser
// Location: chunks.123.mjs:826-841
// ============================================

// ORIGINAL (for source lookup):
let cK1 = {
  async parse(A) {
    if (!A) return null;
    if (await xn5()) try {
      let { parseCommand: B } = await Promise.resolve().then(() => (Oq0(), Lq0)),
        G = await B(A);
      if (G) {
        let Z = Pn5(G.rootNode),
          Y = Sn5(G.rootNode);
        return G.tree.delete(), new mm2(A, Z, Y)
      }
    } catch {}
    return new um2(A)
  }
};

// READABLE (for understanding):
let shellCommandParser = {
  async parse(command) {
    if (!command) return null;

    // Try tree-sitter first (accurate but may not be available)
    if (await isTreeSitterAvailable()) {
      try {
        let { parseCommand } = await loadTreeSitterParser();
        let parseTree = await parseCommand(command);

        if (parseTree) {
          let pipePositions = extractPipePositions(parseTree.rootNode);
          let redirectionNodes = extractRedirections(parseTree.rootNode);
          parseTree.tree.delete();  // Free WASM memory

          return new RichCommand(command, pipePositions, redirectionNodes);
        }
      } catch (error) {
        // Silently fall back to SimpleCommand
      }
    }

    // Fallback: tokenization-based parsing
    return new SimpleCommand(command);
  }
};

// Mapping: cK1→shellCommandParser, A→command, xn5→isTreeSitterAvailable,
//          Pn5→extractPipePositions, Sn5→extractRedirections,
//          mm2→RichCommand, um2→SimpleCommand
```

### RichCommand (mm2)

**Location:** chunks.123.mjs:768-807

**What it does:** Command representation when tree-sitter parsing succeeds, provides accurate pipe/redirection extraction.

```javascript
// ============================================
// RichCommand - Tree-sitter backed command analysis
// Location: chunks.123.mjs:768-807
// ============================================

// ORIGINAL (for source lookup):
class mm2 {
  originalCommand;
  pipePositions;
  redirectionNodes;

  constructor(A, Q, B) {
    this.originalCommand = A;
    this.pipePositions = Q;
    this.redirectionNodes = B;
  }

  getPipeSegments() {
    if (this.pipePositions.length === 0) return [this.originalCommand];
    let A = [], Q = 0;
    for (let G of this.pipePositions) {
      let Z = this.originalCommand.slice(Q, G).trim();
      if (Z) A.push(Z);
      Q = G + 1;
    }
    let B = this.originalCommand.slice(Q).trim();
    if (B) A.push(B);
    return A;
  }

  withoutOutputRedirections() {
    if (this.redirectionNodes.length === 0) return this.originalCommand;
    let A = [...this.redirectionNodes].sort((B, G) => G.startIndex - B.startIndex);
    let Q = this.originalCommand;
    for (let B of A) Q = Q.slice(0, B.startIndex) + Q.slice(B.endIndex);
    return Q.trim().replace(/\s+/g, " ");
  }

  getOutputRedirections() {
    return this.redirectionNodes.map(({ target: A, operator: Q }) => ({
      target: A,
      operator: Q
    }));
  }
}

// READABLE (for understanding):
class RichCommand {
  originalCommand;
  pipePositions;      // Array of indices where | operators occur
  redirectionNodes;   // Array of {startIndex, endIndex, target, operator}

  constructor(originalCommand, pipePositions, redirectionNodes) {
    this.originalCommand = originalCommand;
    this.pipePositions = pipePositions;
    this.redirectionNodes = redirectionNodes;
  }

  getPipeSegments() {
    // Split command at each pipe position
    if (this.pipePositions.length === 0) {
      return [this.originalCommand];
    }

    let segments = [];
    let currentPos = 0;

    for (let pipePos of this.pipePositions) {
      let segment = this.originalCommand.slice(currentPos, pipePos).trim();
      if (segment) segments.push(segment);
      currentPos = pipePos + 1;  // Skip past the |
    }

    let lastSegment = this.originalCommand.slice(currentPos).trim();
    if (lastSegment) segments.push(lastSegment);

    return segments;
  }

  withoutOutputRedirections() {
    // Remove redirections from command, preserving everything else
    if (this.redirectionNodes.length === 0) {
      return this.originalCommand;
    }

    // Sort by reverse position (remove from end first to preserve indices)
    let sortedRedirections = [...this.redirectionNodes]
      .sort((a, b) => b.startIndex - a.startIndex);

    let result = this.originalCommand;
    for (let redirection of sortedRedirections) {
      result = result.slice(0, redirection.startIndex) +
               result.slice(redirection.endIndex);
    }

    return result.trim().replace(/\s+/g, " ");
  }

  getOutputRedirections() {
    return this.redirectionNodes.map(({ target, operator }) => ({
      target,
      operator  // >, >>, >&, etc.
    }));
  }
}

// Mapping: mm2→RichCommand, A→originalCommand, Q→pipePositions, B→redirectionNodes
```

### SimpleCommand (um2) - Fallback

**Location:** chunks.123.mjs:695-732

**What it does:** Fallback command parser using tokenization when tree-sitter unavailable.

```javascript
// ============================================
// SimpleCommand - Fallback tokenization-based parser
// Location: chunks.123.mjs:695-732
// ============================================

// ORIGINAL (for source lookup):
class um2 {
  originalCommand;

  constructor(A) {
    this.originalCommand = A;
  }

  getPipeSegments() {
    try {
      let A = ZfA(this.originalCommand);
      let Q = [], B = [];
      for (let G of A) {
        if (G === "|") {
          if (B.length > 0) Q.push(B.join(" "));
          B = [];
        } else {
          B.push(G);
        }
      }
      if (B.length > 0) Q.push(B.join(" "));
      return Q.length > 0 ? Q : [this.originalCommand];
    } catch {
      return [this.originalCommand];
    }
  }

  withoutOutputRedirections() {
    if (!this.originalCommand.includes(">")) return this.originalCommand;
    let { commandWithoutRedirections: A } = Hx(this.originalCommand);
    return A;
  }

  getOutputRedirections() {
    let { redirections: A } = Hx(this.originalCommand);
    return A;
  }
}

// READABLE (for understanding):
class SimpleCommand {
  originalCommand;

  constructor(originalCommand) {
    this.originalCommand = originalCommand;
  }

  getPipeSegments() {
    try {
      let tokens = tokenizeCommand(this.originalCommand);
      let segments = [];
      let currentSegment = [];

      for (let token of tokens) {
        if (token === "|") {
          if (currentSegment.length > 0) {
            segments.push(currentSegment.join(" "));
            currentSegment = [];
          }
        } else {
          currentSegment.push(token);
        }
      }

      if (currentSegment.length > 0) {
        segments.push(currentSegment.join(" "));
      }

      return segments.length > 0 ? segments : [this.originalCommand];
    } catch (error) {
      return [this.originalCommand];
    }
  }

  withoutOutputRedirections() {
    if (!this.originalCommand.includes(">")) {
      return this.originalCommand;
    }

    let { commandWithoutRedirections } = extractOutputRedirections(this.originalCommand);
    return commandWithoutRedirections;
  }

  getOutputRedirections() {
    let { redirections } = extractOutputRedirections(this.originalCommand);
    return redirections;
  }
}

// Mapping: um2→SimpleCommand, A→originalCommand, ZfA→tokenizeCommand,
//          Hx→extractOutputRedirections
```

---

## Component 3: Output Redirection Extraction

### extractOutputRedirections (Hx)

**Location:** chunks.147.mjs:909-957

**What it does:** Safely extracts output redirections (`>`, `>>`, `>&`) while filtering them from the command.

**How it works:**

1. Tokenize the command using bY parser
2. Track parentheses nesting to distinguish subshell redirections
3. Iterate through tokens identifying redirection patterns:
   - `>` or `>>` followed by a target (file descriptor or filename)
   - `>&` for file descriptor redirections (`>&1`, `>&2`, etc.)
4. Validate redirections:
   - File descriptors must be in {0, 1, 2}
   - Targets must not contain special shell metacharacters
5. Remove valid redirections from token stream
6. Reconstruct command without redirections

```javascript
// ============================================
// extractOutputRedirections - Output redirection detection and removal
// Location: chunks.147.mjs:909-957
// ============================================

// READABLE (for understanding):
function extractOutputRedirections(command) {
  let redirections = [];
  let parseResult = bYParser(command, (token) => `$${token}`);

  if (!parseResult.success) {
    return {
      commandWithoutRedirections: command,
      redirections: []
    };
  }

  let tokens = parseResult.tokens;
  let subshellRedirections = new Set();
  let parenStack = [];

  // Track which redirections belong to subshells
  // Subshell redirections: (command) > file - NOT removed
  tokens.forEach((token, index) => {
    if (isOpenParen(token)) {
      let prevToken = tokens[index - 1];
      let isSubshellStart = index === 0 ||
        (typeof prevToken === "object" && "op" in prevToken &&
         ["&&", "||", ";", "|"].includes(prevToken.op));
      parenStack.push({ index, isSubshellStart });
    } else if (isCloseParen(token) && parenStack.length > 0) {
      let openParen = parenStack.pop();
      let nextToken = tokens[index + 1];

      if (openParen.isSubshellStart && isRedirectOperator(nextToken)) {
        subshellRedirections.add(openParen.index).add(index);
      }
    }
  });

  // Extract and validate redirections
  let filteredTokens = [];
  let i = 0;

  while (i < tokens.length) {
    let token = tokens[i];

    // Skip subshell boundary tokens
    if (subshellRedirections.has(i)) {
      i++;
      continue;
    }

    let { skip, redirection } = processRedirectToken(
      token, tokens[i-1], tokens[i+1], tokens[i+2], tokens[i+3]
    );

    if (skip > 0) {
      if (redirection) redirections.push(redirection);
      i += skip;
    } else {
      filteredTokens.push(token);
      i++;
    }
  }

  return {
    commandWithoutRedirections: reconstructCommand(filteredTokens, command),
    redirections
  };
}

// Mapping: Hx→extractOutputRedirections, A→command, Q→redirections,
//          B→parseResult, G→tokens, Z→subshellRedirections, Y→parenStack
```

**Key insight:** The redirection extractor must distinguish between:
- **Direct redirections:** `> file` or `>&1` - these ARE removed
- **Subshell redirections:** `(command) > file` - these are NOT removed (essential to command correctness)

---

## Component 4: Security Analysis

### shellOperatorChecker (Mf)

**Location:** chunks.121.mjs:1446-1476

**What it does:** Multi-layer security checker that classifies commands by risk level.

**Architecture:**
- **Allow checkers** (pass-through): Run first, skip further analysis if command is allowed
- **Ask checkers** (require approval): Run second, trigger user confirmation dialog

```javascript
// ============================================
// shellOperatorChecker - Multi-layer shell security analysis
// Location: chunks.121.mjs:1446-1476
// ============================================

// ORIGINAL (for source lookup):
function Mf(A) {
  let Q = A.split(" ")[0] || "",
    { withDoubleQuotes: B, fullyUnquoted: G } = Ri5(A, Q === "jq"),
    Z = {
      originalCommand: A,
      baseCommand: Q,
      unquotedContent: B,
      fullyUnquotedContent: _i5(G)
    },
    Y = [Ti5, Pi5, xi5, vi5, yi5];  // Allow checkers

  for (let X of Y) {
    let I = X(Z);
    if (I.behavior === "allow") return { behavior: "passthrough", message: I.decisionReason?.type === "other" ? I.decisionReason.reason : "Command allowed" };
    if (I.behavior !== "passthrough") return I;
  }

  let J = [ki5, ci5, bi5, fi5, gi5, ui5, mi5, hi5, di5];  // Ask checkers
  for (let X of J) {
    let I = X(Z);
    if (I.behavior === "ask") return I;
  }

  return { behavior: "passthrough", message: "Command passed all security checks" };
}

// READABLE (for understanding):
function shellOperatorChecker(command) {
  let baseCommand = command.split(" ")[0] || "";
  let { withDoubleQuotes, fullyUnquoted } = unquoteContent(command, baseCommand === "jq");

  let context = {
    originalCommand: command,
    baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: unquoteCompletelyHelper(fullyUnquoted)
  };

  // Tier 1: Allow checkers (safe commands that skip approval)
  let allowCheckers = [
    checkAllowedStandardTools,     // ls, cat, grep, etc.
    checkPackageManagerReadOnly,   // npm list, pip show, etc.
    checkCommonDisplayCommands,    // echo, printf, etc.
    checkHelpFlags,                // --help, -h
    checkVersionFlags              // --version, -v
  ];

  for (let checker of allowCheckers) {
    let result = checker(context);
    if (result.behavior === "allow") {
      return { behavior: "passthrough", message: "Command allowed" };
    }
    if (result.behavior !== "passthrough") return result;
  }

  // Tier 2: Ask checkers (potentially dangerous commands)
  let askCheckers = [
    checkIncompleteCommands,       // cd without args
    checkJqSystemFunctions,        // jq "system(...)"
    checkJqFileArguments,          // jq with file operations
    checkObfuscatedFlags,          // Hidden flag patterns
    checkShellMetacharacters,      // &, |, &&, ||, ;
    checkDangerousVariables,       // $IFS, $LD_PRELOAD
    checkNewlines,                 // \n injection
    checkCommandSubstitution       // $(...), `...`
  ];

  for (let checker of askCheckers) {
    let result = checker(context);
    if (result.behavior === "ask") return result;
  }

  return { behavior: "passthrough", message: "Command passed all security checks" };
}

// Mapping: Mf→shellOperatorChecker, A→command, Q→baseCommand,
//          B→withDoubleQuotes, G→fullyUnquoted, Z→context
```

### Security Risk Categories

The system tracks 14 security risk categories:

```javascript
// ============================================
// Shell Security Risk Categories
// Location: chunks.121.mjs:1487-1523
// ============================================

const SECURITY_RISK_TYPES = {
  INCOMPLETE_COMMANDS: 1,                        // cd without args, git push without target
  JQ_SYSTEM_FUNCTION: 2,                         // jq "system(...)"
  JQ_FILE_ARGUMENTS: 3,                          // jq with input/output redirections
  OBFUSCATED_FLAGS: 4,                           // Hidden flag patterns (e.g., "c\u0000at")
  SHELL_METACHARACTERS: 5,                       // &, |, &&, ||, ; in unquoted content
  DANGEROUS_VARIABLES: 6,                        // $IFS, $LD_PRELOAD, sensitive env vars
  NEWLINES: 7,                                   // \n in command (multi-line injection)
  DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,   // $(cat ...) - exfiltration risk
  DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,      // < /etc/passwd - information disclosure
  DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,    // > /sys/something - system modification
  IFS_INJECTION: 11,                             // IFS='x' command
  GIT_COMMIT_SUBSTITUTION: 12,                   // git commit with embedded commands
  PROC_ENVIRON_ACCESS: 13,                       // Access to /proc/self/environ
  MALFORMED_TOKEN_INJECTION: 14                  // Escape sequence attacks
};

// Example dangerous patterns:
const DANGEROUS_PATTERNS = [
  { pattern: /<\(/, message: "process substitution <()" },
  { pattern: />\(/, message: "process substitution >()" },
  { pattern: /\$\(/, message: "$() command substitution" },
  { pattern: /\$\{/, message: "${} parameter substitution" },
  { pattern: /~\[/, message: "Zsh-style parameter expansion" },
  { pattern: /\(e:/, message: "Zsh-style glob qualifiers" }
];
```

**Why separate checks:** Different tools have different threat models:
- **jq:** Dangerous `system()` function, file operations
- **git:** Command injection in commit messages
- **npm/pip:** Argument injection in package operations

---

## Component 5: Pipe Permission Checking

### pipePermissionChecker (cm2)

**Location:** chunks.123.mjs:909-934

**What it does:** Validates that each segment of a piped command passes permission checks.

**How it works:**

1. Parse command to extract pipe segments
2. If no pipes, return "passthrough" (permission system handles full command)
3. Remove output redirections from each segment
4. Run permission check on each segment independently
5. Aggregate results:
   - If ANY segment is denied → deny entire pipe
   - If ALL segments are allowed → allow pipe
   - Otherwise → ask user for approval

```javascript
// ============================================
// pipePermissionChecker - Multi-segment pipe validation
// Location: chunks.123.mjs:909-934
// ============================================

// ORIGINAL (for source lookup):
async function cm2(A, Q) {
  // First check for dangerous shell operators
  if (lm2(A.command)) {
    let Y = Mf(A.command);
    let J = { type: "other", reason: Y.behavior === "ask" && Y.message ? Y.message : "This command uses shell operators that require approval for safety" };
    return { behavior: "ask", message: YD(o2.name, J), decisionReason: J };
  }

  let B = await cK1.parse(A.command);
  if (!B) return { behavior: "passthrough", message: "Failed to parse command" };

  let G = B.getPipeSegments();
  if (G.length <= 1) return { behavior: "passthrough", message: "No pipes found in command" };

  let Z = await Promise.all(G.map((Y) => vn5(Y)));
  return yn5(A, Z, Q);
}

// READABLE (for understanding):
async function pipePermissionChecker(request, permissionChecker) {
  // Check for dangerous shell operators first
  if (hasShellOperators(request.command)) {
    let shellCheck = shellOperatorChecker(request.command);
    let reason = {
      type: "other",
      reason: shellCheck.behavior === "ask" && shellCheck.message ?
              shellCheck.message :
              "This command uses shell operators that require approval for safety"
    };
    return {
      behavior: "ask",
      message: formatDecisionMessage("Bash", reason),
      decisionReason: reason
    };
  }

  // Parse command to extract pipe segments
  let parsedCommand = await shellCommandParser.parse(request.command);
  if (!parsedCommand) {
    return { behavior: "passthrough", message: "Failed to parse command" };
  }

  let pipeSegments = parsedCommand.getPipeSegments();

  // Single command (no pipes) - skip pipe-specific validation
  if (pipeSegments.length <= 1) {
    return { behavior: "passthrough", message: "No pipes found in command" };
  }

  // Remove redirections from each segment and validate independently
  let segmentsWithoutRedirections = await Promise.all(
    pipeSegments.map((segment) => stripOutputRedirections(segment))
  );

  // Check each segment against permission rules
  return validatePipeSegments(request, segmentsWithoutRedirections, permissionChecker);
}

// Mapping: cm2→pipePermissionChecker, A→request, Q→permissionChecker,
//          lm2→hasShellOperators, Mf→shellOperatorChecker, cK1→shellCommandParser,
//          vn5→stripOutputRedirections, yn5→validatePipeSegments
```

---

## Component 6: CWD Reset Detection

### extractCwdReset (Fb5)

**Location:** chunks.112.mjs:53-64

**What it does:** Detects when a command changes the working directory, used to warn users about CWD state.

```javascript
// ============================================
// extractCwdReset - CWD change detection
// Location: chunks.112.mjs:53-64
// ============================================

// ORIGINAL (for source lookup):
function Fb5(A) {
  let Q = A.match(UT2);
  if (!Q) return { cleanedStderr: A, cwdResetWarning: null };
  let B = Q[1] ?? null;
  return {
    cleanedStderr: A.replace(UT2, "").trim(),
    cwdResetWarning: B
  };
}

// READABLE (for understanding):
function extractCwdReset(stderr) {
  let match = stderr.match(CWD_RESET_REGEX);
  if (!match) {
    return { cleanedStderr: stderr, cwdResetWarning: null };
  }

  let newCwd = match[1] ?? null;

  return {
    cleanedStderr: stderr.replace(CWD_RESET_REGEX, "").trim(),
    cwdResetWarning: newCwd  // e.g., "/Users/user/new/path"
  };
}

// Mapping: Fb5→extractCwdReset, A→stderr, Q→match, B→newCwd, UT2→CWD_RESET_REGEX
```

---

## Integration with Bash Tool

The shell parser integrates with Claude Code's Bash execution in three key ways:

### 1. Command Validation (Pre-execution)

```
User Input → tokenizeCommand() → shellOperatorChecker() → Permission Decision
                                        │
                                        ├─ passthrough → Execute directly
                                        ├─ ask → Show approval prompt
                                        └─ deny → Block execution
```

### 2. Pipe Permission Checking

```
"ls -la | grep foo | wc -l"
           │
           ▼
     pipePermissionChecker()
           │
           ├─ Extract segments: ["ls -la", "grep foo", "wc -l"]
           │
           ├─ Check each segment independently
           │
           └─ Aggregate: ALL allowed → allow, ANY denied → deny
```

### 3. Output Processing (Post-execution)

```
Command Output → extractCwdReset() → Clean stderr + CWD warning
                                            │
                                            ▼
                                   Display to user
```

---

## Component 7: Security Risk Types (Complete)

The shell parser defines **14 security risk types** with multiple sub-checks. Each type maps to specific attack vectors.

### Risk Type Definitions

```javascript
// ============================================
// Security Risk Type Constants
// Location: chunks.121.mjs:1487-1523
// ============================================

const SECURITY_RISK_TYPES = {
  INCOMPLETE_COMMANDS: 1,                    // SubIds: 1-3 (tab, flag, operator start)
  JQ_SYSTEM_FUNCTION: 2,                     // SubId: 1 (jq system() calls)
  JQ_FILE_ARGUMENTS: 3,                      // SubId: 1 (jq file access flags)
  OBFUSCATED_FLAGS: 4,                       // SubIds: 1-9 (quoted/hidden flags)
  SHELL_METACHARACTERS: 5,                   // SubIds: 1-3 (;|& in arguments)
  DANGEROUS_VARIABLES: 6,                    // SubId: 1 ($VAR near redirects)
  NEWLINES: 7,                               // SubId: 1 (multiline injection)
  DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,// SubId: 1 ($(), ``, ${}, etc.)
  DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,   // SubId: 1 (< file reading)
  DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10, // SubId: 1 (> file writing)
  IFS_INJECTION: 11,                         // SubId: 1 ($IFS manipulation)
  GIT_COMMIT_SUBSTITUTION: 12,               // SubId: 1 (injection in -m)
  PROC_ENVIRON_ACCESS: 13,                   // SubId: 1 (/proc/*/environ)
  MALFORMED_TOKEN_INJECTION: 14              // SubId: 1 (unbalanced delimiters)
};

// Mapping: eY→SECURITY_RISK_TYPES
```

### Risk Type Details

| Type | ID | SubIds | Attack Vector |
|------|-----|--------|---------------|
| INCOMPLETE_COMMANDS | 1 | 1-3 | Fragment injection (tab/flag/operator start) |
| JQ_SYSTEM_FUNCTION | 2 | 1 | Arbitrary command via jq system() |
| JQ_FILE_ARGUMENTS | 3 | 1 | File read via jq -f/--slurpfile |
| OBFUSCATED_FLAGS | 4 | 1-9 | Hidden flags via quoting ($'', $"", etc.) |
| SHELL_METACHARACTERS | 5 | 1-3 | Separator injection in quoted args |
| DANGEROUS_VARIABLES | 6 | 1 | Variable expansion in redirects/pipes |
| NEWLINES | 7 | 1 | Multi-command injection via newline |
| COMMAND_SUBSTITUTION | 8 | 1 | $(), ``, ${}, <(), >(), Zsh patterns |
| INPUT_REDIRECTION | 9 | 1 | Sensitive file reading via < |
| OUTPUT_REDIRECTION | 10 | 1 | Arbitrary file writing via > |
| IFS_INJECTION | 11 | 1 | Word separator manipulation |
| GIT_COMMIT_SUBSTITUTION | 12 | 1 | Command execution in commit -m |
| PROC_ENVIRON_ACCESS | 13 | 1 | Environment variable leakage |
| MALFORMED_TOKEN_INJECTION | 14 | 1 | Parsing confusion via unbalanced delimiters |

---

## Component 8: Security Checker Implementation

### Architecture: Two-Phase Validation

The security checker uses a two-phase approach with 14 checker functions:

```
Phase 1: Allow Checkers (5 functions) → Auto-approve safe commands
         ↓
Phase 2: Ask Checkers (9 functions) → Request user confirmation
         ↓
Result: passthrough | ask | deny
```

### Phase 1: Allow Checkers

These detect explicitly safe commands that bypass further checks:

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| checkEmptyCommand | Ti5 | Allow empty/whitespace commands |
| checkIncompleteCommand | Pi5 | Flag tab/flag/operator-starting fragments |
| checkHeredocInSubstitution | xi5 | Allow safe `$(cat <<'DELIM')` patterns |
| checkHeredocPatterns | vi5 | Allow `<<'DELIM'` and `<<\DELIM` |
| checkGitCommitMessage | yi5 | Allow safe `git commit -m 'msg'` |

### Phase 2: Ask Checkers

These detect high-risk patterns requiring user confirmation:

| Function | Obfuscated | Risk Type | Purpose |
|----------|------------|-----------|---------|
| checkJqDanger | ki5 | 2, 3 | jq system() and file flags |
| checkObfuscatedFlags | ci5 | 4 | Quoted/hidden flag names (9 sub-types) |
| checkShellMetacharacters | bi5 | 5 | Unquoted ;|& in arguments |
| checkDangerousVariables | fi5 | 6 | $VAR near redirects/pipes |
| checkNewlineInjection | gi5 | 7 | Multiline command injection |
| checkIfsInjection | ui5 | 11 | $IFS variable manipulation |
| checkProcEnvironAccess | mi5 | 13 | /proc/*/environ file access |
| checkDangerousSubstitution | hi5 | 8, 9, 10 | Backticks, $(), <, > patterns |
| checkMalformedTokens | di5 | 14 | Unbalanced delimiters with separators |

---

## Component 9: Helper Functions

### removeQuotes (Ri5)

**Location:** chunks.121.mjs:892-924

Strips quotes while tracking context, producing two outputs:

```javascript
// ============================================
// removeQuotes - Quote stripping with context tracking
// Location: chunks.121.mjs:892-924
// ============================================

// READABLE (for understanding):
function removeQuotes(command, preserveDoubleQuotes = false) {
  let withDoubleQuotes = "";  // Content with double quotes kept
  let fullyUnquoted = "";     // All quotes removed
  let inSingleQuotes = false;
  let inDoubleQuotes = false;
  let isEscaped = false;

  for (let i = 0; i < command.length; i++) {
    let char = command[i];

    // Handle escaped characters
    if (isEscaped) {
      isEscaped = false;
      if (!inSingleQuotes) withDoubleQuotes += char;
      if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
      continue;
    }

    // Mark escape
    if (char === "\\") {
      isEscaped = true;
      if (!inSingleQuotes) withDoubleQuotes += char;
      if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
      continue;
    }

    // Toggle quote modes
    if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      continue;
    }
    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
      if (!preserveDoubleQuotes) continue;
    }

    // Add character respecting quote modes
    if (!inSingleQuotes) withDoubleQuotes += char;
    if (!inSingleQuotes && !inDoubleQuotes) fullyUnquoted += char;
  }

  return { withDoubleQuotes, fullyUnquoted };
}

// Mapping: Ri5→removeQuotes, A→command, Q→preserveDoubleQuotes,
//          B→withDoubleQuotes, G→fullyUnquoted, Z→inSingleQuotes,
//          Y→inDoubleQuotes, J→isEscaped
```

**Key insight:** Single quotes prevent variable expansion in shell, double quotes allow it. By tracking both, checkers can detect dangerous variables only where they're expanded.

### isMalformedTokens (Oi5)

**Location:** chunks.121.mjs:874-890

Detects unbalanced brackets/quotes that could cause parsing ambiguity:

```javascript
// ============================================
// isMalformedTokens - Unbalanced delimiter detection
// Location: chunks.121.mjs:874-890
// ============================================

// READABLE (for understanding):
function isMalformedTokens(tokens) {
  for (let token of tokens) {
    if (typeof token !== "string") continue;

    // Count braces
    let openBraces = (token.match(/{/g) || []).length;
    let closeBraces = (token.match(/}/g) || []).length;
    if (openBraces !== closeBraces) return true;

    // Count parentheses
    let openParens = (token.match(/\(/g) || []).length;
    let closeParens = (token.match(/\)/g) || []).length;
    if (openParens !== closeParens) return true;

    // Count square brackets
    let openBrackets = (token.match(/\[/g) || []).length;
    let closeBrackets = (token.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) return true;

    // Count unescaped quotes (must be even)
    if ((token.match(/(?<!\\)"/g) || []).length % 2 !== 0) return true;
    if ((token.match(/(?<!\\)'/g) || []).length % 2 !== 0) return true;
  }
  return false;
}

// Mapping: Oi5→isMalformedTokens, A→tokens
```

### hasUnescapedChar (ji5)

**Location:** chunks.121.mjs:930-942

Finds unescaped occurrences of a specific character:

```javascript
// ============================================
// hasUnescapedChar - Find unescaped character
// Location: chunks.121.mjs:930-942
// ============================================

// READABLE (for understanding):
function hasUnescapedChar(text, character) {
  if (character.length !== 1) {
    throw Error("hasUnescapedChar only works with single characters");
  }

  let pos = 0;
  while (pos < text.length) {
    // Skip escaped pairs
    if (text[pos] === "\\" && pos + 1 < text.length) {
      pos += 2;
      continue;
    }
    if (text[pos] === character) return true;
    pos++;
  }
  return false;
}

// Mapping: ji5→hasUnescapedChar, A→text, Q→character, B→pos
```

### stripRedirectionNoise (_i5)

**Location:** chunks.121.mjs:926-928

Removes benign redirects from analysis:

```javascript
// ============================================
// stripRedirectionNoise - Remove harmless redirects
// Location: chunks.121.mjs:926-928
// ============================================

// READABLE (for understanding):
function stripRedirectionNoise(content) {
  content = content.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "");  // 2>&1
  content = content.replace(/[012]?\s*>\s*\/dev\/null/g, ""); // >/dev/null
  content = content.replace(/\s*<\s*\/dev\/null/g, "");      // </dev/null
  return content;
}

// Mapping: _i5→stripRedirectionNoise, A→content
```

---

## Component 10: Allow Checker Implementations

### checkEmptyCommand (Ti5)

```javascript
// ============================================
// checkEmptyCommand - Allow empty commands
// Location: chunks.121.mjs:944-959
// ============================================

// READABLE (for understanding):
function checkEmptyCommand(context) {
  if (!context.originalCommand.trim()) {
    return {
      behavior: "allow",
      updatedInput: { command: context.originalCommand },
      decisionReason: { type: "other", reason: "Empty command is safe" }
    };
  }
  return { behavior: "passthrough", message: "Command is not empty" };
}

// Mapping: Ti5→checkEmptyCommand, A→context
```

### checkIncompleteCommand (Pi5)

```javascript
// ============================================
// checkIncompleteCommand - Flag fragments
// Location: chunks.121.mjs:961-990
// ============================================

// READABLE (for understanding):
function checkIncompleteCommand(context) {
  let { originalCommand } = context;
  let trimmed = originalCommand.trim();

  // SubId 1: Tab-indented fragment
  if (/^\s*\t/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.INCOMPLETE_COMMANDS, subId: 1
    });
    return { behavior: "ask", message: "Command appears incomplete (starts with tab)" };
  }

  // SubId 2: Flag-only fragment
  if (trimmed.startsWith("-")) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.INCOMPLETE_COMMANDS, subId: 2
    });
    return { behavior: "ask", message: "Command appears incomplete (starts with flags)" };
  }

  // SubId 3: Operator-starting fragment
  if (/^\s*(&&|\|\||;|>>?|<)/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.INCOMPLETE_COMMANDS, subId: 3
    });
    return { behavior: "ask", message: "Command appears to be continuation (starts with operator)" };
  }

  return { behavior: "passthrough", message: "Command appears complete" };
}

// Mapping: Pi5→checkIncompleteCommand, A→context, Q→originalCommand, B→trimmed
```

### checkHeredocInSubstitution (xi5)

**Location:** chunks.121.mjs:1031-1053

Allows safe heredoc patterns within command substitution `$(cat <<'DELIM')`:

```javascript
// ============================================
// checkHeredocInSubstitution - Allow safe heredocs in $()
// Location: chunks.121.mjs:1031-1053
// ============================================

// ORIGINAL (for source lookup):
function xi5(A) {
  let { originalCommand: Q } = A;
  if (!Dq0.test(Q)) return {
    behavior: "passthrough",
    message: "No heredoc in substitution"
  };
  if (Si5(Q)) return {
    behavior: "allow",
    updatedInput: { command: Q },
    decisionReason: {
      type: "other",
      reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
    }
  };
  return {
    behavior: "passthrough",
    message: "Command substitution needs validation"
  }
}

// READABLE (for understanding):
function checkHeredocInSubstitution(context) {
  let { originalCommand } = context;

  // Early exit if no $(...<<) pattern
  if (!heredocSubstitutionPattern.test(originalCommand)) {
    return { behavior: "passthrough", message: "No heredoc in substitution" };
  }

  // Validate with safeHeredocValidator
  if (safeHeredocValidator(originalCommand)) {
    return {
      behavior: "allow",
      updatedInput: { command: originalCommand },
      decisionReason: {
        type: "other",
        reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
      }
    };
  }

  return { behavior: "passthrough", message: "Needs further validation" };
}

// Mapping: xi5→checkHeredocInSubstitution, A→context, Q→originalCommand,
//          Dq0→heredocSubstitutionPattern, Si5→safeHeredocValidator
```

### safeHeredocValidator (Si5)

**Location:** chunks.121.mjs:992-1029

Internal helper that validates safe heredoc patterns. A heredoc is considered "safe" when:
1. Uses quoted or escaped delimiters (`<<'DELIM'` or `<<\DELIM`)
2. Has complete structure (opening, content, closing)
3. Contains no other command/parameter substitutions after extracting heredocs

```javascript
// ============================================
// safeHeredocValidator - Validates safe heredoc patterns
// Location: chunks.121.mjs:992-1029
// ============================================

// ORIGINAL (for source lookup):
function Si5(A) {
  if (!Dq0.test(A)) return !1;
  let Q = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g,
    B, G = [];
  while ((B = Q.exec(A)) !== null) {
    let Y = B[1] || B[2];
    if (Y) G.push({
      start: B.index,
      delimiter: Y
    })
  }
  if (G.length === 0) return !1;
  for (let {
      start: Y,
      delimiter: J
    }
    of G) {
    let X = A.substring(Y),
      I = J.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`(?:\n|^[^\\n]*\n)${I}\\s*\\)`).test(X)) return !1;
    let W = new RegExp(`^\\$\\(cat\\s*<<-?\\s*(?:'+${I}'+|\\\\${I})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${I}\\s*\\)`);
    if (!X.match(W)) return !1
  }
  let Z = A;
  for (let {
      delimiter: Y
    }
    of G) {
    let J = Y.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      X = new RegExp(`\\$\\(cat\\s*<<-?\\s*(?:'+${J}'+|\\\\${J})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${J}\\s*\\)`);
    Z = Z.replace(X, "")
  }
  if (/\$\(/.test(Z)) return !1;
  if (/\${/.test(Z)) return !1;
  return !0
}

// READABLE (for understanding):
function safeHeredocValidator(commandString) {
  // Early exit: must contain $(...<<) pattern
  if (!heredocDetectionPattern.test(commandString)) return false;

  // Find all heredoc patterns: $(cat <<-?'DELIMITER' or $(cat <<-?\DELIMITER
  let heredocRegex = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g;
  let match, heredocs = [];

  while ((match = heredocRegex.exec(commandString)) !== null) {
    let delimiter = match[1] || match[2];
    if (delimiter) heredocs.push({ start: match.index, delimiter });
  }

  if (heredocs.length === 0) return false;

  // Validate each heredoc structure
  for (let { start, delimiter } of heredocs) {
    let substring = commandString.substring(start);
    let escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Check for closing delimiter on its own line followed by )
    if (!new RegExp(`(?:\n|^[^\n]*\n)${escapedDelimiter}\\s*\\)`).test(substring)) {
      return false;
    }

    // Match complete heredoc structure
    let completePattern = new RegExp(
      `^\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelimiter}'+|\\\\${escapedDelimiter})` +
      `[^\n]*\n(?:[\\s\\S]*?\n)?${escapedDelimiter}\\s*\\)`
    );
    if (!substring.match(completePattern)) return false;
  }

  // Remove all valid heredocs and check nothing dangerous remains
  let withoutHeredocs = commandString;
  for (let { delimiter } of heredocs) {
    let escapedDelim = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let heredocPattern = new RegExp(
      `\\$\\(cat\\s*<<-?\\s*(?:'+${escapedDelim}'+|\\\\${escapedDelim})` +
      `[^\n]*\n(?:[\\s\\S]*?\n)?${escapedDelim}\\s*\\)`
    );
    withoutHeredocs = withoutHeredocs.replace(heredocPattern, "");
  }

  // After removing heredocs, no other substitutions allowed
  if (/\$\(/.test(withoutHeredocs)) return false;  // No other command substitution
  if (/\${/.test(withoutHeredocs)) return false;   // No parameter substitution
  return true;
}

// Mapping: Si5→safeHeredocValidator, A→commandString, Q→heredocRegex, B→match,
//          G→heredocs, Y→start/delimiter, J→delimiter, X→substring,
//          I→escapedDelimiter, W→completePattern, Z→withoutHeredocs,
//          Dq0→heredocDetectionPattern
```

**Safe heredoc patterns:**
- `$(cat <<'EOF'\ntext\nEOF)` - Single-quoted delimiter prevents expansion
- `$(cat <<\EOF\ntext\nEOF)` - Escaped delimiter prevents expansion
- `$(cat <<-'EOF'\ntext\nEOF)` - With `-` for indented closing

**Unsafe patterns (rejected):**
- `$(cat <<EOF\n$VARIABLE\nEOF)` - Unquoted delimiter allows expansion
- `$(cat <<'EOF'\ntext\nEOF); rm -rf /` - Extra commands after heredoc

### checkGitCommitMessage (yi5)

```javascript
// ============================================
// checkGitCommitMessage - Validate git commit -m
// Location: chunks.121.mjs:1055-1100
// ============================================

// READABLE (for understanding):
function checkGitCommitMessage(context) {
  let { originalCommand, baseCommand } = context;

  if (baseCommand !== "git" || !/^git\s+commit\s+/.test(originalCommand)) {
    return { behavior: "passthrough", message: "Not a git commit" };
  }

  // Extract -m quoted message
  let match = originalCommand.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);

  if (match) {
    let [, quoteType, message, remainingFlags] = match;

    // Double-quoted with substitution = dangerous
    if (quoteType === '"' && message && /\$\(|`|\$\{/.test(message)) {
      telemetry("tengu_bash_security_check_triggered", {
        checkId: SECURITY_RISK_TYPES.GIT_COMMIT_SUBSTITUTION, subId: 1
      });
      return { behavior: "ask", message: "Git commit message contains command substitution" };
    }

    // Message starts with dash = flag confusion
    if (message && message.startsWith("-")) {
      telemetry("tengu_bash_security_check_triggered", {
        checkId: SECURITY_RISK_TYPES.OBFUSCATED_FLAGS, subId: 5
      });
      return { behavior: "ask", message: "Command contains quoted flag-like content" };
    }

    return {
      behavior: "allow",
      updatedInput: { command: originalCommand },
      decisionReason: { type: "other", reason: "Git commit with simple quoted message" }
    };
  }

  return { behavior: "passthrough", message: "Git commit needs validation" };
}

// Mapping: yi5→checkGitCommitMessage, A→context, Q→originalCommand, B→baseCommand
```

---

## Component 11: Ask Checker Implementations

### checkJqDanger (ki5)

```javascript
// ============================================
// checkJqDanger - jq system() and file access
// Location: chunks.121.mjs:1128-1156
// ============================================

// READABLE (for understanding):
function checkJqDanger(context) {
  let { originalCommand, baseCommand } = context;

  if (baseCommand !== "jq") {
    return { behavior: "passthrough", message: "Not jq" };
  }

  // jq system() function = arbitrary command execution
  if (/\bsystem\s*\(/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.JQ_SYSTEM_FUNCTION, subId: 1
    });
    return { behavior: "ask", message: "jq contains system() which executes commands" };
  }

  // File access flags: -f, --from-file, --rawfile, --slurpfile, -L
  let flags = originalCommand.substring(3).trim();
  if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(flags)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.JQ_FILE_ARGUMENTS, subId: 1
    });
    return { behavior: "ask", message: "jq contains file access flags" };
  }

  return { behavior: "passthrough", message: "jq command is safe" };
}

// Mapping: ki5→checkJqDanger, A→context, Q→originalCommand, B→baseCommand
```

### checkShellMetacharacters (bi5)

```javascript
// ============================================
// checkShellMetacharacters - ;|& in arguments
// Location: chunks.121.mjs:1158-1187
// ============================================

// READABLE (for understanding):
function checkShellMetacharacters(context) {
  let { unquotedContent } = context;

  // SubId 1: Generic quoted arg with metacharacters
  if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(unquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.SHELL_METACHARACTERS, subId: 1
    });
    return { behavior: "ask", message: "Command contains shell metacharacters in arguments" };
  }

  // SubId 2: find with -name/-path/-iname containing metacharacters
  let findPatterns = [
    /-name\s+["'][^"']*[;|&][^"']*["']/,
    /-path\s+["'][^"']*[;|&][^"']*["']/,
    /-iname\s+["'][^"']*[;|&][^"']*["']/
  ];
  if (findPatterns.some(p => p.test(unquotedContent))) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.SHELL_METACHARACTERS, subId: 2
    });
    return { behavior: "ask", message: "find command contains metacharacters" };
  }

  // SubId 3: find -regex with metacharacters
  if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(unquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.SHELL_METACHARACTERS, subId: 3
    });
    return { behavior: "ask", message: "find -regex contains metacharacters" };
  }

  return { behavior: "passthrough", message: "No metacharacters" };
}

// Mapping: bi5→checkShellMetacharacters, A→context, Q→unquotedContent
```

### checkDangerousVariables (fi5)

```javascript
// ============================================
// checkDangerousVariables - $VAR near redirects/pipes
// Location: chunks.121.mjs:1189-1204
// ============================================

// READABLE (for understanding):
function checkDangerousVariables(context) {
  let { fullyUnquotedContent } = context;

  // Pattern: < $VAR or > $VAR or | $VAR or $VAR < or $VAR > or $VAR |
  if (/[<>|]\s*\$[A-Za-z_]/.test(fullyUnquotedContent) ||
      /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(fullyUnquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.DANGEROUS_VARIABLES, subId: 1
    });
    return { behavior: "ask", message: "Variables in dangerous contexts (redirections/pipes)" };
  }

  return { behavior: "passthrough", message: "No dangerous variables" };
}

// Mapping: fi5→checkDangerousVariables, A→context, Q→fullyUnquotedContent
```

### checkNewlineInjection (gi5)

```javascript
// ============================================
// checkNewlineInjection - Multiline command injection
// Location: chunks.121.mjs:1247-1266
// ============================================

// READABLE (for understanding):
function checkNewlineInjection(context) {
  let { fullyUnquotedContent } = context;

  if (!/[\n\r]/.test(fullyUnquotedContent)) {
    return { behavior: "passthrough", message: "No newlines" };
  }

  // Newline followed by command char (a-z, A-Z, /, ., ~)
  if (/[\n\r]\s*[a-zA-Z/.~]/.test(fullyUnquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.NEWLINES, subId: 1
    });
    return { behavior: "ask", message: "Newlines could separate multiple commands" };
  }

  return { behavior: "passthrough", message: "Newlines appear to be within data" };
}

// Mapping: gi5→checkNewlineInjection, A→context, Q→fullyUnquotedContent
```

### checkIfsInjection (ui5)

```javascript
// ============================================
// checkIfsInjection - $IFS manipulation
// Location: chunks.121.mjs:1268-1283
// ============================================

// READABLE (for understanding):
function checkIfsInjection(context) {
  let { originalCommand } = context;

  if (/\$IFS|\$\{[^}]*IFS/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.IFS_INJECTION, subId: 1
    });
    return { behavior: "ask", message: "IFS variable could bypass security validation" };
  }

  return { behavior: "passthrough", message: "No IFS injection" };
}

// Mapping: ui5→checkIfsInjection, A→context, Q→originalCommand
```

### checkProcEnvironAccess (mi5)

```javascript
// ============================================
// checkProcEnvironAccess - /proc/*/environ
// Location: chunks.121.mjs:1285-1300
// ============================================

// READABLE (for understanding):
function checkProcEnvironAccess(context) {
  let { originalCommand } = context;

  if (/\/proc\/.*\/environ/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.PROC_ENVIRON_ACCESS, subId: 1
    });
    return { behavior: "ask", message: "/proc/*/environ could expose sensitive env vars" };
  }

  return { behavior: "passthrough", message: "No /proc/environ access" };
}

// Mapping: mi5→checkProcEnvironAccess, A→context, Q→originalCommand
```

### checkDangerousSubstitution (hi5)

```javascript
// ============================================
// checkDangerousSubstitution - Substitution and redirects
// Location: chunks.121.mjs:1206-1245
// ============================================

// READABLE (for understanding):
function checkDangerousSubstitution(context) {
  let { unquotedContent, fullyUnquotedContent } = context;

  // Backticks
  if (hasUnescapedChar(unquotedContent, "`")) {
    return { behavior: "ask", message: "Command contains backticks for substitution" };
  }

  // Dangerous patterns
  const dangerousPatterns = [
    { pattern: /<\(/, message: "process substitution <()" },
    { pattern: />\(/, message: "process substitution >()" },
    { pattern: /\$\(/, message: "$() command substitution" },
    { pattern: /\$\{/, message: "${} parameter substitution" },
    { pattern: /~\[/, message: "Zsh-style parameter expansion" },
    { pattern: /\(e:/, message: "Zsh-style glob qualifiers" },
    { pattern: /<#/, message: "PowerShell comment syntax" }
  ];

  for (let { pattern, message } of dangerousPatterns) {
    if (pattern.test(unquotedContent)) {
      telemetry("tengu_bash_security_check_triggered", {
        checkId: SECURITY_RISK_TYPES.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION, subId: 1
      });
      return { behavior: "ask", message: `Command contains ${message}` };
    }
  }

  // Input redirection
  if (/</.test(fullyUnquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.DANGEROUS_PATTERNS_INPUT_REDIRECTION, subId: 1
    });
    return { behavior: "ask", message: "Input redirection could read sensitive files" };
  }

  // Output redirection
  if (/>/.test(fullyUnquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION, subId: 1
    });
    return { behavior: "ask", message: "Output redirection could write to files" };
  }

  return { behavior: "passthrough", message: "No dangerous patterns" };
}

// Mapping: hi5→checkDangerousSubstitution, A→context, Q→unquotedContent,
//          B→fullyUnquotedContent, Mi5→dangerousPatterns
```

### checkMalformedTokens (di5)

```javascript
// ============================================
// checkMalformedTokens - Unbalanced delimiters with separators
// Location: chunks.121.mjs:1302-1326
// ============================================

// READABLE (for understanding):
function checkMalformedTokens(context) {
  let { originalCommand } = context;

  let parseResult = parseShellCommand(originalCommand);
  if (!parseResult.success) {
    return { behavior: "passthrough", message: "Parse failed, handled elsewhere" };
  }

  let tokens = parseResult.tokens;

  // Check for separators (;, &&, ||)
  if (!tokens.some(t => typeof t === "object" && t !== null && "op" in t &&
      (t.op === ";" || t.op === "&&" || t.op === "||"))) {
    return { behavior: "passthrough", message: "No command separators" };
  }

  // Check for unbalanced tokens
  if (isMalformedTokens(tokens)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: SECURITY_RISK_TYPES.MALFORMED_TOKEN_INJECTION, subId: 1
    });
    return { behavior: "ask", message: "Ambiguous syntax with separators" };
  }

  return { behavior: "passthrough", message: "No malformed token injection" };
}

// Mapping: di5→checkMalformedTokens, A→context, Q→originalCommand,
//          bY→parseShellCommand, Oi5→isMalformedTokens
```

### checkObfuscatedFlags (ci5)

**Location:** chunks.121.mjs:1328-1444

This is the most complex checker with 9 sub-types of flag obfuscation:

| SubId | Pattern | Description |
|-------|---------|-------------|
| 1 | Complex quote parsing in flags | Manual state-tracked detection of hidden quotes |
| 2 | Space + quote + dash | Simplified pattern on unquoted content |
| 3 | Multiple consecutive quotes + dash | Quote concatenation bypass `''--` |
| 4 | Encapsulated quoted flags | `'--option'` pattern |
| 5 | ANSI-C quoting | `$'...'` escape sequences |
| 6 | Locale quoting | `$"..."` translation strings |
| 7 | Empty regular quotes | `'' -` or `"" -` before dash |
| 9 | Empty special quotes | `$'' -` or `$"" -` before dash |

```javascript
// ============================================
// checkObfuscatedFlags - Detects 9 types of obfuscation in shell command flags
// Location: chunks.121.mjs:1328-1444
// ============================================

// ORIGINAL (for source lookup):
function ci5(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A, G = /[|&;]/.test(Q);
  if (B === "echo" && !G) return {
    behavior: "passthrough",
    message: "echo command is safe and has no dangerous flags"
  };
  if (/\$'[^']*'/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 5
  }), {
    behavior: "ask",
    message: "Command contains ANSI-C quoting which can hide characters"
  };
  if (/\$"[^"]*"/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 6
  }), {
    behavior: "ask",
    message: "Command contains locale quoting which can hide characters"
  };
  if (/\$['"]{2}\s*-/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 9
  }), {
    behavior: "ask",
    message: "Command contains empty special quotes before dash (potential bypass)"
  };
  if (/(?:^|\s)(?:''|"")+\s*-/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 7
  }), {
    behavior: "ask",
    message: "Command contains empty quotes before dash (potential bypass)"
  };
  let Z = !1,
    Y = !1,
    J = !1;
  for (let X = 0; X < Q.length - 1; X++) {
    let I = Q[X],
      D = Q[X + 1];
    if (J) {
      J = !1;
      continue
    }
    if (I === "\\") {
      J = !0;
      continue
    }
    if (I === "'" && !Y) {
      Z = !Z;
      continue
    }
    if (I === '"' && !Z) {
      Y = !Y;
      continue
    }
    if (Z || Y) continue;
    if (I && D && /\s/.test(I) && /['"`]/.test(D)) {
      let W = D,
        K = X + 2,
        V = "";
      while (K < Q.length && Q[K] !== W) V += Q[K], K++;
      if (K < Q.length && Q[K] === W && V.startsWith("-")) return l("tengu_bash_security_check_triggered", {
        checkId: eY.OBFUSCATED_FLAGS,
        subId: 4
      }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
      }
    }
    if (I && D && /\s/.test(I) && D === "-") {
      let W = X + 1,
        K = "";
      while (W < Q.length) {
        let V = Q[W];
        if (!V) break;
        if (/[\s=]/.test(V)) break;
        if (/['"`]/.test(V)) {
          if (B === "cut" && K === "-d" && /['"`]/.test(V)) break;
          if (W + 1 < Q.length) {
            let F = Q[W + 1];
            if (F && !/[a-zA-Z0-9_'"-]/.test(F)) break
          }
        }
        K += V, W++
      }
      if (K.includes('"') || K.includes("'")) return l("tengu_bash_security_check_triggered", {
        checkId: eY.OBFUSCATED_FLAGS,
        subId: 1
      }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
      }
    }
  }
  if (/\s['"`]-/.test(A.fullyUnquotedContent)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command contains quoted characters in flag names"
  };
  if (/['"`]{2}-/.test(A.fullyUnquotedContent)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command contains quoted characters in flag names"
  };
  return {
    behavior: "passthrough",
    message: "No obfuscated flags detected"
  }
}

// READABLE (for understanding):
function checkObfuscatedFlags(context) {
  let { originalCommand, baseCommand } = context;
  let hasMetachars = /[|&;]/.test(originalCommand);

  // Special case: echo without pipes/separators is safe
  if (baseCommand === "echo" && !hasMetachars) {
    return { behavior: "passthrough", message: "echo command is safe" };
  }

  // Check 5: ANSI-C Quoting ($'...')
  if (/\$'[^']*'/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 5
    });
    return { behavior: "ask", message: "ANSI-C quoting can hide characters" };
  }

  // Check 6: Locale Quoting ($"...")
  if (/\$"[^"]*"/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 6
    });
    return { behavior: "ask", message: "Locale quoting can hide characters" };
  }

  // Check 9: Empty Special Quotes Before Dash ($'' or $"" + -)
  if (/\$['"]{2}\s*-/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 9
    });
    return { behavior: "ask", message: "Empty special quotes before dash" };
  }

  // Check 7: Empty Quotes Before Dash ('' or "" + -)
  if (/(?:^|\s)(?:''|"")+\s*-/.test(originalCommand)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 7
    });
    return { behavior: "ask", message: "Empty quotes before dash" };
  }

  // State tracking for manual quote parsing
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let isEscaped = false;

  // Character-by-character parsing for complex obfuscation
  for (let i = 0; i < originalCommand.length - 1; i++) {
    let currentChar = originalCommand[i];
    let nextChar = originalCommand[i + 1];

    // Handle escape sequences
    if (isEscaped) { isEscaped = false; continue; }
    if (currentChar === "\\") { isEscaped = true; continue; }

    // Toggle quote states
    if (currentChar === "'" && !inDoubleQuote) { inSingleQuote = !inSingleQuote; continue; }
    if (currentChar === '"' && !inSingleQuote) { inDoubleQuote = !inDoubleQuote; continue; }

    // Skip inside quotes
    if (inSingleQuote || inDoubleQuote) continue;

    // Check 4: Encapsulated quoted flags (space + quote + content starting with -)
    if (/\s/.test(currentChar) && /['"`]/.test(nextChar)) {
      let quoteChar = nextChar;
      let searchIdx = i + 2;
      let quotedContent = "";
      while (searchIdx < originalCommand.length && originalCommand[searchIdx] !== quoteChar) {
        quotedContent += originalCommand[searchIdx];
        searchIdx++;
      }
      if (searchIdx < originalCommand.length && quotedContent.startsWith("-")) {
        telemetry("tengu_bash_security_check_triggered", {
          checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 4
        });
        return { behavior: "ask", message: "Quoted flag names" };
      }
    }

    // Check 1: Quotes embedded in flag names (space + - + content with quotes)
    if (/\s/.test(currentChar) && nextChar === "-") {
      let flagIdx = i + 1;
      let flagContent = "";
      while (flagIdx < originalCommand.length) {
        let char = originalCommand[flagIdx];
        if (!char || /[\s=]/.test(char)) break;
        if (/['"`]/.test(char)) {
          // Special: cut -d'x' is valid
          if (baseCommand === "cut" && flagContent === "-d") break;
        }
        flagContent += char;
        flagIdx++;
      }
      if (flagContent.includes('"') || flagContent.includes("'")) {
        telemetry("tengu_bash_security_check_triggered", {
          checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 1
        });
        return { behavior: "ask", message: "Quoted characters in flag names" };
      }
    }
  }

  // Check 2: Simplified quote-dash pattern on unquoted content
  if (/\s['"`]-/.test(context.fullyUnquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 2
    });
    return { behavior: "ask", message: "Quoted flag prefix" };
  }

  // Check 3: Multiple consecutive quotes before dash
  if (/['"`]{2}-/.test(context.fullyUnquotedContent)) {
    telemetry("tengu_bash_security_check_triggered", {
      checkId: CHECK_ID.OBFUSCATED_FLAGS, subId: 3
    });
    return { behavior: "ask", message: "Quote concatenation bypass" };
  }

  return { behavior: "passthrough", message: "No obfuscated flags detected" };
}

// Mapping: ci5→checkObfuscatedFlags, A→context, Q→originalCommand, B→baseCommand,
//          G→hasMetachars, Z→inSingleQuote, Y→inDoubleQuote, J→isEscaped,
//          X→i, I→currentChar, D→nextChar, W→quoteChar/flagIdx, K→searchIdx/flagContent,
//          V→quotedContent/char, l→telemetry, eY→CHECK_ID
```

**Algorithm summary:**
1. Early exit for `echo` without metacharacters (safe)
2. Quick regex checks for known obfuscation patterns (SubIDs 5, 6, 7, 9)
3. Character-by-character parsing with quote state tracking (SubIDs 1, 4)
4. Simplified pattern checks on pre-processed content (SubIDs 2, 3)

**Special handling:**
- `cut -d'x'` is explicitly allowed (valid delimiter syntax)
- `echo` bypasses all checks if no pipes/separators present

---

## Component 12: Main Orchestrator

### shellOperatorChecker (Mf)

**Location:** chunks.121.mjs:1446-1476

The main entry point that coordinates all security checks:

```javascript
// ============================================
// shellOperatorChecker - Main security orchestrator
// Location: chunks.121.mjs:1446-1476
// ============================================

// READABLE (for understanding):
function shellOperatorChecker(command) {
  // Extract base command (first word)
  let baseCommand = command.split(" ")[0] || "";

  // Strip quotes (preserve double quotes for jq)
  let { withDoubleQuotes, fullyUnquoted } = removeQuotes(
    command, baseCommand === "jq"
  );

  // Build context
  let context = {
    originalCommand: command,
    baseCommand: baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: stripRedirectionNoise(fullyUnquoted)
  };

  // PHASE 1: Allow Checkers
  let allowCheckers = [Ti5, Pi5, xi5, vi5, yi5];
  for (let checker of allowCheckers) {
    let result = checker(context);
    if (result.behavior === "allow") {
      return { behavior: "passthrough", message: result.decisionReason?.reason || "Allowed" };
    }
    if (result.behavior !== "passthrough") return result;
  }

  // PHASE 2: Ask Checkers
  let askCheckers = [ki5, ci5, bi5, fi5, gi5, ui5, mi5, hi5, di5];
  for (let checker of askCheckers) {
    let result = checker(context);
    if (result.behavior === "ask") return result;
  }

  return { behavior: "passthrough", message: "Passed all security checks" };
}

// Mapping: Mf→shellOperatorChecker, A→command, Q→baseCommand,
//          B→withDoubleQuotes, G→fullyUnquoted, Z→context
```

**Execution flow:**

```
Command Input
    │
    ├─1→ Extract baseCommand (first word)
    │
    ├─2→ removeQuotes() → {withDoubleQuotes, fullyUnquoted}
    │
    ├─3→ stripRedirectionNoise() on fullyUnquoted
    │
    ├─4→ Build context object
    │
    ├─5→ Phase 1: Allow Checkers
    │    ├─ Ti5: Empty?
    │    ├─ Pi5: Incomplete?
    │    ├─ xi5: Safe heredoc in $()?
    │    ├─ vi5: Safe heredoc?
    │    └─ yi5: Safe git commit?
    │    (If "allow" → PASSTHROUGH, If "ask" → ASK)
    │
    ├─6→ Phase 2: Ask Checkers
    │    ├─ ki5: jq danger?
    │    ├─ ci5: obfuscated flags?
    │    ├─ bi5: metacharacters?
    │    ├─ fi5: dangerous variables?
    │    ├─ gi5: newlines?
    │    ├─ ui5: IFS?
    │    ├─ mi5: /proc/environ?
    │    ├─ hi5: substitution?
    │    └─ di5: malformed tokens?
    │    (If "ask" → ASK USER)
    │
    └─7→ All passed → PASSTHROUGH
```

---

## Key Files

| File | Content | Key Symbols |
|------|---------|-------------|
| chunks.20.mjs:2044-2057 | bY shell-parse wrapper | bY, kGA |
| chunks.112.mjs:53-64 | CWD reset detection | Fb5, UT2 |
| chunks.121.mjs:874-1476 | Security analysis (complete) | Mf, Ti5-di5, Ri5, Oi5, ji5, _i5 |
| chunks.123.mjs:695-841 | Tree-sitter parser, command classes | cK1, mm2, um2 |
| chunks.123.mjs:904-934 | Pipe permission checker | cm2, vn5 |
| chunks.147.mjs:765-957 | Tokenization, redirection extraction | ZfA, Hx |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `tokenizeCommand` (ZfA) - Tokenizes commands preserving shell semantics
- `bYParser` (bY) - Shell-parse library wrapper with error handling
- `shellCommandParser` (cK1) - Tree-sitter parser with tokenization fallback
- `RichCommand` (mm2) - Accurate pipe/redirection extraction (tree-sitter)
- `SimpleCommand` (um2) - Fallback tokenization-based parsing
- `extractOutputRedirections` (Hx) - Redirection detection and removal
- `shellOperatorChecker` (Mf) - Multi-layer security analysis
- `pipePermissionChecker` (cm2) - Per-segment validation of piped commands
- `extractCwdReset` (Fb5) - Working directory change detection

---

## See Also

- [../05_tools/](../05_tools/) - Tool system
- [../18_sandbox/](../18_sandbox/) - Permission and sandbox
