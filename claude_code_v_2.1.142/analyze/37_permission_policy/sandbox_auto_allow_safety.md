# Sandbox Auto-Allow Bypass for `rm`/`rmdir` to `/`, `$HOME` — v2.1.116

**Theme:** With `sandbox.autoAllowBashIfSandboxed: true`, Bash commands inside the sandbox are auto-approved (no permission prompt) because the sandbox itself contains them. v2.1.116 closes a class of bug: the auto-allow path was *also* bypassing the **dangerous-path safety check** for `rm`/`rmdir` targeting root `/` or `$HOME`. A sandboxed-but-unbounded `rm -rf /` could destroy the sandbox's mount points, and `rm -rf $HOME` could destroy mounted user home — both are catastrophic even within sandbox.

The fix re-introduces the dangerous-path check **inside** the sandbox-auto-allow path. The sandbox is no longer "trust everything that runs inside" — it's "trust everything except the small set of commands that can damage the host even when contained."

This is paired with v2.1.113's expansion of `nUH` (the dangerous-path check itself) to recognize macOS `/private/{etc,var,tmp,home}` as equivalent to their bare counterparts, closing another bypass class.

---

## 1. The Sandbox Auto-Allow Pre-Fix

When `autoAllowBashIfSandboxed` is enabled and the command passes static safety checks, the sandbox path takes a fast lane (`v64` in chunks `_top_*`, line 420551-420579). Pre-v2.1.116, the fast lane was:

```javascript
function v64(H, $, q) {
  if (!isSandboxingEnabled() || !isAutoAllowBashIfSandboxedEnabled() || !bV(H)) return null;
  let K = VA5(H, $, q);                           // rule check
  if (K.behavior === "passthrough") return null;

  // ... static checks: no $VAR, no $(cmd), no /dev/tcp, etc.

  // ❌ no dangerous-path check before returning allow
  return K;
}
```

If the command was `rm -rf /` *inside the sandbox*, the static checks would pass (no shell expansion, no special redirects), the rule check would pass (no `Bash(rm:*)` deny rule), and the sandbox would obediently destroy everything writable.

### Why this matters even with a sandbox

Sandbox-allows aren't unlimited — they bound network access, write paths, etc. But the *project working directory* is typically writable inside the sandbox (otherwise editing files doesn't work). `rm -rf .` in the sandbox destroys the project. `rm -rf /` in the sandbox destroys the project plus any other writable mounts. Even though the host's `/` is unaffected, the user's session is destroyed.

Worse, macOS sandboxes that mount `$HOME` (e.g., for keychain access via `~/Library/Application Support/...`) would let `rm -rf $HOME` destroy the user's home contents.

---

## 2. The Fix — Reuse `IX6` Inside Sandbox Auto-Allow

The v2.1.116 fix re-invokes the existing `IX6` dangerous-path check inside `v64` (line 420567-420578):

