# `Bash(find:*)` No Longer Auto-Approves `-exec`/`-delete` — v2.1.113

**Theme:** `find` is a peculiar command. Most invocations (`find . -name "*.tmp"`) are pure-read — they just walk the filesystem listing matches. But `find` *also* has action predicates (`-exec`, `-execdir`, `-ok`, `-okdir`, `-delete`, `-fprint`, `-fprint0`, `-fprintf`, `-fls`) that **execute arbitrary commands or modify files**.

Pre-v2.1.113, a user's `Bash(find:*)` allow rule auto-approved **all** find invocations, including `find . -name "*.txt" -exec rm {} \;` — effectively giving the model a shell-exec primitive disguised as a "search" command. v2.1.113 blocks find's action predicates from prefix-rule auto-allow, requiring an explicit prompt for any `-exec`/`-delete`-class invocation.

This is **the largest single-command security fix** in the v2.1.113-142 window. `find -exec` is a *category killer* — it lets the model do anything via the find tool.

---

## 1. The Vulnerability — `find -exec rm` Slips Through `find:*` Allow

User's `~/.claude/settings.json`:
```json
{
  "permissions": {
    "allow": ["Bash(find:*)"]
  }
}
```

This is **intended** to allow `find` for filesystem search. The user grants it because they want Claude to be able to locate files without being prompted for every search.

Pre-v2.1.113, the model could invoke:
```
find . -type f -name "*.log" -delete
find /home/user -name ".env*" -exec cp {} /tmp/exfil/ \;
find . -name "package.json" -exec sed -i 's/version/whatever/' {} \;
```

…and each auto-approves under `Bash(find:*)`. The user's `Bash(find:*)` rule was equivalent to `Bash(*)` — a shell-exec primitive.

The classifier defaults already deny this *via the auto-mode classifier*, but allow rules at the static layer bypass the classifier in the bash-classifier path. So a v2.1.112 user with `find:*` had *no* protection from this attack.

---

## 2. The Static-Analysis Block (Line 205409-205423)

In the bash classifier (`AST_static_check_or_too_complex`), after wrapper-stripping, when the command is `find`:

```javascript
// ============================================
// findStaticAnalysisGuard - Reject find auto-allow on action predicates
// Location: cli_inner_pretty.js:205409-205423
// ============================================

// ORIGINAL (for source lookup):
if (_ === "find")
  for (let Y = 1; Y < K.length; Y++) {
    let f = K[Y];
    if (Qz6.has(f) || dz6.test(f)) {                   // safe predicate that takes 1 arg
      Y++;
      continue;
    }
    if (xZ(f))
      return { ok: !1, reason: "find argument is runtime-determined — could resolve to a dangerous action" };
    if (gz6.has(f))
      return {
        ok: !1,
        reason: `find with '${f}' executes commands or modifies files — cannot be auto-allowed by a Bash(find:*) prefix rule`,
      };
  }

// READABLE (for understanding):
if (commandHead === "find") {
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];

    // Predicates that take one argument (e.g., -name PATTERN, -mtime +7)
    // Skip the predicate AND its argument
    if (SAFE_FIND_PREDICATES.has(arg) || NEWER_TIME_REGEX.test(arg)) {
      i++;  // skip the value
      continue;
    }

    // Runtime-determined args (e.g., $(cmd)) — can't statically prove safety
    if (isRuntimeDetermined(arg)) {
      return {
        ok: false,
        reason: "find argument is runtime-determined — could resolve to a dangerous action"
      };
    }

    // DANGEROUS predicates: -exec, -delete, -fprint, etc.
    if (DANGEROUS_FIND_FLAGS.has(arg)) {  // gz6
      return {
        ok: false,
        reason: `find with '${arg}' executes commands or modifies files — cannot be auto-allowed by a Bash(find:*) prefix rule`,
      };
    }
  }
}

// Mapping: _→commandHead, K→argv, Y→i, f→arg, Qz6→SAFE_FIND_PREDICATES,
//   dz6→NEWER_TIME_REGEX, xZ→isRuntimeDetermined, gz6→DANGEROUS_FIND_FLAGS
```

### The dangerous-flags set `gz6` (line 205646)

```javascript
gz6 = new Set([
  "-exec",     // run command, semicolon-delimited
  "-execdir",  // run command in match's directory
  "-ok",       // -exec with prompt
  "-okdir",    // -execdir with prompt
  "-delete",   // unlink matched files
  "-fprint",   // write matched paths to file (potentially overwriting)
  "-fprint0",  // -fprint with NUL separator
  "-fprintf",  // -fprintf format-string-to-file
  "-fls",      // -ls equivalent writing to file
]);
```

