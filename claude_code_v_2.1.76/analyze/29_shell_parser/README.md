# Shell Parser Module (29_shell_parser)

> Shell command parsing, security validation, heredoc handling, and read-only command detection for Claude Code v2.1.76

---

## Module Overview

The Shell Parser module is a critical security component that intercepts all Bash tool calls to perform multi-layer security analysis before any command executes on the host system.

### Core Responsibilities

1. **Security Validation**: Multi-layer checks to detect injection attacks and unsafe patterns
2. **Heredoc Handling**: Safe extraction and restoration of heredoc content
3. **Prefix Extraction**: LLM-based command prefix extraction for permission matching
4. **Read-Only Detection**: Automatic approval of safe read-only commands
5. **Command Tokenization**: Full shell parsing with quote and escape handling

---

## Documents in This Module

| Document | Description | Size |
|----------|-------------|------|
| [implementation.md](./implementation.md) | Complete implementation reference with code snippets, deep analysis of heredoc extraction, security pipeline order, redirection analysis, and LLM prefix extraction | ~85KB |
| [heredoc_security.md](./heredoc_security.md) | Heredoc injection prevention, complete source restoration of extractHeredocs, state machine for quote/comment tracking, security implications | ~45KB |
| [command_validation.md](./command_validation.md) | Security architecture overview | 9KB |
| [integration_overview.md](./integration_overview.md) | Integration with Tools, Reminder, Compact, Skills. Deep analysis of progress throttling and checkBashPermissions flow | ~35KB |

### Key Deep Analysis Sections