```javascript
// ============================================
// sandboxAutoAllowWithSafetyCheck - Sandbox fast-path with rm/rmdir safety re-check
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
    if (((f = !0), IX6(M, w, I$()).behavior !== "passthrough")) return null;   // ← v2.1.116 FIX
  }
  if (Y && f) return null;                       // cd + rm in compound → reject
  return K;
}

// READABLE (for understanding):
function sandboxAutoAllowWithSafetyCheck(commandInput, permContext, parsedAst) {
  // Gates: sandbox enabled, auto-allow flag set, command-shape supported
  if (!isSandboxingEnabled() || !isAutoAllowBashIfSandboxedEnabled() || !isSupportedSandboxCommand(commandInput)) {
    return null;
  }

  // Run the rule check first — deny rules and prefix-allow rules apply
  const ruleResult = sandboxAutoAllowRuleCheck(commandInput, permContext, parsedAst);
  if (ruleResult.behavior === "passthrough") return null;

  // Block unknown env-var prefixes (e.g., `LD_PRELOAD=... cmd`)
  const envVarRegex = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/;
  const hasDangerousEnvPrefix = parsedAst.some((cmd) =>
    cmd.envVars.some((v) => !isSafeEnvVar(v.name)) ||
    cmd.argv.some((arg) => {
      const m = arg.match(envVarRegex);
      return m !== null && !isSafeEnvVar(m[1]);
    })
  );
  // Block /dev/tcp and /dev/udp redirects (network-exfil over redirect)
  const hasDevTcpRedirect = parsedAst.some((cmd) =>
    cmd.redirects.some((r) => /^\/dev\/(tcp|udp)\//.test(r.target))
  );
  if (hasDangerousEnvPrefix || hasDevTcpRedirect) return null;

  // v2.1.116: For every parsed command, check if it's rm/rmdir → run dangerous-path check
  let hasCd = false, hasRm = false;
  for (const cmd of parsedAst) {
    const [head, ...rest] = stripBashWrappers(cmd.argv);
    if (head === "cd") { hasCd = true; continue; }
    if (head !== "rm" && head !== "rmdir") continue;
    hasRm = true;
    // IX6 returns "passthrough" if no dangerous path; anything else means dangerous
    if (dangerousPathCheck(head, rest, processCwd()).behavior !== "passthrough") {
      return null;  // dangerous rm target → reject auto-allow, fall back to prompt
    }
  }

  // Also reject compound commands that combine `cd` with `rm`
  // (cd $LIKELY_TO_BE_OUTSIDE_PROJECT; rm -rf .) is a classic dangerous pattern
  if (hasCd && hasRm) return null;

  return ruleResult;
}

// Mapping: v64→sandboxAutoAllowWithSafetyCheck, n6→sandboxController, bV→isSupportedSandboxCommand,
//   VA5→sandboxAutoAllowRuleCheck, kdH→isSafeEnvVar, IX6→dangerousPathCheck,
//   LMH→stripBashWrappers, I$→processCwd
```

### Key insight — `IX6` was already there, just not called from this path

`IX6` (chunks `_top_*`, line 274835-274851) existed as the dangerous-path check used by the **non-sandbox** rm/rmdir permission flow. The v2.1.116 fix is *adding the call* to the sandbox flow, not creating a new check. This is the classic "reuse the existing defense" pattern — the bug was a missed-out call, not a missing function.

### The cd + rm rejection

Even without a dangerous target, `cd` followed by `rm` in a compound command is rejected:

```javascript
if (Y && f) return null;  // cd + rm together
```

Why? Because static analysis can't predict where `cd` lands. `cd $RUNTIME_PATH && rm -rf .` could `cd` to root, then `rm -rf .` becomes `rm -rf /`. Pre-fix, the sandbox auto-allowed this; post-fix, the **co-presence** of `cd` and `rm` in any compound triggers a reject. The user is asked.

This is *defense in depth* — even if the future path resolution were robust, the heuristic catches it earlier.

---

## 3. `IX6` — The Dangerous-Path Check Itself

The check that v2.1.116 reuses (chunks `_top_*`, line 274835-274851):

```javascript
// ============================================
// dangerousPathCheck - Block rm/rmdir if target resolves to a critical path
// Location: cli_inner_pretty.js:274835-274851
// ============================================

// ORIGINAL (for source lookup):
function IX6(H, $, q) {
  let K = vdH[H],
    _ = K($);
  for (let A of _) {
    let z = Gk(A),
      Y = q78.isAbsolute(z) ? z : q78.resolve(q, z);
    if (nUH(Y))
      return hX6(H, `Dangerous ${H} operation detected: '${Y}'...`, `on critical path: ${Y}`);
  }
  return { behavior: "passthrough", message: `No dangerous removals detected for ${H} command` };
}

// READABLE (for understanding):
function dangerousPathCheck(commandName, args, processCwd) {
  // Extract target paths from rm/rmdir args (strips flags like -r, -f, --recursive)
  const argParser = positionalArgParsers[commandName];  // vdH
  const targets = argParser(args);

  for (const target of targets) {
    const normalizedTarget = normalizeQuoting(target);
    const absoluteTarget = path.isAbsolute(normalizedTarget)
      ? normalizedTarget
      : path.resolve(processCwd, normalizedTarget);

    // Check if the absolute target is a critical system path
    if (isCriticalPath(absoluteTarget)) {
      return buildDangerousResult(
        commandName,
        `Dangerous ${commandName} operation detected: '${absoluteTarget}'\n\nThis command would remove a critical system directory. ...`,
        `on critical path: ${absoluteTarget}`
      );
    }
  }

  return { behavior: "passthrough", message: `No dangerous removals detected for ${commandName} command` };
}

// Mapping: IX6→dangerousPathCheck, H→commandName, $→args, q→processCwd,
//   K→argParser, vdH→positionalArgParsers, _→targets, Gk→normalizeQuoting,
//   nUH→isCriticalPath, hX6→buildDangerousResult
```