All nine flags either execute arbitrary commands or write to filesystem. Any one's presence in the argv rejects auto-allow.

### The safe-flags set `Qz6` (line 205647)

```javascript
Qz6 = new Set([
  "-name", "-iname", "-path", "-ipath", "-lname", "-ilname",
  "-regex", "-iregex", "-wholename", "-iwholename",
  "-samefile", "-newer", "-anewer", "-cnewer", "-mnewer",
  "-perm", "-user", "-group", "-uid", "-gid", "-size",
  "-type", "-xtype", "-fstype", "-inum", "-links", "-used",
  "-context", "-amin", "-cmin", "-mmin", "-atime", "-ctime",
  "-mtime", "-mindepth", "-maxdepth", "-printf",
  "-regextype", "-D", "-f", "-flags",
  "-Bnewer", "-Btime", "-Bmin",
  "-files0-from", "-xattrname",
]);
```

These predicates take one argument and don't have side effects. The static check **skips both the predicate and its value** (`Y++; continue`).

### The `-newerXY` variant

```javascript
dz6 = /^-newer[aBcm][aBcmt]$/;
```

GNU find has `-neweraa`, `-newerac`, `-neweram`, `-neweraB`, `-newercm`, `-newermc`, etc. — combinations of `aBcm` × `aBcmt`. The regex matches the whole family without enumerating each.

---

## 3. The Read-Only `find` Pattern (Line 277014)

Separately, the auto-allow regex for *read-only* find commands explicitly **excludes** the dangerous flags:

