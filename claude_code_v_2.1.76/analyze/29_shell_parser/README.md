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
| [implementation.md](./implementation.md) | Complete implementation reference with code snippets | 68KB |
| [heredoc_security.md](./heredoc_security.md) | Heredoc injection prevention and security pipeline | 33KB |
| [command_validation.md](./command_validation.md) | Security architecture overview | 9KB |
| [integration_overview.md](./integration_overview.md) | Integration with Tools, Reminder, Compact, Skills | NEW |

---

## Quick Reference

### Key Entry Points

| Function | Symbol | Location | Purpose |
|----------|--------|----------|---------|
| `runSecurityChecks` | lm | chunks.150.mjs:321 | Main security validation pipeline |
| `bashPreFlightCheck` | AYz | chunks.169.mjs:1838 | LLM-based prefix extraction |
| `checkReadOnlyBehavior` | Of6 | chunks.150.mjs:881 | Read-only permission gate |
| `parseShellCommand` | rZ1 | chunks.169.mjs:1716 | Full tokenizer with heredoc safety |
| `extractHeredocs` | XT6 | chunks.169.mjs:1596 | Heredoc extraction and replacement |

### Security Pipeline Flow

```
Bash tool call
     │
     ▼
┌─────────────────────────────┐
│ Layer 1: Static Checks      │
│ runSecurityChecks (lm)      │
│                             │
│ Allow: empty, heredoc,      │
│        git commit           │
│ Deny:  jq, ANSI-C, $(),    │
│        IFS, /proc, etc.     │
└─────────────┬───────────────┘
              │ "passthrough"
              ▼
┌─────────────────────────────┐
│ Layer 2: LLM Prefix         │
│ bashPreFlightCheck (AYz)    │
│                             │
│ → "git commit"              │
│ → "command_injection"       │
│ → "none" (no prefix)        │
└─────────────┬───────────────┘
              │ prefix
              ▼
┌─────────────────────────────┐
│ Layer 3: Read-Only Check    │
│ checkReadOnlyBehavior (Of6) │
│                             │
│ Uses safe command registry  │
│ + per-subcommand analysis   │
└─────────────────────────────┘
```

---

## Source Files

| File | Content |
|------|---------|
| `chunks.169.mjs` | Shell tokenizer, heredoc extraction, prefix extraction |
| `chunks.149.mjs` | Allow-list security checks (ndY, rdY, adY, tdY, sdY) |
| `chunks.150.mjs` | Deny-list checks, safe registry, read-only validation |
| `chunks.170.mjs` | Command reconstruction |
| `chunks.10.mjs` | Pre-check (hasSingleQuotedBackslashBypass) |

---

## Symbol Index Reference

> Full symbol mappings: [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Shell Parser section

### Tokenization & Parsing

- `parseShellCommand` (rZ1) - Full tokenizer with heredoc safety
- `extractSubcommands` (AD) - Split compound command into subcommands
- `extractHeredocs` (XT6) - Extract and replace heredoc blocks

### Security Pipeline

- `runSecurityChecks` (lm) - Master security validation
- `bashPreFlightCheck` (AYz) - LLM prefix extraction
- `checkReadOnlyBehavior` (Of6) - Read-only permission gate

### Allow-List Checks (chunks.149.mjs)

- `checkEmptyCommand` (ndY)
- `checkIncompleteCommand` (rdY)
- `checkHeredocInSubstitution` (adY)
- `checkQuotedHeredoc` (tdY)
- `checkGitCommitMessage` (sdY)

### Deny-List Checks (chunks.150.mjs)

- `checkJqCommand` (edY) - jq system() detection
- `checkObfuscatedFlags` ($cY) - ANSI-C quoting detection
- `checkShellMetacharacters` (AcY) - Pipe/semicolon injection
- `checkDangerousVariables` (qcY) - Variable in redirections
- `checkDangerousPatterns` (KcY) - Backticks, $(), ${}, <()
- `checkNewlines` (YcY) - Newline command separators
- `checkIFSInjection` (zcY) - IFS manipulation
- `checkProcEnviron` (wcY) - /proc/environ access
- `checkMalformedTokenInjection` (HcY) - Tokenizer-based detection

### Safe Command Registry

- `isInSafeCommandRegistry` (WcY) - Check against whitelist
- `isReadOnlyCommand` (NcY) - Read-only command detection
- `SAFE_COMMAND_REGISTRY` (jcY) - Command→flags map
- `SAFE_COMMAND_PATTERNS` (fcY) - Regex patterns for safe commands

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