The list of paths that `nUH` (`isCriticalPath`) considers dangerous (chunks `_top_*`, line 207091-207105):

```javascript
function nUH(H) {
  let $ = H.replace(/[\\/]+/g, "/");
  if ($ === "*" || $.endsWith("/*")) return !0;
  let q = c$() === "macos",
    K = (f) => (q ? f.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : f),
    _ = K($),
    A = _ === "/" ? _ : _.replace(/\/$/, "");
  if (A === "/") return !0;                       // root
  if (ce1.test(A)) return !0;                     // matches root-children whitelist
  let z = K(oz6.homedir().replace(/[\\/]+/g, "/"));
  if (A === z) return !0;                         // $HOME
  if (vt.dirname(A) === "/") return !0;           // anything directly under /
  if (le1.test(A)) return !0;                     // matches a separate critical-path pattern
  return !1;
}
```

The function returns `true` (dangerous) for:
- `*` or `*/...` — globs (might expand to anything)
- `/` itself
- `/<something-matching-ce1>` (root-children whitelist)
- The user's home directory
- Any direct root-child (`/usr`, `/etc`, `/home`, etc.)
- Anything matching `le1` (the other critical-path regex)

### v2.1.113 macOS extension

```javascript
let q = c$() === "macos",
  K = (f) => (q ? f.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : f),
```

On macOS, `/etc` is a symlink to `/private/etc`. Pre-v2.1.113, `rm -rf /private/etc` wasn't detected as dangerous (the check matched `/etc`, not `/private/etc`). The v2.1.113 fix adds the **normalize** step `K`: on macOS, any path starting with `/private/(etc|var|tmp|home)` is rewritten to `/(etc|var|tmp|home)` before the equivalence check, catching the alias.

This is a defense against an attacker who knows the symlink and tries `/private/etc/passwd` to evade detection. The four paths (`etc`, `var`, `tmp`, `home`) are the canonical macOS alias roots — bash/zsh might canonicalize paths through these depending on `cd -P` and environment.

### The home-directory check

```javascript
let z = K(oz6.homedir().replace(/[\\/]+/g, "/"));
if (A === z) return !0;
```

`os.homedir()` returns `/Users/foo` (macOS) or `/home/foo` (Linux). Stripped of slashes and post-K-normalized, this is compared against the target. So `rm -rf ~/` (post tilde-expansion) gets blocked.

---

## 4. The Compound — Sandbox Auto-Allow + cd Heuristic

The v64 function rejects auto-allow when any of:

1. **rm or rmdir targets a critical path** (`IX6` returns non-passthrough)
2. **cd is co-present with rm in compound commands** (`hasCd && hasRm`)
3. **Dangerous env-var prefixes** (`LD_PRELOAD=...`, etc.)
4. **`/dev/tcp` or `/dev/udp` redirects** (network exfil)

The first three are policy/static-analysis based; the fourth is a sandbox-specific concern (sandboxes might still allow network via legacy `bash`-tcp redirect).

The **rejection** in all cases means "fall back to the normal permission flow" — the user gets prompted. The auto-allow fast-path doesn't return `deny`, it returns `null` to opt out, leaving the decision to the slower path (where `IX6` would fire again at the right layer, possibly returning `ask` instead of `passthrough`).

---

## 5. Why Reject vs Deny

The fast-path returns `null` (passthrough to slower checks) instead of `{ behavior: "deny" }`. Why?

Because the deny decision should come from the **canonical** path that handles all the messaging, suggestions, and decision-reason wiring. Returning `null` says "I don't have an opinion, defer to the rest." This:

1. Keeps `v64` short and focused on the auto-allow happy-path
2. Lets `IX6` be called *again* in the normal flow with full context
3. Ensures the user-visible "rm -rf /" prompt has the right message (`"Dangerous rm operation detected: '/'"`) rather than a generic "auto-allow declined"

The cost of double-checking is small (the AST is parsed once, the args lookup is O(1)), and the consistency is worth it.

---

## 6. The Symmetric "What's Safe to Sandbox-Auto-Allow"

