# Shell Parser: Command Validation & Security Overview

## Module Overview

The Shell Parser module in Claude Code v2.1.38 is a critical security component. It intercepts
all `Bash` tool calls to perform multi-layer security analysis before any command executes on the
host system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Shell Parser section)

Key functions in this document:
- `runSecurityChecks` (lm) - Static security pipeline entry point
- `bashPreFlightCheck` (AYz) - LLM-based command prefix extraction
- `checkReadOnlyBehavior` (Of6) - Read-only permission gate
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

## Layer 1: Static Security Checks

### Entry Point (lm / runSecurityChecks)

**What it does:** Uses a combination of allow-list and deny-list checks to classify the risk of a shell command. Returns `"passthrough"` (safe to proceed), `"allow"` (explicitly safe), or `"ask"` (needs user confirmation).

**Pre-check:** Before anything else, `CY8` (`hasSingleQuotedBackslashBypass`) detects the `'a\'` pattern that can confuse quote-state tracking in downstream security checks.

**Phase A — Allow-list (run first):**
These checks can short-circuit the pipeline by explicitly allowing a command:

| Check | Function | When Allowed |
|-------|----------|--------------|
| Empty command | ndY | Command is empty/whitespace |
| Quoted heredoc | tdY | `<<'DELIM'` or `<<\DELIM` |
| Heredoc in `$()` | adY | `$(cat <<'EOF' ... EOF)` with quoted delimiter |
| Git commit message | sdY | `git commit -m "simple message"` |

**Phase B — Deny-list (run after allow-list):**
These checks can flag a command as needing user approval:

| Check | Function | What It Catches |
|-------|----------|----------------|
| jq dangerous ops | edY | `system()` function, file-reading flags |
| Obfuscated flags | $cY | ANSI-C quoting, locale quoting, quoted flag names |
| Shell metacharacters | AcY | `;`, `\|`, `&` inside quoted arguments |
| Dangerous variables | qcY | `$VAR` in redirection/pipe context |
| Newlines | YcY | Embedded newlines as command separators |
| IFS injection | zcY | `$IFS` manipulation |
| /proc/environ | wcY | Process environment exposure |
| Dangerous patterns | KcY | Backticks, `$()`, `${}`, `<()`, `>()` |
| Malformed tokens | HcY | Unbalanced brackets with separators |

---

## Layer 2: LLM Prefix Extraction (bashPreFlightCheck / AYz)

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

**Embedded policy spec examples (actual source):**
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

## Layer 3: Read-Only Permission Check (Of6 / checkReadOnlyBehavior)

**What it does:** Determines if a command can be automatically approved as a read-only operation, without requiring explicit user permission.

**Decision pipeline:**
1. Verify command is parseable
2. Verify command passes static security checks
3. Check for Windows UNC paths (WebDAV attack vector)
4. Check for `cd` + `git` compound (needs extra scrutiny)
5. Check for git in bare repository (may affect git objects)
6. Verify **all** subcommands are individually read-only via `NcY` (isReadOnlyCommand)

**Safe Command Registry:** The `jcY` (SAFE_COMMAND_REGISTRY) object maps ~30 commands to their approved flags:
- `git diff`, `git log`, `git show`, `git status`, `git blame`, `git grep`, ...
- Docker read commands: `docker ps`, `docker logs`, `docker inspect`, ...
- Each command has a `safeFlags` map specifying flag names and their argument types

**Safe Command Patterns:** The `fcY` (SAFE_COMMAND_PATTERNS) Set contains regex patterns for trivially safe commands:
- `pwd`, `whoami`, `ls`, `cat`, `head`, `tail`, `wc`, `stat`, ...
- `echo` (without pipes/separators)
- `cd [path]`
- `find` (without `-exec`, `-delete`, etc.)

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
