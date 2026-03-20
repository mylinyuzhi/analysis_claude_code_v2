# Shell Parser: Command Validation & Security Overview

## Module Overview

The Shell Parser module in Claude Code v2.1.76 is a critical security component. It intercepts
all `Bash` tool calls to perform multi-layer security analysis before any command executes on the
host system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell Parser section)

Key functions in this document:
- `runSecurityChecksSync` (Rp6) - Security pipeline entry point (sync, no tree-sitter)
- `runSecurityChecksAsync` (O01) - Security pipeline entry point (async, with tree-sitter)
- `bashPreFlightCheck` (nGq) - LLM-based command prefix extraction (via QGq factory)
- `extractPrefixCached` (pr6) - Memoized prefix extraction wrapper (via UGq factory)
- `checkBashPermissions` (Tn8) - Main Bash tool permission checker
- `extractRedirections` (aI) - Redirection tokenization and analysis
- `checkDangerousRedirection` (YYz) - Per-redirection risk classification

> For full implementation details, see [implementation.md](./implementation.md)
> For heredoc and security pipeline deep dive, see [heredoc_security.md](./heredoc_security.md)

---

## Security Architecture: Three Layers

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
│ Uses prefix matching +      │
│ subcommand analysis         │
└─────────────────────────────┘
```

---

## Layer 1: Static Security Checks

### Entry Point (zg9 / runSecurityChecks)

**What it does:** Uses a combination of allow-list and deny-list checks to classify the risk of a shell command. Returns `"passthrough"` (safe to proceed), `"allow"` (explicitly safe), or `"ask"` (needs user confirmation).

**Pre-check:** Before anything else, `CY8` (`hasSingleQuotedBackslashBypass`) detects the `'a\'` pattern that can confuse quote-state tracking in downstream security checks.

**Phase A — Allow-list (run first):**
These checks can short-circuit the pipeline by explicitly allowing a command:

| Check | Function | When Allowed |
|-------|----------|--------------|
| Empty command | uY4 | Command is empty/whitespace |
| Heredoc in `$()` | gY4 | `$(cat <<'EOF' ... EOF)` with quoted delimiter |
| Git commit message | FY4 | `git commit -m "simple message"` |

**Phase B — Deny-list (run after allow-list):**
These checks can flag a command as needing user approval:

| Check | Function | What It Catches |
|-------|----------|----------------|
| jq dangerous ops | pY4 | `system()` function, file-reading flags |
| Obfuscated flags | rY4 | ANSI-C quoting, locale quoting, quoted flag names |
| Shell metacharacters | QY4 | `;`, `\|`, `&` inside quoted arguments |
| Dangerous variables | UY4 | `$VAR` in redirection/pipe context |
| Newlines | w01 | Embedded newlines as command separators |
| IFS injection | lY4 | `$IFS` manipulation |
| /proc/environ | iY4 | Process environment exposure |
| Dangerous patterns | dY4 | Backticks, `$()`, `${}`, `<()`, `>()` |
| Redirections | _01 | `<` and `>` in unquoted content |
| Malformed tokens | nY4 | Unbalanced brackets with separators |
| Backslash whitespace | oY4 | `\` before space/tab |
| Brace expansion | sY4 | `{a,b}` or `{1..3}` patterns |
| Control characters | Rp6/Yz4 | Non-printable control chars |
| Unicode whitespace | tY4 | Non-ASCII whitespace characters |
| Mid-word hash | eY4 | `#` in middle of word |
| Zsh dangerous cmds | Kz4 | zmodload, emulate, sysopen, etc. |
| Backslash operators | aY4 | `\;`, `\|`, `\&`, `\<`, `\>` |
| Comment quote desync | Az4 | Quote inside `#` comment |
| Quoted newline | qz4 | Quoted newline + `#` pattern |

---

## Layer 2: LLM Prefix Extraction (bashPreFlightCheck / nGq)

**What it does:** Uses a fast LLM to extract the "command prefix" — the meaningful first part of the command that identifies what operation is being performed. Used for permission matching.