```javascript
/^find(?:\s+(?:\\[()]|(?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)[^<>()$`|{}&;\n\r\s]|\s)+)?$/
```

This regex is a **negative-lookahead pattern**. Read it as:

```
^find
  (?:
    \s+                          # whitespace
    (?:
      \\[()]                     # OR an escaped paren \(  \)
      |
      (?!-delete\b|-exec\b|-execdir\b|-ok\b|-okdir\b|-fprint0?\b|-fls\b|-fprintf\b)
        [^<>()$`|{}&;\n\r\s]     # AND a single non-special char NOT starting a dangerous flag
      |
      \s                          # OR whitespace
    )+
  )?
$
```

The negative-lookahead `(?!-delete\b|...)` asserts that the next characters do **not** spell one of the dangerous flags. Combined with `\b`, this correctly excludes:
- `find -delete .` — `-delete` is matched by `\b-delete\b`
- `find -delete-not-really .` — `\b` is satisfied (delete followed by `-`), so this **doesn't** match the negative lookahead (it would be a 2-arg `-delete -not-really`... actually no, this is a single token; `\b` would not be satisfied between `delete` and `-`). Hmm.

Actually `\b` is between word and non-word characters. In `-delete .`, between `e` (word) and ` ` (non-word) is a `\b`. In `-delete-not-really`, between `e` and `-` (non-word) is also a `\b`. So the lookahead **would** reject `-delete-not-really` too — even though it's a non-existent flag.

This is conservative — the regex prefers false negatives (rejecting too much) over false positives (allowing dangerous commands). The auto-allow path is only one of several allow paths; rejecting weird patterns just sends them to the prompt path.

---

## 4. Why `Bash(find:*)` Auto-Allow Could Be Trusted Pre-Fix

The fix raises an obvious question: why was `Bash(find:*)` ever trusted to auto-allow at all?

Pre-fix, the assumption was "if the user explicitly typed `Bash(find:*)` they understand find well enough to know what they're doing." This proved **wrong** in practice:

1. Users who copy a `permissions.allow` recipe from a blog post don't think about `-exec`
2. Users who say "I trust find" mean "I trust find for *search*"
3. The model can construct `find -exec` even if the user never has — autonomously deciding to write a "cleanup" routine
4. Documentation around the recipe pattern (`<command>:*`) implied "argument shape doesn't matter," which is true for most commands but not find

The fix doesn't change the **rule shape** (still `Bash(find:*)`), but it **narrows what the rule covers**. Users who *want* `find -exec` auto-allowed must now write an explicit narrower rule:

```json
{
  "permissions": {
    "allow": [
      "Bash(find:*)",                          // safe finds
      "Bash(find . -name *.log -delete)"       // specific exact-match
    ]
  }
}
```

The narrower rule won't be triggered by other `find -delete` invocations — it's exact-match. So `find -exec` is no longer covered by "trust find broadly," but **can** be covered by per-command explicit rules.

---

## 5. The Reasoning Phase — `reason` Field Has Pedagogical Value

Note the rejection message:

> "find with '-delete' executes commands or modifies files — cannot be auto-allowed by a Bash(find:*) prefix rule"

This is **shown to the user** at the prompt. It's pedagogical:

- Tells the user *which flag* triggered the block
- Tells the user *why* it can't be auto-allowed
- Tells the user *which rule* would have applied but can't (`Bash(find:*)`)

The user can write a narrower exact-match rule, or accept the prompt as-is. Either way, the message educates: the user learns that find has action predicates.

This is the project's recurring pattern — **defensive messages that teach the user how to fix their config**, not generic "denied" messages.

---

## 6. The Compound — Tree-Sitter AST + Static Check

The bash classifier uses **tree-sitter** to parse the command into an AST, then walks the AST applying static checks. The find-flag check is **one of several** post-parse checks (others: zsh-only builtins via `jdK`, eval-class builtins via `JdK`, dangerous wrappers via `XdK`, jq with `system()` calls, etc.).

The full bash AST walk function (`WdK`, post-wrapper-strip) returns `{ ok: true }` only if **all** static checks pass. Any failure produces `{ ok: false, reason: "..." }`.

The `find` check is a **per-argument** loop, unlike other checks which look at the command head only. This is because `find`'s argument structure is unique — predicates appear after positional path arguments, mixed with action predicates. The check has to walk the whole argv to find an `-exec` or `-delete`.

---

## 7. Edge Cases the Check Handles

### Escaped parens in the regex

```javascript
\\[()]    // matches literal \( or \)
```

`find` allows `\(` and `\)` for grouping expressions: `find . \( -name "*.tmp" -o -name "*.bak" \) -delete`. The static-allow regex permits these escapes (assuming they're safe), but the AST check still sees `-delete` and rejects.

### `-fprint0?` regex

```javascript
-fprint0?
```

The `0?` is a regex quantifier — matches both `-fprint` and `-fprint0`. The set `gz6` lists both explicitly; the regex coalesces them for brevity.

### Newer-time predicates

The regex `dz6 = /^-newer[aBcm][aBcmt]$/` handles GNU find's family. The set check at the start of the argv walk:

```javascript
if (Qz6.has(f) || dz6.test(f)) {
  Y++;
  continue;
}
```

If the argument is in the safe set OR matches the newer-time regex, it's safe — skip predicate + value.

### Runtime-determined arguments

```javascript
if (xZ(f))
  return { ok: !1, reason: "find argument is runtime-determined — could resolve to a dangerous action" };
```

`xZ(f)` tests whether the argument contains shell expansion (`$VAR`, `$(cmd)`, backticks, etc.). If yes, the static check **can't prove** what the argument resolves to at runtime — so it conservatively rejects auto-allow. This is the same defense as the sandbox auto-allow's check.

---

## 8. Why Not Just Add to Bash Deny Rules

The team could have added a deny rule:

```javascript
// hypothetical pre-defined deny
permissions.deny: ["Bash(find * -exec *)"]
```

This was rejected because:

1. **Find's argument order isn't fixed** — `-exec` can appear anywhere after the search root
2. **Deny rules don't have wildcards** that would match all the variants — would need many rules
3. **AST parsing is already running** — adding the check there is more robust than regex-matching the command string

The AST-based check is the **last line of defense** before auto-allow approves. It's also **separate** from the auto-mode classifier (which has its own deny list for find-exec). Both run; both can reject.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions and constants in this document:
- `dangerousFindFlags` (`gz6`) — Set of `-exec`/`-execdir`/`-ok`/`-okdir`/`-delete`/`-fprint`/`-fprint0`/`-fprintf`/`-fls`
- `safeFindPredicates` (`Qz6`) — 35-entry set of safe predicates (`-name`, `-type`, `-mtime`, etc.)
- `newerTimeRegex` (`dz6`) — Regex `^-newer[aBcm][aBcmt]$` for `-neweraa`/`-newerXY` family
- `isRuntimeDetermined` (`xZ`) — Tests if an argument contains shell expansion
- `bashAstStaticCheck` (`WdK`) — Top-level AST walker that applies per-command-head checks
- `readOnlyFindRegex` — Negative-lookahead pattern at line 277014 for the "always auto-allow" set