The opposing question — *what commands ARE safe to auto-allow in a sandbox* — is answered by `bV(H)` (the `isSupportedSandboxCommand` gate) and the layered checks in `LdK(M) || GA5.has(M) || ZA5.has(M)` (line 420614-420624):

```javascript
if (
  M === void 0 ||
  !/^[A-Za-z0-9._/~+][A-Za-z0-9._/~+-]*$/.test(M) ||
  LdK(M) ||                                       // dangerous wrapper / bash builtins
  GA5.has(M) ||                                   // known-dangerous commands
  (ZA5.has(M) && f.some((w) => w.includes("["))) ||  // commands with array-subscript danger
  (M === "test" && f.some((w) => w === "-t" || gUH.has(w))) ||  // test with -t (zsh arith-eval)
  M === "jq" ||                                   // jq has system() function
  (M === "find" && f.some((w) => gz6.has(w)))     // find with -exec/-delete (see find_exec_delete_block.md)
)
  return null;  // reject sandbox auto-allow
```

The pattern: each `||` clause is a different class of bypass. New bypass discovered → new clause added. The structure is **fail closed** — if any check says "not safe," the whole thing rejects.

`LdK(M)` itself is the wrapper-or-rm check (chunks `_top_*`, line 205223-205225):

```javascript
function LdK(H) {
  return JdK.has(H) || jdK.has(H) || XdK.has(H) || H === "rm" || H === "rmdir";
}
```

`JdK`/`jdK`/`XdK` are the three wrapper sets (see [`bash_wrapper_deny.md`](./bash_wrapper_deny.md)). And `rm`/`rmdir` are *explicitly* in `LdK` — so they're already rejected at the static check level. But `v64` runs the dangerous-path check *anyway* in case the parser misses something or the wrapper-strip yields rm.

This is **belt-and-suspenders**: the static check at line 420617 catches `rm` early; the dangerous-path check at line 420574 catches the path target specifically.

---

## 7. Why Auto-Allow Has Two Code Paths (`v64` and `WA5`)

There are *two* auto-allow paths:

| Function | Trigger | AST? | Used for |
|---|---|---|---|
| `v64` | Compound command (line 420551-420579) | Yes | Multi-part shells (`a && b`) |
| `WA5` | Single-line command (line 420580-420632) | No | Plain commands |

`v64` has the safety check; `WA5` also has it but inlined slightly differently (uses the same `IX6` and `LdK` checks but on the unparsed split). The duplication is necessary because `v64` operates on the post-AST sub-commands while `WA5` operates on the pre-AST text.

The v2.1.116 fix landed in **both** paths — both now invoke `IX6` for `rm`/`rmdir` targets.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `sandboxAutoAllowWithSafetyCheck` (`v64`) — Compound-command sandbox fast-path with v2.1.116 rm safety
- `sandboxAutoAllowSingleLine` (`WA5`) — Single-line variant (also gets the fix)
- `sandboxAutoAllowRuleCheck` (`VA5`) — Rule-driven auto-allow without static analysis
- `dangerousPathCheck` (`IX6`) — Returns dangerous-result if rm/rmdir target hits critical path
- `isCriticalPath` (`nUH`) — Root/home/system-dir detector with v2.1.113 macOS `/private/` expansion
- `isSupportedSandboxCommand` (`bV`) — Gates which commands are eligible for sandbox auto-allow
- `isDangerousCommandHead` (`LdK`) — Returns true for `rm`, `rmdir`, and dangerous wrappers
- `dangerousCommandSet` (`GA5`) — Set of always-dangerous command heads
- `commandsWithArraySubscriptDanger` (`ZA5`) — Commands where `[...]` operands are problematic
- `positionalArgParsers` (`vdH`) — Per-command parser that extracts positional targets from argv
- `criticalPathRegex` (`ce1`, `le1`) — Regex tests for known-dangerous root-children
- `safeEnvVarPredicate` (`kdH`) — Returns true if env-var name is safe to use as prefix
- `sandboxController` (`n6`) — `isSandboxingEnabled`, `isAutoAllowBashIfSandboxedEnabled` getters
- `findDangerousFlags` (`gz6`) — `-exec`/`-delete` etc., see [`find_exec_delete_block.md`](./find_exec_delete_block.md)