**How it works:**
1. **Quick bypass**: If the command is a simple `--help` request, skip the LLM call
2. **Parse subcommands**: Extract compound commands for per-subcommand analysis
3. **Call LLM**: Send command with a `<policy_spec>` that includes many extraction examples
4. **Parse response**: LLM returns one of:
   - A prefix string (e.g., `"git commit"`, `"grep"`) → match against user's allowed list
   - `"none"` → command has no meaningful prefix (e.g., `npm test`)
   - `"command_injection_detected"` → LLM detected injection → force user approval
   - `"git"` alone → rejected as too broad (must be specific subcommand)

**Memoization:** Results are cached via `extractPrefixCached` (pr6) wrapper to avoid redundant LLM calls.
```
- cat foo.txt                => cat
- git diff HEAD~1            => git diff
- git diff $(cat secrets...) => command_injection_detected
- git status`ls`             => command_injection_detected
- git push                   => none
- npm test                   => none
- GOEXPERIMENT=synctest go test -v ./... => GOEXPERIMENT=synctest go test
- FOO=BAR go test            => FOO=BAR go test
- pwd\ncurl example.com      => command_injection_detected
```

**Why LLM instead of regex?** Shell command syntax is too complex for reliable static parsing:
- Environment variable prefixes: `GOEXPERIMENT=synctest go test` → prefix includes the env var
- Nested tool names: `gg cat foo.py` → prefix is `gg cat` (not just `gg`)
- `npm run lint -- "foo"` → prefix is `npm run lint` (not `npm`)

**Performance:** A 10-second warning fires if the check takes too long. Results are cached by command string to avoid redundant LLM calls.

---

## Layer 3: Permission Check (checkBashPermissions / Tn8)

**What it does:** Main permission checker for Bash tool. Coordinates security checks, prefix extraction, and subcommand analysis to determine if a command can be auto-approved or needs user confirmation.

**Decision pipeline:**
1. Parse command (tree-sitter AST or shell-quote fallback)
2. Run security checks via `dr6`
3. Extract command prefix via `extractPrefixCached` (pr6)
4. Analyze compound commands via `analyzeSubcommands` (vfq)
5. Check for special cases (cd+git compound, multiple cd, etc.)
6. Return permission decision: `allow`, `ask`, or `passthrough`

**Key design:**
- **Compound command handling**: In `command1 && command2`, each subcommand is analyzed independently
- **cd+git protection**: Compound commands with `cd` and `git` require approval to prevent bare repository attacks
- **Multiple cd protection**: Commands with multiple directory changes require approval for clarity

---

## Redirection Analysis (aI / extractRedirections)

**What it does:** Tokenizes all redirections in a command, classifying each as safe or dangerous.

**Dangerous redirections:** Any redirect whose target contains `$`, `` ` ``, `*`, `?`, `[`, `{`, `(`, `~`, `&`
**Safe redirections:** Plain file paths like `> output.txt`, `>> log.txt`

### checkDangerousRedirection (YYz)

**What it does:** Per-redirection risk assessment. Called for each `>`, `>>`, and `>&` token.

**Key decision:** Redirection to a **variable** (`> $FILE`) is always dangerous — the variable could be manipulated to point to sensitive files like `/etc/cron.d/evil`.

**Fd-to-fd redirections:** `2>&1`, `1>&2`, `2>/dev/null` are always safe — they redirect between standard file descriptors (0, 1, 2) only.

---

## Security Policy Highlights

- **`git` prefix blocked alone**: `"git"` returned by LLM means "any git command" — too broad. Only specific subcommands like `"git commit"`, `"git diff"` are allowed as prefixes.
- **Double-layer injection detection**: Static checks block obvious patterns; LLM provides semantic injection detection for subtle attacks.
- **Allow-list before deny-list**: Common safe patterns (heredocs, git commit messages) bypass expensive checks, reducing false positives.
- **Per-subcommand analysis**: In `command1 && command2`, each subcommand is analyzed independently for both security and read-only classification.
- **jq special treatment**: jq's filter language uses `$var` and `"string"` — the quote-stripping logic has a special `isJq` mode that preserves double quotes to prevent false positives.

**Key insight:** Claude Code treats the shell as an adversarial environment. It doesn't trust the LLM to generate "safe" commands; instead, it uses a second, strictly constrained pass to validate against a human-readable security policy.
