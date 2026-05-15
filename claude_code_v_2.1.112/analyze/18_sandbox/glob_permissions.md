# Bash Glob Permissions — Read-Only Auto-Allow for Globs and `cd <project-dir> &&`

> Documents the **2.1.111** relaxation: `ls *.ts` (glob) and `cd <project-dir> && <safe-command>` (project-prefix) no longer trigger a permission prompt for read-only commands. The Bash classifier now understands these idioms and auto-allows them.

---

## What changed

In v2.1.88, the read-only classifier saw any unquoted glob character (`*`, `?`, `[`, `]`) and bailed:

```javascript
// v2.1.88 — src/tools/BashTool/readOnlyValidation.ts:1706-1708
if (containsUnquotedExpansion(testCommand)) {
  return false  // → not read-only → require permission prompt
}
```

`containsUnquotedExpansion` returned a boolean — either "contains a `$` variable" or "contains an unquoted glob char" was enough to fail. Both got treated identically.

In v2.1.112, the function returns a **tri-state**: `"variable" | "glob" | false`. Variables still fail the read-only check unconditionally (they could expand to anything at runtime). But globs proceed to a **whitelist check** — if the base command is in the glob-allowed set, the command is read-only despite the glob.

```javascript
// v2.1.112 — chunks.116.mjs:2218-2231 (auto-allow loop)
if (Y.commands.length > 0 && Y.commands.every(($) => {
    // ... other safety checks ...
    if (A === "glob" && (Oa1($.text) === "glob" || $.argv.some((H) => /[*?]|\[.*\]/.test(H))))
        return cEz.has($.argv[0] ?? "");   // ← THE GLOB WHITELIST CHECK
    // ... fallthrough to flag-parsing / regex matching ...
}))
```

---

## The Whitelist

```javascript
// ============================================
// GLOB_ALLOWED_READ_ONLY_COMMANDS - Commands safe to auto-allow with globs
// Location: chunks.117.mjs:904
// ============================================

// ORIGINAL (for source lookup):
cEz = new Set([
  "ls", "cat", "head", "tail", "wc", "stat",
  "grep", "egrep", "fgrep", "diff", "du", "df",
  "echo", "strings", "hexdump", "od", "nl",
  "cut", "column", "tr", "tac", "rev", "cmp",
  "basename", "dirname", "realpath", "readlink",
  "sha256sum", "sha1sum", "md5sum", "cd"
]);

// Mapping: cEz→GLOB_ALLOWED_READ_ONLY_COMMANDS
```

### Why these 31 commands?

Each command in the set satisfies three properties:

1. **Read-only by definition.** None of them mutate the filesystem (modulo `cd` which mutates the shell's working directory but not files).
2. **Idempotent with respect to glob expansion.** `ls *.ts` lists whatever files match `*.ts` — no surprise side effects if the glob expands to "weird" matches.
3. **No flags that turn it into a write operation.** `grep --output-file` doesn't exist; `cat` has no `--write` flag; `diff` doesn't modify either input. (Compare `find -delete` or `cp` — both written-out of the set.)

The classifier's logic:

```
if (glob char present in argv):
    if (base command IN whitelist):
        → READ_ONLY (auto-allow)
    else:
        → NOT_READ_ONLY (require approval)
```

So `ls *.ts` and `wc -l *.json` and `cat README.md` all auto-allow. `chmod +w *.sh` and `rm *.tmp` and `mv *.bak old/` all require approval (chmod/rm/mv are not in the whitelist).

---

## The `Oa1` Tri-State Function

```javascript
// ============================================
// detectUnquotedExpansion - Returns "variable" | "glob" | false
// Location: chunks.116.mjs:2078-2124
// ============================================

// ORIGINAL (for source lookup):
function Oa1(q) {
    let K = !1, _ = !1, z = !1, Y = !1, A = !1;
    for (let O = 0; O < q.length; O++) {
        let w = q[O];
        if (z) { z = !1; continue }
        if (w === "\\" && !K) { z = !0; continue }
        if (w === "'" && !_) { K = !K; continue }
        if (w === '"' && !K) { _ = !_; continue }
        if (K) continue;
        if (w === "$") {
            let $ = q[O + 1];
            if ($ && /[A-Za-z_@*#?!$0-9-]/.test($)) return "variable"
        }
        if (_) continue;
        if (w === " " || w === "\t" || w === `\n` || w === "|" || w === "&"
            || w === ";" || w === "(" || w === ")" || w === "<" || w === ">") {
            A = !1; continue
        }
        if (w === "?" || w === "*") { Y = !0; continue }
        if (w === "[") { A = !0; continue }
        if (w === "]" && A) Y = !0
    }
    return Y ? "glob" : !1
}

// READABLE (for understanding):
function detectUnquotedExpansion(command) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;
  let foundGlob = false;
  let insideCharClass = false; // tracks `[` ... `]`

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];

    if (escaped) { escaped = false; continue; }
    if (ch === "\\" && !inSingleQuote) { escaped = true; continue; }
    if (ch === "'" && !inDoubleQuote) { inSingleQuote = !inSingleQuote; continue; }
    if (ch === '"' && !inSingleQuote) { inDoubleQuote = !inDoubleQuote; continue; }
    if (inSingleQuote) continue;

    // Variable expansion fails FAST — runtime expansion is unpredictable.
    // Returns "variable" mid-iteration; caller treats as not-read-only.
    if (ch === "$") {
      const next = command[i + 1];
      if (next && /[A-Za-z_@*#?!$0-9-]/.test(next)) return "variable";
    }

    if (inDoubleQuote) continue; // globs literal inside double quotes

    // Statement separators reset the char-class state.
    if (/[ \t\n|&;()<>]/.test(ch)) { insideCharClass = false; continue; }

    // Bare glob chars (outside quotes).
    if (ch === "?" || ch === "*") { foundGlob = true; continue; }
    if (ch === "[") { insideCharClass = true; continue; }
    if (ch === "]" && insideCharClass) foundGlob = true;
  }

  return foundGlob ? "glob" : false;
}

// Mapping: Oa1→detectUnquotedExpansion, K→inSingleQuote, _→inDoubleQuote,
//          z→escaped, Y→foundGlob, A→insideCharClass
```

### Algorithm

**What it does:** Single-pass scan tracking quote state. Returns three outcomes:

- `"variable"` — found `$NAME` style expansion (immediate fail-out via early return).
- `"glob"` — found bare `?` `*` or matched `[...]` outside quotes.
- `false` — neither.

**How it works:**

1. Track three boolean states: `inSingleQuote`, `inDoubleQuote`, `escaped`.
2. Per character:
   - `\` outside SQ → toggle escape (next char is literal).
   - `'` outside DQ → toggle SQ.
   - `"` outside SQ → toggle DQ.
   - Inside SQ → everything literal.
3. `$<varchar>` outside SQ → immediate `"variable"` return (variables expand inside DQ too).
4. Inside DQ → globs literal, skip.
5. Statement separator → reset char-class tracking.
6. `?` or `*` outside quotes → set glob flag.
7. `[` → enter char class. `]` → only counts as glob if currently in class.

**Why this approach:**

- **Variable detection short-circuits.** The function returns mid-loop on `$` because variables can hide *anything*. `python *.py` is glob (auto-allowable for `ls`, `cat`, etc., but not `python`). `python $FOO` could be `python --eval=...`. Tri-state lets the caller treat these very differently.
- **Char class tracking.** Without `insideCharClass`, a lone `]` would falsely register as a glob. Bash only treats `]` as a glob char when paired with `[`. The state machine matches Bash's actual parser semantics.
- **Single-pass scan.** A regex-based approach (find unquoted `[*?[]`) would need a much more complex regex. The state machine is easier to audit.
- **Escape inside SQ is literal.** Bash treats `\` inside single quotes as a literal backslash — `'\\'` is two backslashes, not one. The check `!inSingleQuote` before setting `escaped = true` is critical; without it, `'\'` would desync the quote tracker and miss subsequent glob chars.

**Key insight:** This function used to return boolean, treating variables and globs identically. The 2.1.111 change is **specifically the tri-state return** — same scan code, finer-grained outcome, enabling per-category handling at the call site.

---

## `cd <project-dir> &&` Prefix Strip

The second 2.1.111 relaxation removes the `cd ${cwd} &&` prefix from compound commands before classification.

```javascript
// ============================================
// filterCdCwdPrefix - Strip `cd ${cwd}` subcommands from compound list
// Location: chunks.164.mjs:1221-1233
// ============================================

// ORIGINAL (for source lookup):
function fkY(q, K, _, z) {
    let Y = [], A = [];
    for (let O = 0; O < q.length; O++) {
        let w = q[O];
        if (w === `cd ${_}` || w === `cd ${z}`) continue;
        Y.push(w), A.push(K?.[O])
    }
    return { subcommands: Y, astCommandsByIdx: A }
}

// READABLE (for understanding):
function filterCdCwdPrefix(subcommands, astCommands, cwd, cwdMingw) {
  // Drop any subcommand that's exactly `cd ${currentCwd}` (or its MinGW form).
  // Keeps the parallel AST array aligned by index.
  const filteredSubcommands = [];
  const filteredAstCommands = [];

  for (let i = 0; i < subcommands.length; i++) {
    const cmd = subcommands[i];
    if (cmd === `cd ${cwd}` || cmd === `cd ${cwdMingw}`) continue; // drop
    filteredSubcommands.push(cmd);
    filteredAstCommands.push(astCommands?.[i]);
  }

  return { subcommands: filteredSubcommands, astCommandsByIdx: filteredAstCommands };
}

// Mapping: fkY→filterCdCwdPrefix, q→subcommands, K→astCommands, _→cwd, z→cwdMingw
```

### What and why

**What it does:** Removes `cd ${cwd}` and `cd ${cwdMingw}` (MinGW/Cygwin-style path on Windows) from the list of subcommands the classifier walks. The classifier then sees only the *inner* commands.

**Why:** Models love to prepend `cd <project-dir> &&` to commands as a form of self-documentation or to disambiguate working directory. Without this filter:

- `cd /repo/myproject && ls *.ts` becomes a compound with TWO subcommands (`cd /repo/myproject` and `ls *.ts`).
- Compound + `cd` triggers a permission prompt (under the "compound commands with cd require approval" path) even for read-only inner commands.

With the filter:

- `cd /repo/myproject` (exactly the cwd) is dropped.
- The classifier sees only `ls *.ts`, applies the glob whitelist, auto-allows.

### Why match exactly `cd ${cwd}` (not `cd <any-dir>`)?

A model that does `cd /etc && rm -rf *` shouldn't sneak by. The filter is **scoped to the literal cwd string** — if the model `cd`s somewhere *else*, the cd stays in the subcommand list, the compound-cd security check fires, and a permission prompt happens.

**Trade-off:** A user could `cd ./subdir && ls` and it would still prompt — because `cd ./subdir` is not `cd ${cwd}`. The narrow match is the security/UX trade. Loosening to "cd to any subdir of cwd" would broaden the attack surface (a model could craft `cd <symlink-to-anywhere>`).

### Why two-form match (`cwd` and `cwdMingw`)?

On Windows under Git Bash / MinGW / Cygwin, the cwd has two representations: `/c/Users/foo` (POSIX-y) and `C:\Users\foo` (native). Models pick one or the other depending on context. The two-form match catches both.

---

## End-to-End Example

**User: "list all TypeScript files in this project"**

Model emits:

```bash
cd /home/user/myproject && ls *.ts
```

Trace through the classifier:

1. **AST parse.** Two commands: `cd /home/user/myproject` and `ls *.ts`. Compound with `&&`.
2. **`commandHasAnyCd`** returns true. In v2.1.88, this immediately would set `compoundCommandHasCd = true` and trigger the compound-cd permission gate.
3. **`filterCdCwdPrefix`** (2.1.111 new). Drops `cd /home/user/myproject` because it matches the current cwd. Now the subcommand list is just `["ls *.ts"]`.
4. **Per-subcommand read-only check.** `ls *.ts`:
   - `detectUnquotedExpansion` returns `"glob"`.
   - Auto-allow loop: `glob === "glob"` AND base command `ls` IS in `GLOB_ALLOWED_READ_ONLY_COMMANDS` → read-only.
5. Verdict: read-only → auto-allow. **No permission prompt.**

Compare v2.1.88:

1. Same AST parse.
2. `compoundCommandHasCd = true`.
3. `containsUnquotedExpansion("ls *.ts")` returns `true` → not read-only.
4. Fall through to other permission rules. If no `Bash(ls:*)` rule, prompt.

The 2.1.111 change saves the prompt.

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Whitelist 31 commands | Conservative — but adding commands is reversible and the whitelist is easy to audit. Excluded `find`/`rg` because they have `-delete`/`-x` flags; covered by flag-parsing branch instead. |
| Exact `cd ${cwd}` match only | Doesn't help `cd ./subdir && ls`. Tighter security; user can add explicit `Bash(cd:*)` rule if needed. |
| Glob → variable distinction in `detectUnquotedExpansion` | Enables the whitelist check; variable expansion still rejects unconditionally because runtime values unknown. |
| Strip cd BEFORE compound-cd security gate | Some compound-cd attacks are now harder to detect — but only when the cd matches cwd exactly, which is the safe pattern. |
| `cd` in the GLOB_ALLOWED whitelist | Surprising — `cd *` would expand the glob. But it's harmless (cd succeeds or fails, no fs mutation). Listed for symmetry; bare `cd` already auto-allowed via separate path. |

---

## Why a Whitelist Instead of a Blocklist?

Alternative design: maintain a list of commands that are **dangerous with globs** (`rm`, `chmod`, `mv`), and auto-allow everything else. Author chose whitelist because:

1. **New commands are unknown.** A blocklist must enumerate every dangerous command; missing one is a security hole. A whitelist must enumerate every safe command; missing one is a UX friction.
2. **Friction is reversible; security holes are not.** A user can always add `Bash(my-new-command:*)` to their settings; an exfil through a missed dangerous command can't be undone.
3. **Composability.** The whitelist + flag-parsing branch (`xEz` / `isCommandSafeViaFlagParsing`) work together — commands not in the glob whitelist can still pass via flag-parsing if all flags are known-safe. Layered defense.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88 → v2.1.112 index

Key functions in this document:
- `detectUnquotedExpansion` (Oa1) — tri-state quote-aware scanner
- `filterCdCwdPrefix` (fkY) — strip `cd ${cwd}` from compound subcommands
- `checkReadOnlyConstraints` (yu8) — top-level read-only classifier
- `GLOB_ALLOWED_READ_ONLY_COMMANDS` (cEz) — 31-command whitelist
- `isCommandSafeViaFlagParsing` (xEz) — flag-parsing fall-through
- `getCwd` (b8) — current working directory
- `getOriginalCwd` (Y7) — session-start cwd (compared to `b8` for sandbox bare-repo check)