- **[Heredoc Extraction Algorithm](./implementation.md#deep-analysis-heredoc-extraction-algorithm)** — Complete source restoration with state machine
- **[Security Check Pipeline Order](./implementation.md#deep-analysis-security-check-pipeline-order)** — Why allow-list runs before deny-list
- **[Redirection Analysis Deep Dive](./implementation.md#redirection-analysis-deep-dive)** — Complete decision tree for dangerous redirections
- **[LLM Prefix Extraction Policy](./implementation.md#deep-analysis-llm-prefix-extraction-policy)** — Full policy spec and response handling
- **[Progress Throttling Mechanism](./integration_overview.md#deep-analysis-progress-throttling-mechanism)** — Why remote-only, LRU cache strategy
- **[checkBashPermissions Flow](./integration_overview.md#deep-analysis-checkbashpermissions-flow)** — Complete decision tree

---

## Quick Reference

### Key Entry Points

| Function | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| `runSecurityChecksSync` | Rp6 | chunks.91.mjs:2209 | Main security validation pipeline (sync, no tree-sitter) |
| `runSecurityChecksAsync` | O01 | chunks.91.mjs:2272 | Main security validation pipeline (async, with tree-sitter) |
| `bashPreFlightCheck` | nGq | chunks.171.mjs:1750 | LLM-based prefix extraction (via QGq factory) |
| `extractPrefixCached` | pr6 | chunks.171.mjs:1758 | Memoized prefix extraction wrapper (via UGq factory) |
| `checkBashPermissions` | Tn8 | chunks.172.mjs:1930 | Main Bash tool permission checker (async) |
| `parseShellCommand` | bW6 | chunks.171.mjs:1139 | Full tokenizer with heredoc safety |
| `extractHeredocs` | ca | chunks.56.mjs:945 | Heredoc extraction and replacement |
| `extractSubcommands` | EO | chunks.171.mjs | Split compound commands |

### Security Pipeline Flow

```
Bash tool call
     │
     ▼
┌─────────────────────────────┐
│ Layer 1: Static Checks      │
│ (Rp6/O01)                   │
│                             │
│ Allow: empty, heredoc,      │
│        git commit           │
│ Deny:  jq, ANSI-C, $(),    │
│        IFS, /proc, etc.     │
│        (23 security checks) │
└─────────────┬───────────────┘
              │ "passthrough"
              ▼
┌─────────────────────────────┐
│ Layer 2: LLM Prefix         │
│ bashPreFlightCheck (nGq)    │
│                             │
│ → "git commit"              │
│ → "command_injection"       │
│ → "none" (no prefix)        │
└─────────────┬───────────────┘
              │ prefix
              ▼
┌─────────────────────────────┐
│ Layer 3: Permission Check   │
│ checkBashPermissions (Tn8)  │
│                             │
│ Subcommand analysis +       │
│ permission matching         │
└─────────────────────────────┘
```

---

## Source Files

| File | Content |
|------|---------|
| `chunks.91.mjs` | Security pipeline: runSecurityChecksSync (Rp6), runSecurityChecksAsync (O01), all 19 deny-list check functions, SECURITY_CHECK_IDS (w3), DANGEROUS_PATTERNS (wg9), ZSH_DANGEROUS_COMMANDS (Og9) |
| `chunks.171.mjs` | Shell tokenizer (bW6), extractSubcommands (EO), prefix extraction (nGq, pr6) |
| `chunks.56.mjs` | extractHeredocs (ca) |
| `chunks.172.mjs` | Permission checking integration (Tn8), prefix matching |
| `chunks.42.mjs` | Pre-check (hasSingleQuotedBackslashBypass / X38) |

---

## Symbol Index Reference

> Full symbol mappings: [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Shell Parser section

### Tokenization & Parsing

- `parseShellCommand` (bW6) - Full tokenizer with heredoc safety
- `extractSubcommands` (EO) - Split compound command into subcommands
- `extractHeredocs` (ca) - Extract and replace heredoc blocks

### Security Pipeline

- `runSecurityChecks` (zg9) - Master security validation (async)
- `bashPreFlightCheck` (nGq) - LLM prefix extraction
- `checkBashPermissions` (Tn8) - Main Bash tool permission checker (async)

### Allow-List Checks (chunks.91.mjs)

- `checkEmptyCommand` (uY4)
- `checkIncompleteCommand` (mY4)
- `checkHeredocInSubstitution` (gY4)
- `isQuotedHeredocInSubstitution` (Hg9)
- `checkGitCommitMessage` (FY4)

### Deny-List Checks (chunks.91.mjs)

- `checkJqCommand` (pY4) - jq system() detection
- `checkObfuscatedFlags` (rY4) - ANSI-C quoting detection
- `checkShellMetacharacters` (QY4) - Pipe/semicolon injection
- `checkDangerousVariables` (UY4) - Variable in redirections
- `checkDangerousPatterns` (dY4) - Backticks, $(), ${}, <()
- `checkNewlines` (w01) - Newline command separators
- `checkIFSInjection` (lY4) - IFS manipulation
- `checkProcEnviron` (iY4) - /proc/environ access
- `checkMalformedTokenInjection` (nY4) - Tokenizer-based detection
- `checkBackslashEscapedWhitespace` (oY4) - Backslash before space/tab
- `checkBraceExpansion` (sY4) - {a,b} or {1..3} patterns
- `checkUnicodeWhitespace` (tY4) - Non-ASCII whitespace
- `checkMidWordHash` (eY4) - # in middle of word
- `checkZshDangerousCommands` (Kz4) - zmodload, emulate, sysopen
- `checkBackslashEscapedOperators` (aY4) - \;, \|, \&, \<, \>
- `checkCommentQuoteDesync` (Az4) - Quote inside # comment
- `checkQuotedNewline` (qz4) - Quoted newline + # pattern
- `checkExcessClosingBraces` (cY4) - Unbalanced braces after quote strip

---

## Integration with Other Modules

| Module | Integration Point |
|--------|-------------------|
| [05_tools](../05_tools/) | Bash tool uses shell parser for security validation |
| [04_system_reminder](../04_system_reminder/) | Progress attachments from bash commands |
| [07_compact](../07_compact/) | Command extraction for summarization |
| [09_slash_command](../09_slash_command/) | Skills use Bash tool which uses shell parser |

See [integration_overview.md](./integration_overview.md) for detailed integration analysis.

---

## Security Design Principles

1. **Allow-list before deny-list**: Common safe patterns bypass expensive checks
2. **Two-phase pipeline**: Fast static checks + LLM semantic analysis
3. **Heredoc placeholder extraction**: Prevents content from triggering false positives
4. **Random hex in placeholders**: Prevents collision with actual command content
5. **Defense in depth**: Static checks + LLM injection detection + read-only whitelist

---

## Related Documents

- [Bash Tool Analysis](../05_tools/bash_tool.md) - Complete Bash tool documentation
- [Tool-Reminder Integration](../05_tools/tool_reminder_integration.md) - Attachment creation flow
- [Symbol Index - Integrations](../00_overview/symbol_index_infra_integration.md) - Full symbol mappings